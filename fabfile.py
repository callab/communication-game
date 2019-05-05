"""
Fabric deployment script.
"""
from fabric import task

def archive(c):
    ref = c.local('git rev-parse --short HEAD', hide=True).stdout.strip()
    c.local(f"git archive -o {ref}.tar.gz HEAD")
    return ref

def build(c):
    c.local('yarn build-prod')

@task
def deploy(c):
    git_ref = archive(c)
    archive_filename = git_ref + '.tar.gz'

    with c.cd('/srv/app'):
        c.run(f"mkdir {git_ref}")

    with c.cd(f"/srv/app/{git_ref}"):
        c.put(archive_filename, remote=f"/srv/app/{git_ref}")
        c.run(f"tar xzvf {archive_filename}", hide=True)
        c.run('ln -s ../store.db store.db')

    build(c)
    c.local(f"rsync -rz public {c.user}@{c.host}:/srv/app/{git_ref}")

    with c.cd(f"/srv/app/{git_ref}"):
        c.run('./install.sh')
        c.run('./stop.sh')
        c.run('./start.sh')

    with c.cd('/srv/app'):
        c.run(f"ln -sf {git_ref} current")

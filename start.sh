# /bin/bash

# Utility script to start the app once deployed. Needed to cooperate with nvm
. ~/.nvm/nvm.sh
NODE_ENV=production yarn start

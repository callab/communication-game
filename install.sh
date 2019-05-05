# /bin/bash

# Utility script to install dependencies once deployed. Needed to cooperate
# with nvm
. ~/.nvm/nvm.sh
yarn install --prod

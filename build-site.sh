#! /usr/bin/env bash 
set -eoux pipefail
cd hugo-site 
hugo 
cd ..
cp -R hugo-site/public/ . 
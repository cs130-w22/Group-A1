# cya 👋
![example workflow](https://github.com/cs130-w22/Group-A1/actions/workflows/node.js.yml/badge.svg)
[![Release](https://img.shields.io/github/v/release/cs130-w21/template?label=release)](https://github.com/cs130-w21/template/releases/latest)

Ever step away from your phone for a few minutes and miss 1000+ messages as your friends start planning some impromptu get-together? It's not fun scrolling all the way through to try and find all the scheduling details, when2meet links, and polls that've gotten buried by the time you realize what you're missing.

Our web app hopes to solve that by centralizing everything in one place. Miss the message? No worries, your friends can invite everyone by username or send you the link directly! Chat popping off? It's fine, all the polls and scheduling are all on one page. 

Hope you enjoy!

## Building, Testing, & Deploying
The builds and deployments are handled automatically by Github Actions. Builds and tests are triggered whenever a pull request is made to `main`, or whenever a commit is made to `main`.

Deployments are triggered and made to Heroku whenever commits are made to `prod`. 

The frontend app is deployed at https://cya-client-cs130.herokuapp.com/ while the backend is deployed at https://cya-api-cs130.herokuapp.com/.

Please check [the wiki](https://github.com/cs130-w22/Group-A1/wiki/00-Deployment) for how to install locally from source or deploy to Heroku.

![image](https://user-images.githubusercontent.com/7966988/157182674-7112f35d-c43e-4d59-8464-70e60ce6dff9.png)

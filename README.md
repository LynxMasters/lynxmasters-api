# lynxmasters-api

[![Build Status](https://travis-ci.org/LynxMasters/lynxmasters-api.svg?branch=master)](https://travis-ci.org/LynxMasters/lynxmasters-api)

Lynxmasters Api
[Lynxmasters UI](https://github.com/LynxMasters/lynxmasters-ui)

## Table of Contents
- [Contributing](#contributing)
- [Running Locally](#run-locally)
- [API Testing](#api-testing)
- [Testing Sendgrid Locally](#testing-sendgrid-locally)
- [Contributors](#contributors)

## Contributing

To contribute to this project we ask that everyone follow the processes needed to avoid conflicts and issues with development lifecycle.

1. Following the issue tracker, pick your selected work focus
2. Create your own work branch following the described nomanclature:
 `name/user-endpoints` or `name/email-verification`

3. Commit and push your local changes to remote, adding the issue # you're working on in the commit message. This will reference your commit in the issue.

Example: `"#ISSUE_NUMBER: commit message"`

```sh
git commit -m "#12: user endpoints completed"
```

4. Open a Pull Request (Resolve any merge conflicts if needed)
5. Add the following reviewers
  **@ianarsenault** **@j-arsenault** **@tylerdcorwin** **@nmonty9**
6. Once peer reviewed your pull request will either be merged or changes will be requested



## Run Locally

[Install MongoDB](https://treehouse.github.io/installation-guides/mac/mongo-mac.html)

To run MongoDB

```sh
# starts mongodb
mongod
```


Next you will need to configure an env file
```bash
cp example.env .env
```

Open the newly created .env file and update the environment:
```
DEV_UPLOAD_LOCATION="/your/path/to/lynxmasters-ui/static/uploads"
NODE_ENV="dev"
```

To run API

```sh
cd path/to/project/root

# install dependencies
npm install

# run server at localhost:8081
npm run dev
```

For PC

```sh
# run server at localhost:8081
npm run dev:pc
```


## Testing SendGrid Locally
1. In server directory, create a new directory called `config`
```sh
cd path/to/project/root

# creates config directory
mkdir config

cd config
```
2. Create a `.env` file for sendgrid variables
```sh
# create .env file named sendgrid.env
echo "SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
```
3. Open up `sendgrid.env` and edit it to the following
```sh
SENDGRID_API_KEY='YOUR_SENDGRID_API_KEY_HERE'
NO_REPLY_EMAIL='do_not_reply@example.com'
SUBJECT='Custome subject....'
```
4. Sendgrid will now work

## Contributors

|  [![Nick Monty](https://i.imgur.com/zzcGOku.png?1)](https://github.com/nmonty9) | [![ianarsenault](https://avatars2.githubusercontent.com/u/12011826?s=80&v=4&s=40)](https://github.com/ianarsenault)  | [![Tyler Corwin](https://avatars1.githubusercontent.com/u/22626343?s=80&v=4)](https://github.com/tylerdcorwin) | [![j-arsenault](https://avatars0.githubusercontent.com/u/11837811?s=80&v=4)](https://github.com/j-arsenault)   |
| :--:|:--:|:--: | :--: |
|  [Nick Montalbano](https://github.com/nmonty9) | [Ian Arsenault](https://github.com/ianarsenault)  | [Tyler Corwin](https://github.com/tylerdcorwin) | [Jameson Arsenault](https://github.com/j-arsenault) |
# lynxmasters-api

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


## API Testing

To test out the API and various calls use a REST Client ([Insomnia](https://insomnia.rest/) or [Postman](https://www.getpostman.com/))

1. Open up your REST Client of choice
2. Make sure MongoDB and the server is running
```sh
# starts mongodb
mongod
```
```sh
cd path/to/project/root

# install dependencies
npm install

# run server at localhost:8081
npm run dev
```
3. Test the API by making various calls

Example: `http://localhost:8081/api/v1/users`

4. Should return the following

![Alt Text](https://i.imgur.com/nPafL4e.gif)

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
4. Uncomment line 92 in `server/models/users.js` like so..
```js
} else {
    // Send email verification
    sendEmailVerification(user)
```
5. Sendgrid will now work

## Contributors
....

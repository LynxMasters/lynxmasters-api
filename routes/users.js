let Users = require("../models/users")
let path = '/api/v1';

module.exports = (app) => {
  // Add new user
  app.post(`${path}/users`, (req, res) => {
    Users.addUser(req.body).then(
      (message) => {
        res.send(message)
      },
      (err) => {
        res.send(err)
      }
    ).catch(function (error) {
      return error
    })
  })


  // Fetch single user for testing API/Server works
  app.get(`${path}/users`, (req, res) => {
    res.send(
      [{
        firstName: "Ian",
        lastName: "Arsenault",
        dateCreated: new Date()
      }]
    )
  })

  // Fetch single user
  app.get(`${path}/users/:id`, (req, res) => {
    Users.fetchOne(req.params.id).then(
      (user) => {
        res.send(user)
      },
      (err) => {
        console.error(err)
      }
    )
  })

  // Login user
  app.post(`${path}/auth/login`, (req, res) => {
    Users.loginUser(req.body).then(
      (user) => {
        console.log('HITTING req.session.userId')
        //req.session.userId = user._id
        res.send(user)
      },
      (err) => {
        res.send(err)
      }
    )
  })

  // Verify Users Identifiers
  app.post(`${path}/users/identifiers/`, (req, res) => {
    Users.userVerificationCheck(req.body).then(
      (user) => {
        res.send(user)
      },
      (err) => {
        res.send(err)
      }
    )
  })

  // Update a user
  app.put(`${path}/users/:id`, (req, res) => {
    Users.updateOne(req.params.id, req.body).then(
      (success) => {
        res.send({success: true})
      },
      (err) => {
        res.send(err)
      }
    ).catch(function (error) {
      return error
    })
  })

  // Delete a user
  app.delete(`${path}/users/:id`, (req, res) => {
    Users.removeOne(req.params.id).then(
      (success) => {
        res.send({success: true})
      },
      (err) => {
        console.error(err)
      }
    )
  })


}
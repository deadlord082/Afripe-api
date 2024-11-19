var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var database = require('../db.js');
var hal = require('../hal.js');
var jwt = require('../jwt')

function authenticate(login, password) {
 
    const user = database.users.find((user) => {
      //compareSync(password en clair, password hashé en base)
      return user.pseudo === login && bcrypt.compareSync(password, user.password)
    });
    
    if (user === undefined) {
      return false;
   }
   else{
      return true;
   }
  }

  function isAdmin(pseudo) {
    const user = findUserByPseudo(pseudo);
    if (user === null) {
      return false;
    }
    else{
        return user.isAdmin;
    }
  }
  

  function findUserByPseudo(login) {
 
    const user = database.users.find((user) => {
      return user.pseudo === login
    });

    if (user === undefined) {
        return null;
    }
    else{
        return user;
    }
  }
   
  router.post("/login", (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;
  
    if (authenticate(login, password)) {
      if (!isAdmin(login)) {
        let responseObject = {
          _links: {
            self: hal.halLinkObject("/login"),
          },
          message: "Vous ne disposez pas des droits nécessaire. Merci de demander l'accès à votre administrateur réseau.",
        };
        //Sinon, on retourne un message d'erreur
        res.status(401).format({
          "application/hal+json": function () {
            res.send(responseObject);
          },
        });
      }
  
      //User est authentifié et admin: Génération d'un JSON Web Token
      const accessToken = jwt.createJWT(login, true, '1 day');
  
      //Si réussi, on va fournir un hypermédia JSON HAL (lien vers reservations pour un concert + access token)
      let responseObject = {
        _links: {
          self: hal.halLinkObject("/login"),
          //Indiquer au client les URL /fields/1/reservations, /fields/2/reservations, etc.
          reservations: hal.halLinkObject(
            "/fields/{id}/reservations",
            "string",
            "",
            true
          ),
        },
        jwt: accessToken,
        message: `Bienvenue ${login} !`,
      };
  
      res.status(200).format({
        "application/hal+json": function () {
          res.send(responseObject);
        },
      });
    } else {
      let responseObject = {
        _links: {
          self: hal.halLinkObject("/login"),
        },
        message: "Vos identifiants sont invalides. Merci de rééssayer.",
      };
      //Sinon, on retourne un message d'erreur
      res.status(401).format({
        "application/hal+json": function () {
          res.send(responseObject);
        },
      });
    }
  });
  
   
  module.exports = router;
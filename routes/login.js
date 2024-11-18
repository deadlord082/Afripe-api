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
   
    if (user === undefined) return false;
   
    return true;
  }

  function isAdmin(pseudo) {
    const user = findUserByPseudo(pseudo);
    return user && user.isAdmin;
  }
  

  function findUserByPseudo(login) {
 
    const user = database.users.find((user) => {
      return user.pseudo === login
    });
   
    if (user === undefined) {
        return false;
    }
    else{
        return true;
    }
  }
   
  router.post("/login", (req, res, next) => {
    const login = req.body.pseudo;
    const password = req.body.password;
  
    if (authenticate(login, password)) {
      if (!isAdmin(login, password)) {
        //A completer avec une reponse propre
        res.status(401).send("Go away !");
        return;
      }
  
      //User est authentifié et admin: Génération d'un JSON Web Token
      const accessToken = jwt.createJWT(login, true, '1 day');
  
      //Si réussi, on va fournir un hypermédia JSON HAL (lien vers reservations pour un concert + access token)
      let responseObject = {
        _links: {
          self: hal.halLinkObject("/login"),
          //Indiquer au client les URL /concerts/1/reservations, /concerts/2/reservations, etc.
          reservations: hal.halLinkObject(
            "/concerts/{id}/reservations",
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
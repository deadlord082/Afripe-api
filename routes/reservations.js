var express = require("express");
var router = express.Router();
var db = require("../db");
var hal = require("../hal");
var { checkTokenMiddleware } = require("../jwt");


router.get(
  "/fields/:id(\\d)+/reservations",
  (req, res, next) => {
    // console.log(res.locals.decodedToken)
    const reservationsOfField = db.reservations.filter((resa) => {
      return resa.hasOwnProperty('field_id') && resa.field_id === Number(req.params.id)
    });
// 
// Vérification si il existe des réservations ayant l'id du terrain
//     
    if(reservationsOfField.length == 0){
      let responseObject = {
        _links: {
          self: hal.halLinkObject("/fields/"+Number(req.params.id)+"/reservations"),
        },
        message: "Aucune réservations existe ou le terrain n'existe pas. Merci de rééssayer.",
      };
      res.status(401).format({
        "application/hal+json": function () {
          res.send(responseObject);
        },
      });
    }
    else{
      const reservationsRessourceObject = hal.mapReservationListToResourceObject(reservationsOfField)
      res.status(200).json(reservationsRessourceObject);
    }
  }
);

router.post(
  "/fields/:id(\\d)+/reservations",
  checkTokenMiddleware,
  (req, res, next) => {
// 
// vérification des paramètres (c'est pas beau)
//     
    let erreur = false

    if(req.body.day === undefined || req.body.time === undefined){
      erreur = true
    }
    else if (req.body.day !== "Lundi" && req.body.day !== "Mardi" && req.body.day !== "Mercredi" && req.body.day !== "Jeudi" && req.body.day !== "Vendredi" && req.body.day !== "Samedi"){
      erreur = true
    }
    else {
      const time = req.body.time.split(":")
      if(time.length() !== 2 && 10 <= Number(time[0]) <= 22 && 0 <= Number(time[1]) <= 59){
        erreur = true
      }
    }
    
    if(erreur){
      let responseObject = {
        _links: {
          self: hal.halLinkObject("/fields/"+Number(req.params.id)+"/reservations"),
        },
        message: "Veuiller préciser une journée(Lundi,Mardi,...) et une heure(entre 10H et 22H) pour votre réservation.",
      };
      //Sinon, on retourne un message d'erreur
      res.status(401).format({
        "application/hal+json": function () {
          res.send(responseObject);
        },
      });
    }
    else{
// 
// vérification si le terrain est ouvert
//   
      const field = db.fields.find((field) => field.id == req.params.id);
      if(field.isOpen == false){
        let responseObject = {
          _links: {
            self: hal.halLinkObject("/fields/"+Number(req.params.id)+"/reservations"),
          },
          message: "Le terrain n'est pas disponible pour le moment.",
        };
        res.status(401).format({
          "application/hal+json": function () {
            res.send(responseObject);
          },
        });
      }
// 
// Création de la réservation
//   
      else{
        const newReservation = new db.Reservation(db.reservations.length+1,req.body.day,req.body.time,Number(req.params.id));
        db.reservations.push(newReservation)
        const reservationRessourceObject = hal.mapReservationToResourceObject(newReservation)
        res.status(201).json(reservationRessourceObject);
      }
    }
  }
);

router.delete(
  "/fields/:id_fields(\\d+)/reservations/:id(\\d+)",
  checkTokenMiddleware,
  (req, res, next) => {
  const reservation = db.reservations.find((resa) => resa.id == req.params.id);
  if(reservation === undefined){
    let responseObject = {
      _links: {
        self: hal.halLinkObject("/fields/"+Number(req.params.id_fields)+"/reservations/"+Number(req.params.id)),
      },
      message: "La réservation que vous essayer de suppimmer n'existe pas",
    };
    res.status(401).format({
      "application/hal+json": function () {
        res.send(responseObject);
      },
    });
  }
  else{
    const index = db.reservations.indexOf(reservation);
    db.reservations.splice(Number(index),1)
    //code 204 et chercher quoi renvoyer hal
    res.status(202).format({
      'application/json': () => {
        res.send({success:"Succeffully deleted",reservations:db.reservations});
      }
    })
  }
})


module.exports = router;
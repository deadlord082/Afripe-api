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
// vérification des paramètres(seulement si il existe)
//     
    if(req.body.date === undefined || req.body.time === undefined){
      let responseObject = {
        _links: {
          self: hal.halLinkObject("/fields/"+Number(req.params.id)+"/reservations"),
        },
        message: "Veuiller préciser une date et une heure pour votre réservation.",
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
        const newReservation = new db.Reservation(db.reservations.length+1,req.body.date,req.body.time,Number(req.params.id));
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
  const index = db.reservations.indexOf(reservation);
  db.reservations.splice(Number(index),1)
  //code 204 et chercher quoi renvoyer hal
  res.status(202).format({
    'application/json': () => {
      res.send({success:"Succeffully deleted",reservations:db.reservations});
    }
  })
})


module.exports = router;
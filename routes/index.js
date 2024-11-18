var express = require('express');
var router = express.Router();
var db = require('../db.js');
var hal = require('../hal.js');


router.get('/concerts', (req, res) => {
  const concertsRessourceObject = hal.mapConcertlisttoResourceObject(db.concerts)
  res.status(200).json(concertsRessourceObject);
});

router.get('/concerts/:id(\\d+)', (req, res) => {
  const concert = db.concerts.find((concert) => concert.id == req.params.id);
  if(concert === undefined){
    res.status(404).json({})
  }
  else{
    const concertRessourceObject = hal.mapConcertoResourceObject(concert)
    res.status(200).json(concertRessourceObject);
  }
})

router.get('/users', (req, res) => {
  const usersRessourceObject = hal.mapUserlisttoResourceObject(db.users)
  res.status(200).json(usersRessourceObject);
})

router.get('/users/:id(\\d+)', (req, res) => {
  const user = db.users.find((user) => user.id == req.params.id);
  if(user === undefined){
    res.status(404).json({})
  }
  else{
    const userRessourceObject = hal.mapUsertoResourceObject(user)
    res.status(200).json(userRessourceObject);
  }
})

router.get('/users/:id(\\d+)/reservations', (req, res) => {
  //peut pas faire 2 foit la meme résa, dans form rajouter le pseudo de l'utilisateur
  const reservations = db.reservations.find((resa) => resa.user_id == req.params.id);
  res.status(200).format({
      'application/json': () => {
          res.send(reservations);
      }
  })
})

router.post('/concerts/:id(\\d+)/reservations', (req, res) => {
  //TODO: récupérer l'user_id du client connecté
  db.reservations.push(new db.Reservation(db.reservations.length+1,req.body.status,req.body.date,"user_id",req.params.id))
  res.status(201).format({
      'application/json': () => {
          res.send({succes:"Succeffully added",reservations:db.reservations});
      }
  })
})

router.get('/concerts/:id_concerts(\\d+)/reservations/:id(\\d+)', (req, res) => {
  const reservation = db.reservation.find((resa) => resa.id == req.params.id);
  res.status(200).format({
      'application/json': () => {
          res.send(reservation);
      }
  })
})

router.put('/concerts/:id_concerts(\\d+)/reservations/:id(\\d+)', (req, res) => {
  //var reservation = db.reservations.find((el) => el.id == req.params.id);
  //reservation.user_id = req.body.user_id;
  //reservation.concert_id = req.body.concert_id;

  const position = db.reservations.indexOf((resa) => resa.id = req.params.id)
  db.reservations[position +1].status = req.body.status;
  db.reservations[position +1].date = req.body.date;

  res.status(201).format({
      'application/json': () => {
          res.send(db.reservations.find((resa) => resa.id == req.params.id));
      }
  })
})

router.delete('/concerts/:id_concerts(\\d+)/reservations/:id(\\d+)', (req, res) => {
  //const reservation = db.reservations.find((el) => el.id == req.params.id);
  const reservation = db.reservations.find((resa) => resa.id = req.params.id)
  db.reservations.splice(reservation,1)
  res.status(200).format({
      'application/json': () => {
          res.send({success:"Succeffully deleted",reservations:db.reservations});
      }
  })
})

router.get('/reservations', (req, res) => {
  res.status(200).format({
      'application/json': () => {
          res.send(db.reservations);
      }
  })
})

module.exports = router;

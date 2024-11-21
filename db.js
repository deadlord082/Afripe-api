var bcrypt = require('bcrypt');

//Salt pour le hashage des mots de passe
const saltOrRounds = 5;

//Les Modèles de données

class Field {
  constructor(id, name, isOpen) {
    this.id = id;
    this.name = name;
    this.isOpen = isOpen;
  }
}

class Reservation {
  constructor(id, day, time, field_id) {
    this.id = id;
    this.day = day;
    this.time = time;
    this.field_id = field_id;
  }
}


class User {
  constructor(id,pseudo, password = '', isAdmin = false){
    this.id = id;
    this.pseudo = pseudo;
    //On conserve les mots de passe hashés
    this.password = bcrypt.hashSync(password, saltOrRounds );
    this.isAdmin = isAdmin
  }
}

//La base de données
const fields = [
  new Field(
    1,
    "A",
    true
  ),
  new Field(
    2,
    "B",
    false
  ),
  new Field(
    3,
    "C",
    true
  ),
  new Field(
    4,
    "D",
    true
  ),
];


const users = [new User(1,'admybad', 'admybad', true)];

const reservations = [
  new Reservation(
    1,
    "Lundi",
    "29:02",
    1
  ),
  new Reservation(
    2,
    "Mardi",
    "31:73",
    1
  ),
  new Reservation(
    3,
    "Vendredi",
    "83:84",
    2
  ),
  new Reservation(
    4,
    "Jeudi",
    "54:28",
    3
  ),
];


module.exports = { fields, users ,reservations,Reservation,Field};
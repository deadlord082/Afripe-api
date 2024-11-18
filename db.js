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

class Reservation {}


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

//On imagine que l'admin a lui même fourni les données
const users = [new User(1,'admybad', 'admybad', true)];

const reservations = [];    
module.exports = { fields, users };
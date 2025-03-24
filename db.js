var bcrypt = require('bcrypt');
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

const saltOrRounds = 5;

//Les Modèles de données

class User {
  constructor(id, name, email, password = '', image, lang){
    this.id = id;
    this.name = name;
    this.email = email;
    //On conserve les mots de passe hashés
    this.password = bcrypt.hashSync(password, saltOrRounds );
    this.image = image;
    this.lang = lang
  }
}

class Product {
  constructor(id, name, description, quantity, size, image, category_id, user_id, price, is_available){
    this.id = id;
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.size = size;
    this.image = image;
    this.category_id = category_id;
    this.user_id = user_id;
    this.price = price;
    this.is_available = is_available;
  }
}

class Category {
  constructor(id, name){
    this.id = id;
    this.name = name;
  }
}

class Booking {
  constructor(id, user_id, product_id, date_start, date_end){
    this.id = id;
    this.user_id = user_id;
    this.product_id = product_id;
    this.date_start = date_start;
    this.date_end = date_end;
  }
}

class Message {
  constructor(id, message, booking_id){
    this.id = id;
    this.message = message;
    this.booking_id = booking_id;
  }
}

class Rewiew {
  constructor(id, rating, rewiew, product_id, user_id){
    this.id = id;
    this.rating = rating;
    this.rewiew = rewiew;
    this.product_id = product_id;
    this.user_id = user_id;
  }
}

connection.connect()

// Example
connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

const users = connection.query('SELECT * FROM users', (err, rows, fields) => {
  if (err) throw err
  console.log('Error : ', rows)
})

connection.end()


module.exports = { users ,User };
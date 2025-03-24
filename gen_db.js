const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect()

connection.query(`
    SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : 'afripe'
--

-- --------------------------------------------------------

--
-- Structure de la table 'booking'
--

CREATE TABLE 'booking' (
  'id' int(11) NOT NULL,
  'user_id' int(11) NOT NULL,
  'product_id' int(11) NOT NULL,
  'date_start' date NOT NULL,
  'date_end' date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table 'category'
--

CREATE TABLE 'category' (
  'id' int(11) NOT NULL,
  'name' varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table 'message'
--

CREATE TABLE 'message' (
  'id' int(11) NOT NULL,
  'message' text NOT NULL,
  'booking_id' int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table 'product'
--

CREATE TABLE 'product' (
  'id' int(11) NOT NULL,
  'name' varchar(255) NOT NULL,
  'description' varchar(500) NOT NULL,
  'quantity' smallint(6) NOT NULL,
  'size' char(10) NOT NULL,
  'image' varchar(255) NOT NULL,
  'category_id' int(11) NOT NULL,
  'user_id' int(11) NOT NULL,
  'price' int(11) NOT NULL,
  'is_available' varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table 'review'
--

CREATE TABLE 'review' (
  'id' int(11) NOT NULL,
  'rating' int(11) NOT NULL,
  'review' text NOT NULL,
  'product_id' int(11) NOT NULL,
  'user_id' int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table 'user'
--

CREATE TABLE 'user' (
  'id' int(11) NOT NULL,
  'name' varchar(255) NOT NULL,
  'email' varchar(255) NOT NULL,
  'password' varchar(255) NOT NULL,
  'image' varchar(255) NOT NULL,
  'lang' varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table 'booking'
--
ALTER TABLE 'booking'
  ADD PRIMARY KEY ('id'),
  ADD KEY 'user_id' ('user_id'),
  ADD KEY 'product_id' ('product_id');

--
-- Index pour la table 'category'
--
ALTER TABLE 'category'
  ADD PRIMARY KEY ('id');

--
-- Index pour la table 'message'
--
ALTER TABLE 'message'
  ADD PRIMARY KEY ('id'),
  ADD KEY 'booking_id' ('booking_id');

--
-- Index pour la table 'product'
--
ALTER TABLE 'product'
  ADD PRIMARY KEY ('id'),
  ADD KEY 'category_id' ('category_id'),
  ADD KEY 'user_id' ('user_id');

--
-- Index pour la table 'review'
--
ALTER TABLE 'review'
  ADD PRIMARY KEY ('id'),
  ADD KEY 'product_id' ('product_id'),
  ADD KEY 'user_id' ('user_id');

--
-- Index pour la table 'user'
--
ALTER TABLE 'user'
  ADD PRIMARY KEY ('id');

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table 'booking'
--
ALTER TABLE 'booking'
  MODIFY 'id' int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table 'category'
--
ALTER TABLE 'category'
  MODIFY 'id' int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table 'message'
--
ALTER TABLE 'message'
  MODIFY 'id' int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table 'product'
--
ALTER TABLE 'product'
  MODIFY 'id' int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table 'review'
--
ALTER TABLE 'review'
  MODIFY 'id' int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table 'user'
--
ALTER TABLE 'user'
  MODIFY 'id' int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table 'booking'
--
ALTER TABLE 'booking'
  ADD CONSTRAINT 'booking_ibfk_1' FOREIGN KEY ('user_id') REFERENCES 'user' ('id') ON DELETE CASCADE,
  ADD CONSTRAINT 'booking_ibfk_2' FOREIGN KEY ('product_id') REFERENCES 'product' ('id') ON DELETE CASCADE;

--
-- Contraintes pour la table 'message'
--
ALTER TABLE 'message'
  ADD CONSTRAINT 'message_ibfk_1' FOREIGN KEY ('booking_id') REFERENCES 'booking' ('id') ON DELETE CASCADE;

--
-- Contraintes pour la table 'product'
--
ALTER TABLE 'product'
  ADD CONSTRAINT 'product_ibfk_1' FOREIGN KEY ('category_id') REFERENCES 'category' ('id') ON DELETE CASCADE,
  ADD CONSTRAINT 'product_ibfk_2' FOREIGN KEY ('user_id') REFERENCES 'user' ('id');

--
-- Contraintes pour la table 'review'
--
ALTER TABLE 'review'
  ADD CONSTRAINT 'review_ibfk_1' FOREIGN KEY ('product_id') REFERENCES 'product' ('id') ON DELETE CASCADE,
  ADD CONSTRAINT 'review_ibfk_2' FOREIGN KEY ('user_id') REFERENCES 'user' ('id');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
    `, (err, rows, fields) => {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
});


connection.end()
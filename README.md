# API RESTFULL de billeterie de concerts

## table des matières



## Lancer le projet

installer les dépendances et lancer le service.
~~~bash
npm install
npm run start
~~~

Url d'entrée du service
~~~bash
curl localhost:3000
~~~

## Conception

### Dictionnaire des données

| Code  | Libellé | Type | Obligatoire | Remarques/Contraintes |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| id-terrain  | L'identifiant d'un terrain  | N | oui | unique |
| nom | nom d'un terrain  | AN | oui |  |
| is-open | si un terrain est disponible  | b | oui |  |
| id-réservation  | L'identifiant d'une réservation  | N | oui | unique |
| day | jour d'une réservation | AN | oui | valeur : Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi |
| time | heure d'une réservation | T | oui | format: HH:MM |
| id-utilisateur  | L'identifiant d'un utilisateur  | N | oui | unique |
| pseudo | pseudo d'un utilisateur | AN | oui |  |
| password | mot de passe d'un utilisateur | AN | oui | doit être hashé |
| is-admin | si un utilisateur est administrateur | b | oui |  |

### Liste des ressources

| Ressource  | URL | Méthodes HTTP  | Paramètre d'URL | Commentaires |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Liste des terrains  | /fields  | GET, HEAD, OPTION  |   |   |
| les informations d'un terrains  | /fields/{id terrain}  | GET, HEAD, OPTION  |   |   |
| Modifier un terrain  | /fields/{id terrain}  | PUT, HEAD, OPTION  |   | PUT est réservée au admin  |
| s'identifier  | /login  | POST, HEAD, OPTION  |   |   |
| Liste des réservations d'un terrains  | /fields/{id terrain}/réservations  | GET, HEAD, OPTION  |   |   |
| Ajouter/supprimmer une réservations  | /fields/{id terrain}/réservations/{id réservation}  | POST, DELETE, HEAD, OPTION  |   | POST et DELETE réservée au admin   |

## Sécurité

- Toutes ressources permettant de modifiéer une donnée est protégée, seul l'administrateur peut y accéder.
- Toutes ressources ayant dans l'url un id. cette id est vérifié de façon a éviter les renvoie d'erreurs
- Toutes ressources POST et PUT vérifie l'envoie du corps du client

## Remarques

none

## Références

- https://github.com/paul-schuhm/web-api/tree/main/demos/api-billeterie-live
- stackOverFlow plusieurs tickets
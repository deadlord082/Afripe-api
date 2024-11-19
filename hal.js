/**
 * Export des fonctions helpers pour la spécification HAL
 * Voir la spécification HAL : https://stateless.group/hal_specification.html
 * Voir la spécification HAL (RFC, source) : https://datatracker.ietf.org/doc/html/draft-kelly-json-hal
 */

/**
 * Retourne un Link Object, conforme à la spécification HAL
 * @param {*} url 
 * @param {*} type 
 * @param {*} name 
 * @param {*} templated 
 * @param {*} deprecation 
 * @returns 
 */
function halLinkObject(path, type = '', name = '', templated = false, deprecation = false) {

    return {
        "href": path,
        "templated": templated,
        ...(type && { "type": type }),
        ...(name && { "name": name }),
        ...(deprecation && { "deprecation": deprecation })
    }
}

/**
 * Retourne une représentation Ressource Object (HAL) d'un terrain
 * @param {*} fieldtData Données brutes d'un terrain
 * @returns un Ressource Object Field (spec HAL)
 */
function mapFieldToResourceObject(fieldData) {
    return {
        "_links": {
            "self": halLinkObject(`/fields/${fieldData.id}`),
            "fields": halLinkObject(`/fields`),
            "book": halLinkObject(`/fields/${fieldData.id}/reservations`),
        },
        fieldData
    }
}

function mapFieldListToResourceObject(fieldsData) {

    return {
        "_links": {
            "self": halLinkObject(`/fields`),
            "find": halLinkObject(`/fields/{?id}`)
        },
        "embedded": {
            "Fields":[
                fieldsData.map(field => mapFieldToResourceObject(field))
            ]
        }
    }
}


function mapUsertoResourceObject(userData) {
    return {
        "_links": {
            "self": halLinkObject(`/users/${userData.id}`),
            "users": halLinkObject(`/users`)
        },
        userData
    }
}

function mapUserlisttoResourceObject(usersData) {

    return {
        "_links": {
            "self": halLinkObject(`/users`),
            "find": halLinkObject(`/users/{?id}`)
        },
        "embedded": {
            "Users":[
                usersData.map(user => mapUsertoResourceObject(user))
            ]
        }
    }
}

function mapReservationToResourceObject(reservationData) {
    return {
        "_links": {
            "self": halLinkObject(`/fields/${reservationData.field_id}/reservations/${reservationData.id}`),
            "delete": halLinkObject(`/fields/${reservationData.field_id}/reservations/${reservationData.id}`),
            "reservations": halLinkObject(`/fields/{?id}/reservations`)
        },
        reservationData
    }
}

function mapReservationListToResourceObject(reservationsData) {

    return {
        "_links": {
            "self": halLinkObject(`/fields/{?id}/reservations`),
            "find": halLinkObject(`/fields/{?id}/reservations/{?id}`),
            "create": halLinkObject(`/fields/{?id}/reservations`),
            "delete": halLinkObject(`/fields/{?id}/reservations/{?id}`)
        },
        "embedded": {
            "Reservations":[
                reservationsData.map(resa => mapReservationToResourceObject(resa))
            ]
        }
    }
}


module.exports = { 
    halLinkObject,
    mapFieldToResourceObject ,
    mapFieldListToResourceObject,
    mapUsertoResourceObject,
    mapUserlisttoResourceObject,
    mapReservationToResourceObject,
    mapReservationListToResourceObject,
};

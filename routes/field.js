var express = require('express');
var router = express.Router();
var db = require('../db.js');
var hal = require('../hal.js');

router.get('/fields', (req, res) => {
    const fieldsRessourceObject = hal.mapFieldListToResourceObject(db.fields)
    res.status(200).json(fieldsRessourceObject);
});

router.get('/fields/:id(\\d+)', (req, res) => {
    const field = db.fields.find((field) => field.id == req.params.id);
    if(field === undefined){
        res.status(404).json({})
    }
    else{
        const fieldRessourceObject = hal.mapFieldToResourceObject(field)
        res.status(200).json(fieldRessourceObject);
    }
})

module.exports = router;

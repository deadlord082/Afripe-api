var express = require('express');
var router = express.Router();
var db = require('../db.js');
var hal = require('../hal.js');
var { checkTokenMiddleware } = require("../jwt");

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

router.put(
    "/fields/:id(\\d+)",
    checkTokenMiddleware,
    (req, res, next) => {
        const field = db.fields.find((field) => field.id == req.params.id);
    if(field === undefined){
        res.status(404).json({})
    }
    else{
        const index = db.fields.indexOf(field);
        const newField = new db.Field(field.id,req.body.name,req.body.isOpen)
        db.fields.splice(Number(index),1,newField)
        const fieldRessourceObject = hal.mapFieldToResourceObject(newField)
        res.status(202).json(fieldRessourceObject);
    }
  })

module.exports = router;

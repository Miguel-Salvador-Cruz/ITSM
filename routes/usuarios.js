const express = require('express');
const Usuario = require('../models/usuario_model');
const Joi = require('@hapi/joi');
const ruta = express.Router();

const schema = Joi.object({
    noControl: Joi.string()
        .min(3)
        .max(40),

    nombre: Joi.string()
        .min(3)
        .max(50)
        .required()
});

ruta.get('/',(req, res) => {
    let resultado = listarUsuarioActivos();
    resultado.then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json(
            {
                err
            }
        )
    })
});

ruta.get('/:noControl',(req, res) => {
    let resultado = mostrarUsuario(req.params.noControl);
    resultado.then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json(
            {
                err
            }
        )
    })
});

ruta.post('/', (req, res) => {
    let body = req.body;

    const {error, value} = schema.validate({nombre: body.nombre, noControl: body.noControl});
    if(!error){
        let resultado = crearUsuario(body);

        resultado.then( user => {
            res.json({
                valor: user
            })
        }).catch( err => {
            res.status(400).json({
                err
            })
        });
    }else{
        res.status(400).json({
            error
        })
    }    
});

ruta.put('/:noControl', (req, res) => {

    const {error, value} = schema.validate({nombre: req.body.nombre});

    if(!error){
        let resultado = actualizarUsuario(req.params.noControl, req.body);
        resultado.then(valor => {
            res.json({
                valor
            })
        }).catch(err => {
            res.status(400).json({
                err
            })
        });
    }else{
        res.status(400).json({
            error
        })
    }

    
});

ruta.delete('/:noControl', (req, res) => {
    let resultado = desactivarUsuario(req.params.noControl);
    resultado.then(valor => {
        res.json({
            usuario: valor
        })
    }).catch(err => {
        res.status(400).json({
            err
        })
    });
});

//-------------------------------------------------------------------------------------------------------------

async function crearUsuario(body){
    let usuario = new Usuario({
        noControl   : body.noControl,
        nombre      : body.nombre,
        password    : body.password,
        creditos    : body.creditos,
        promedio    : body.promedio,
        repite      : body.repite,
        especial    : body.especial
    });
    return await usuario.save();
}

async function listarUsuarioActivos(){
    let usuarios = await Usuario.find({"estado": true});
    return usuarios;
}

async function mostrarUsuario(noControl){
    let usuarios = await Usuario.find({"noControl": noControl});
    return usuarios;
}

async function actualizarUsuario(noControl, body){
    let usuario = await Usuario.findOneAndUpdate({"noControl": noControl}, {
        $set: {
            nombre      : body.nombre,
            password    : body.password,
            creditos    : body.creditos,
            promedio    : body.promedio,
            repite      : body.repite,
            especial    : body.especial
        }
    }, {new: true});
    return usuario;
}

async function desactivarUsuario(noControl){
    let usuario = await Usuario.findOneAndUpdate({"noControl": noControl}, {
        $set: {
            estado: false
        }
    }, {new: true});
    return usuario;
}

module.exports = ruta;

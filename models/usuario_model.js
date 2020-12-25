const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    noControl: {
        type:String,
        required: true
    },
    nombre: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String,
        required: false        
    },
    repite: {type:[String], default: "0"},
    especial: {type:[String], default: "0"},
    creditos:{type:String, required: true},
    promedio: {type:String, required: true}
});

module.exports = mongoose.model('Usuario', usuarioSchema);


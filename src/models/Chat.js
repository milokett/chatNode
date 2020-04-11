const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema ({
    nick: String,
    msj: String, 
    creado_en: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Chat', chatSchema);
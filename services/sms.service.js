"use strict";
require('dotenv').config();
const twilio= require('twilio');
const { service } = require('moleculer-web');

const accountSid = process.env.ACCOUNT_SID;
const authToken= process.env.AUTH_TOKEN;


module.exports = {
    name: 'sms',
    events: {
      // Evento que escucha el servicio
    "send.sms"(payload) {
        // El payload contendrá el número y el mensaje
        const { to, body } = payload;
        // Validacion del cuerpo del payload
        if(!to || !body) {
            return Promise.reject(new Error("El numero de telefono y el mensaje son requeridos"));
        }

    
    try{
        const client = twilio(accountSid, authToken);

        client.messages.create({
            body: body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
        })
        .then(message => {
        console.log(`Mensaje enviado: ${message.sid}`);
        })
        .catch(err => {
        console.error("Error al enviar el mensaje:", err.message);
        });
        
    } catch(err) {
        return Promise.reject(new Error("Error al enviar el mensaje"));
        }
    }
}
};
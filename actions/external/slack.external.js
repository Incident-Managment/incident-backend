// actions/external/slack.external.js
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

module.exports = {
    async sendMessage(ctx) {
        const { channel, text } = ctx.params;
        const token = process.env.SLACK_TOKEN;  // Aquí tomamos el token de las variables de entorno

        if (!token) {
            throw new Error('El token de Slack no está configurado');
        }

        const web = new WebClient(token);  // Inicializamos el WebClient con el token

        try {
            const result = await web.chat.postMessage({
                channel: channel,  // Canal al que se enviará el mensaje
                text: text          // El mensaje a enviar
            });

            return `Mensaje enviado al canal ${channel}: ${text}`;
        } catch (error) {
            console.error('Error enviando mensaje a Slack:', error);
            throw new Error('No se pudo enviar el mensaje a Slack');
        }
    }
};

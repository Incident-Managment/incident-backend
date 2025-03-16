"use strict";

const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: "dc8415bf",
  apiSecret: "xqlliMj2XalumJG9"
});

module.exports = {
  name: "sendSMS",
  actions: {
    async sendSMS(ctx) {
      let { to, from, text } = ctx.params;
      if (!to.startsWith('+')) {
        to = `+52${to}`;
      }
      try {
        const resp = await vonage.sms.send({ to, from, text });
        return { success: true, response: resp };
      } catch (err) {
        return { success: false, error: err };
      }
    }
  }
};
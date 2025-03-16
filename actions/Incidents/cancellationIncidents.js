// Install the Vonage SDK
// Run the following command in your terminal:
// npm install @vonage/server-sdk

// Import the Vonage SDK
const { Vonage } = require('@vonage/server-sdk');

// Initialize the Vonage instance with your API credentials
const vonage = new Vonage({
  apiKey: "dc8415bf",
  apiSecret: "xqlliMj2XalumJG9"
});

// Define the sender, recipient, and message text
const from = "Vonage APIs";
const to = "526646141705";
const text = 'A text message sent using the Vonage SMS API';

// Function to send SMS
async function sendSMS() {
    await vonage.sms.send({to, from, text})
        .then(resp => { 
            console.log('Message sent successfully'); 
            console.log(resp); 
        })
        .catch(err => { 
            console.log('There was an error sending the messages.'); 
            console.error(err); 
        });
}

// Call the function to send the SMS
sendSMS();
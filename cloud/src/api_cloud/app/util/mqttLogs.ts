// import mqtt from 'mqtt';

// // Configuration de la connexion MQTT
// const mqttBrokerUrl = 'mqtt://api_local'; // Remplacez par l'URL de votre broker MQTT
// const mqttClient = mqtt.connect(mqttBrokerUrl);

// mqttClient.on('connect', () => {
//     console.log('Connecté au broker MQTT');

//     // Abonnez-vous aux sujets MQTT pertinents
//     mqttClient.subscribe('votre/sujet'); // Remplacez par le sujet MQTT que vous souhaitez écouter
// });

// mqttClient.on('message', (topic, message) => {
//     console.log(`Message reçu sur le sujet "${topic}": ${message.toString()}`);

//     // const axios = require('axios');
//     // const apiUrl = 'http://api_local/device'; // Remplacez par l'URL de votre route Express
//     // axios.get(apiUrl)
//     //     .then(response => {
//     //         console.log('Appel réussi à la route de l\'API Express :', response.data);
//     //     })
//     //     .catch(error => {
//     //         console.error('Erreur lors de l\'appel à la route de l\'API Express :', error);
//     //     });
// });
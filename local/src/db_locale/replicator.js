import redis from 'redis';

// si connexion internet
// const connect = async () => {
//     const response = await fetch('API/health');
//     const myJson = await response.json(); //extract JSON from the http response
//     if(myJson == 200) {
//         // connected
//         const client = await redisConnection()
//         client.get('data', (err, data) => {
//             if(err) {
//                 console.error(err);
//                 throw err;
//             }

//             if(data) {

//             }
//         })
//         // récupérer les données de la base

//         // envoyer les données à la base mysql, socket.io? (web sockets)
//         // vider la base redis
//     } else {
//         // not connected
//         // R
//     }
    
//   }
// const redisConnection = async () => {
    const client = redis.createClient({
        url: 'redis://admin:pass@redislocale:6379/'
    })
    await client.connect()

    client.get('data', (err, data) => {
        if(err) {
            console.error(err);
            throw err;
        }

        if(data) {
            console.log(data)
        }
    })


    // return client
// }




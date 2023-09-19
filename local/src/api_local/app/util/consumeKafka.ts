import { kafka } from '../config/kafka.config'
import axios from 'axios';
import jwt from 'jsonwebtoken';
import logger from './logger'

const regex = /(POST|PUT|DELETE) ([^"]+) ({.*})?/g;
const routePfx = 'http://api_cloud:3010';

const secretKey = process.env.SECRET_KEY || "secret_key"

const token = jwt.sign({
    id: "fix-id-token",
    email: "fix-email-token",
    isadmin: "fix-admin-token"
}, secretKey, { expiresIn: '3 hours' })

const headers = {
    'Authorization': `${token}`,
    'sync': '0'
};

const consumer = kafka.consumer({ groupId: 'airlux-redis' });

export async function subscribeToKafkaTopic(topicName: string) {
    await consumer.connect();
    await consumer.subscribe({ topic: topicName, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value !== null) {
                const messageValue = message.value.toString();
                let match;
                while ((match = regex.exec(messageValue)) !== null) {
                    const method = match[1];
                    const route = routePfx + match[2];
                    const body = match[3]

                    if (method === "POST") {
                        await axios.post(route, JSON.parse(body), { headers });
                    } else if (method === "PUT") {
                        await axios.put(route, JSON.parse(body), { headers });
                    } else if (method === "DELETE") {
                        await axios.delete(route, { headers });
                    }
                }

            }

        },
    });
}
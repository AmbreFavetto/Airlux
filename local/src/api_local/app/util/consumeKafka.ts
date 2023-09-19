import { kafka } from '../config/kafka.config'
import { io } from '../main'
import { EachMessagePayload } from 'kafkajs';
import logger from '../util/logger'

const consumer = kafka.consumer({ groupId: 'airlux' });

export async function subscribeToKafkaTopic(topicName: string) {
    await consumer.connect();
    await consumer.subscribe({ topic: topicName, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value !== null) {
                const messageValue = message.value.toString();
                logger.info(messageValue)
                // add in db
            }

        },
    });
}
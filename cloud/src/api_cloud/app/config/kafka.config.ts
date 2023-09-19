import { Kafka, Producer, Partitioners } from 'kafkajs'

const kafka = new Kafka({
    clientId: 'airlux-client',
    brokers: ['kafka:9092'],
});

const producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

export async function sendToKafka(topic: string, message: string) {
    try {
        await producer.connect();
        await producer.send({
            topic: topic,
            messages: [
                {
                    value: message,
                },
            ],
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi vers Kafka :', error);
    } finally {
        await producer.disconnect();
    }
}

export { kafka }

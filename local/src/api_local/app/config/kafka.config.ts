import { Kafka, Producer, Partitioners } from 'kafkajs'

const kafka = new Kafka({
    clientId: 'airlux-client',
    brokers: ['kafka:9092'],
});

const producer: Producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

export { producer }
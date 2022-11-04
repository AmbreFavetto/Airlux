import redis from 'redis';

const client = redis.createClient({
    url: 'redis://admin:pass@redislocale:6379/'
})

await client.connect()

import redis from 'redis';

const client = redis.createClient({
    url: 'redis://admin:pass@redislocale:6379/'
})

await client.connect();




'redis-cli -h localhost -p 6379 < users.redis '





client.quit();
RANDOM=$$

touch numbers.redis
> numbers.redis

for i in `seq 10`
do
    echo 'HSET number '$RANDOM >> numbers.redis
done
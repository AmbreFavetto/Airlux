RANDOM=$$

touch /var/tmp/numbers.redis
> /var/tmp/numbers.redis

while [ 1 ]
do
    echo 'HSET number '$RANDOM >> /var/tmp/numbers.redis
    sleep 10
done

# faire un script python et l'executer dans le bash
# le script python doit envoyer le fichier vers l'api (url bdd redis the same !!!)
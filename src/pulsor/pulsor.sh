RANDOM=$$

touch /var/tmp/numbers.redis
> /var/tmp/numbers.redis

I=1

while [ 1 ]
do
    echo 'HSET number field'$I '"'$RANDOM'"' | nc db_locale 6379
    I=$((I+1))
    sleep 10
done

# faire un script python et l'executer dans le bash
# le script python doit envoyer le fichier vers l'api (url bdd redis the same !!!)
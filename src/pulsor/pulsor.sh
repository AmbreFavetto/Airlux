#!/bin/bash
RANDOM=$$

I=1

while [ 1 ]
do
    VALUE=$RANDOM
    echo 'HSET number:'$I 'value "'$VALUE'" message "coucou"' | nc db_locale 6379
    echo 'ZADD number_list '$I 'number:'$I | nc db_locale 6379
    echo 'ZADD number_value '$VALUE 'number:'$I | nc db_locale 6379
    I=$((I+1))
    sleep 10
done

# faire un script python et l'executer dans le bash
# le script python doit envoyer le fichier vers l'api (url bdd redis the same !!!)
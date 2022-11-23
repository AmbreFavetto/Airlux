# Airlux
Projet Airlux proposant une solution domotique

4 docker compose : 
- (pulsor) s'occupant uniquement de créer le conteneur permettant de simuler l'envoie de données
- (local) s'occupant de créer la liaison mqtt entre le pulsor et la db redis, de créer et initialiser la db redis ainsi que son api et de créer le conteneur de validation
- (network) s'occupant de simuler la connexion internet entre la db locale et la db distante
- (cloud) s'occupant de créer et initialiser la db mysql et son api

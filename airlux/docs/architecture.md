---
title: Architecture
---

# Architecture du projet

![Shéma de l'architecture du projet Airlux](@site/static/img/architecture.png)
*A mettre à jour*

Nous utilisons Docker Pour la structure et le découpage du projet.  

Dans un premier temps nous avions un premier conteneur docker python "pulsor" qui nous permettait de simuler l'envoie d'informations entre nos différents blocs.
Les informations étaient envoyées en MQTT dans un conteneur mosquito. Les données MQTT étaient ensuite récupérées par notre API locale, un conteneur Nodejs.  

Maintenant les données sont envoyées, toujours via MQTT mais par un ESP32.  

Nous avons 2 conteneurs Nodejs, pour nos 2 API, la locale et la distante. L'API locale permet l'envoie de données à la base de données Redis tandis que l'API distante envoie les données à la base de données Mysql.  

Les données transitent entre les 2 bases de données grâce à des websockets.  

L'application flutter se connecte à l'une ou l'autre des API suivant sa connexion internet.
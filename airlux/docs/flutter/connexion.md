---
title: Connectivité avec la base de données
--- 

Nous récupérons les données depuis l'application mobile grâce aux websockets.  
Ils sont configurés dans le fichier _./shared/socket.dart_. Nous y retrouvons deux méthodes ; _initSocket()_ pour les initialiser et _connectSocket()_ qui teste la connexion et qui renvoie un message si jamais il y a une perte de réseau.

Nous utilisons la librairie _socket-io-client_.  
https://pub.dev/packages/socket_io_client

Ces deux méthodes seront utilisées dans tous les écrans qui récupèrent des données (bâtiments, scénarios...).

Nous pouvons retrouver l'initialisation de ces sockets côté back-end dans ce fichier là : _ AIRLUX/cloud/src/api_cloud/app/index.js _ 
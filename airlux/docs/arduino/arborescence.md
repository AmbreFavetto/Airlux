---

title: Arborescence

---

## Arborescence du projet Arduino

L'application se trouve dans le dossier Arduino/Device.
Le point d'entrée de l'application est le fichier Device.ino.
Pour le reste du projet, chaque grande fonctionnalité est gérée dans un fichier dédié :

- Machine à état : Permet de gérer les états du device en fonction de son mode de fonctionnement (appareillage)
- Bluetooth : Permet d'activer ou de désactiver le bluetooth et de traiter les données reçues
- Wifi : Permet d'activer ou de désactiver le wifi et de se connecter à un réseau donné
- Entrées/Sorties : Permet de gérer l'état de toutes le pins de l'ESP32

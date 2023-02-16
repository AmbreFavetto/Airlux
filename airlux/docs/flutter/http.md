---
title: Requêtes HTTP
---

Dans le dossier _models_, nous pourrons trouver un fichier par modèle de données.  
Chaque modèle de donnée aura autant de fonction qu'il a besoin pour appeler les différentes actions http.
Toutes les requêtes seront envoyées vers la route _http://10.0.2.2:3000_ avec en paramètre le modèle correspondant.  
Exemple : _http://10.0.2.2:3000/building_

### Bâtiments 
| Action | Paramètres | Nom fonction |
|------|:-------:|------|
|  GET    |   NULL    |  getAllBuildings()    |
|  GET    |  Id     |   getBuilding(int id)   |
|  DELETE    |   Building    |  deleteBuilding(Building building)    |

### Étages 
| Action | Paramètres | Nom fonction |
|------|:-------:|------|
|  GET    |   NULL    |  getAllFloors()    |
|  GET    |  Id     |   getFloorsByBuildingId(int id)   |
|  GET    |  Id     |   getFloorById(int id)   |
|  DELETE    |   Floor    |  deleteFloor(Floor floor)    |
  
### Pièces 
| Action | Paramètres | Nom fonction |
|------|:-------:|------|
|  GET    |   NULL    |  getAllRooms()    |
|  GET    |  Id     |   getRoomsByFloorId(int id)   |
|  GET    |  Id     |   getRoomById(int id)   |
|  DELETE    |   Room    |  deleteRoom(Room room)    |

### Devices 
| Action | Paramètres | Nom fonction |
|------|:-------:|------|
|  GET    |   NULL    |  getAllDevices()    |
|  GET    |  Id     |   getDevicesByRoomId(int id)   |
|  DELETE    |   Device    |  deleteDevice(Device device)    |

### Scénarios 
| Action | Paramètres | Nom fonction |
|------|:-------:|------|
|  GET    |   NULL    |  getAllScenarios()    |
|  DELETE    |   Scenario    |  deleteScenario(Scenario scenario)    |
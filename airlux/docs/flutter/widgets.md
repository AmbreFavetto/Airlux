---
title: Les widgets 
---
### Add button
Nom widget : **AddButton**  
Fichier : ./shared/addButton.dart  
Type de return : FloatingActionButton.  
Utilisation : Permet d'afficher un bouton rond en bas d'une page pour ajouter un élément.  

Paramètres : 
- string Title -> tooltip du boutton.
- Function onTap -> action réalisée au clic du bouton.

### Form bottom button
Nom widget : **FormBottomButton**  
Fichier : ./shared/formBottomButton.dart  
Type de return : ElevatedButton.  
Utilisation : Bouton utilisé pour le retour et l'envoi de formulaires.  

Paramètres : 
- string Title -> texte écrit sur boutton.
- Function onTap -> action réalisée au clic du bouton.

### Form input text
Nom widget : **FormInputText**  
Fichier : ./shared/formInputText.dart  
Type de return : Container.  
Utilisation : Bouton utilisé pour le retour et l'envoi de formulaires.  

Paramètres : 
- TextEditingController name -> nom du controller qui permettra l'accès à la donnée de l'input.
- string inputTitle -> place holder de l'input.
- TextInputType textType -> type d'input text (email, mot de passe, texte...).
- IconData? icon -> nullable, icone de l'input, placé tout à gauche.

### Object container
Nom widget : **ObjectContainer**  
Fichier : ./shared/objectContainer.dart  
Type de return : InkWell.  
Utilisation : Container pour l'affichage des données.  

Paramètres : 
- Function onDelete -> action réalisée au clic de l'icone pour supprimer une ligne.
- Function onEdit -> action réalisée au clic de l'icone pour éditer une ligne.
- Function onSelect -> action réalisée au clic du container pour afficher une ligne.
- String title -> titre de la donnée.
- int? id -> nullable, id de la donnée.
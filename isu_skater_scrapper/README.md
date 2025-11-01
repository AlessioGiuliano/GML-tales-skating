# Data scrapping

Étant donné le jeu de données limité fourni par l’ISU, nous avons décidé de collecter nous-mêmes des données supplémentaires, 
notamment les biographies et les historiques de compétition des athlètes pratiquant le patinage de vitesse (speed skating).
Pour ce faire, nous avons mis en place un processus de scraping du site officiel de l’ISU, combinant reverse engineering 
des API utilisées par le site et parsing des documents HTML.

Le processus a commencé par une analyse approfondie du fonctionnement du site : observation des appels réseau effectués par les différentes pages, 
étude de l’évolution de ces appels selon les filtres ou les interactions utilisateur, et identification des clés permettant d’accéder aux pages 
et données de chaque athlète.
Cette analyse a révélé que l’ensemble des données nécessaires était accessible via les API du site, à l’exception des biographies des athlètes, 
directement intégrées dans le code HTML renvoyé par le serveur — sans API dédiée.

La collecte de ces biographies a représenté un certain défi car : 
* les éléments HTML ne disposaient pas d’identifiants uniques
* certains champs étaient optionnels
* leur ordre variait d’une page à l’autre

Pour surmonter ces contraintes, nous avons utilisé des sélecteurs CSS génériques afin d’extraire tous les éléments pertinents, 
puis nous avons post-traité les résultats en Python afin d’obtenir un contenu final structuré.

Une fois cette étape terminée, nous avons assemblé l’ensemble dans un script Python qui traite les athlètes un par un et 
enregistre toutes les données collectées dans un fichier NDJSON. Le choix de ce format permet d’écrire les données au fur et 
à mesure sur le disque (flush) sans attendre la fin du processus complet, ce qui évite les problèmes de mémoire potentiels.

Une attention particulière a également été portée à la limitation de la charge sur le site de l’ISU, en introduisant des temps de pause entre les appels réseau.

Au final, le fichier généré contient les informations de 2971 athlete pour un poid total de 36MB.
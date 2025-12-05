 # Markdown SAE Project

**Contributeurs :**

- Sachiyo SABLE
- Enzo FAUTRAT
- Andrew GARNIER

---

## Contexte

Cette application permet de gérer des fichiers au format Markdown et de les afficher dans un navigateur au format HTML. Elle offre également la possibilité de créer et gérer des blocs HTML/Markdown réutilisables.

Fonctionnalités principales :

- **Gestion d’images** : upload, stockage, renommage et import.
- **Gestion de blocs** : création de blocs HTML ou Markdown, sauvegarde, import/export.
- **Création de fichiers Markdown** : possibilité d’utiliser les images et les blocs stockés dans l’application.

---

## Structure du projet

- `components/` : composants React réutilisables.
- `database/` : fichiers liés à la gestion des données et à l’initialisation de la base de données.
- `store/` : logique Redux pour la gestion globale de l’état de l’application.
- `router/` : logique React router pour la gestion des routes et URL de l'application.

---

## Lancement du projet

pour lancer le projet, il faut lancer à la racine du projet les commandes : 

```bash
npm install
npm run dev
```

puis ouvrir le navigateur
 
```bash
 local http://localhost:5173/
```

---

## Technologies utilisées

- **Frontend** : React, React Router, Bootstrap, Lucid (icones)
- **State management** : Redux

---
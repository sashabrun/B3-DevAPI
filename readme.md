# Dev API

## **Description**

Ce projet est une API construite avec **Node.js**, **Express**, et **Prisma**. Elle permet de gérer les utilisateurs,
les pays, les visites et les couples, tout en offrant des fonctionnalités avancées comme la sélection de pays aléatoires
en fonction des préférences utilisateur.

## **Fonctionnalités principales**

1. **Gestion des utilisateurs :**
    - Inscription, connexion, et déconnexion.
    - Gestion des préférences utilisateur (continent préféré, température favorite).
    - Récupération des informations utilisateur.

2. **Gestion des pays :**
    - Ajouter, consulter, mettre à jour ou supprimer un pays.
    - Récupérer des pays en fonction des préférences ou d'autres critères.

3. **Visites :**
    - Enregistrer, consulter, mettre à jour les visites des utilisateurs dans des pays.
    - Consulter la liste des visites.

4. **Couples :**
    - Associer deux utilisateurs pour créer un "couple".
    - Gérer les relations entre utilisateurs.

5. **Pays aléatoire :**
    - Trouver un pays aléatoirement selon les préférences utilisateur (température, continent, pays déjà visités, etc.).

6. **Récuperation de pays :**
    - Récupération des pays depuis l'API RestCountries.
    - Stockage des pays dans la base de données.
    - Mise à jour des données des pays.

7. **Sécurité :**
    - Authentification des utilisateurs avec JWT.
    - Autorisations basées sur les rôles (utilisateur, admin).
    - Hashage des mots de passe.

8. **Tests :**
    - Documentation des API avec OpenAPI.
    - Collection Postman pour tester toutes les routes de l'API.

## **Technologies utilisées**

- **Backend :**
    - [Node.js](https://nodejs.org/) avec [Express](https://expressjs.com/)
    - [Prisma](https://www.prisma.io/) pour la gestion de la base de données
    - [OpenAPI](https://swagger.io/specification/) pour la documentation des API
- **Base de données :**
    - PostgreSQL (ou autre base supportée par Prisma)
- **Autres dépendances :**
    - `dotenv` : Gestion des variables d'environnement.
    - `axios` : Appels HTTP (notamment pour l'API RestCountries).
    - `jsonwebtoken` : Authentification utilisateur.
    - `bcrypt` : Hashing des mots de passe.

## **Installation**

### Prérequis

- **Node.js** (v16 ou supérieur)
- **NPM** ou **Yarn**
- Une base de données (PostgreSQL recommandé)
- Prisma CLI installé globalement (optionnel) :
  ```bash
  npm install -g prisma
  ```

### Étapes

1. **Clonez le dépôt :**
   ```bash
   git clone https://github.com/sashabrun/B3-DevAPI.git
   cd prisma-api
   ```

2. **Installez les dépendances :**
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement :**
    - Créez un fichier `.env` à la racine du projet.
    - Ajoutez les variables suivantes :
      ```env
      DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
      JWT_SECRET="votre_secret_pour_token"
      ```

4. **Initialisez la base de données :**
    - Générez les migrations Prisma :
      ```bash
      npx prisma migrate dev --name init
      ```
    - Optionnel : Visualisez le modèle Prisma :
      ```bash
      npx prisma studio
      ```

5. **Démarrez le serveur :**
   ```bash
   npm run start
   ```

6. **Importer la collection Postman :**
    - Un fichier **Postman** est inclus dans le projet (`My-api.postman_collection.json`).
    - Importez-le dans Postman pour tester toutes les routes de l'API avec des requêtes prédéfinies.

## **Utilisation**

### **Routes principales**

#### **Utilisateurs**

- `POST /users/register` : Inscription d'un utilisateur.
- `POST /users/login` : Connexion d'un utilisateur.
- `GET /users` : Liste des utilisateurs.
- `GET /users/{id}` : Détails d'un utilisateur par ID.
- `PUT /users` : Mettre à jour un utilisateur.
- `DELETE /users` : Supprimer un utilisateur.
- `DELETE /users/logout` : Déconnexion d'un utilisateur.

#### **Pays**

- `GET /countries` : Liste des pays.
- `POST /countries` : Ajouter un pays.
- `GET /countries/{id}` : Détails d'un pays.
- `PUT /countries/{id}` : Mettre à jour un pays.
- `DELETE /countries/{id}` : Supprimer un pays.

#### **Visites**

- `GET /countries` : Liste des visites.
- `POST /countries` : Ajouter un visite.
- `GET /countries/{id}` : Détails d'une visite.
- `PUT /countries/{id}` : Mettre à jour une visite.
- `DELETE /countries/{id}` : Supprimer une visite.

#### **Couples**

- `POST /couples` : Associer deux utilisateurs.
- `GET /couples` : Liste des couples.
- `GET /countries/{id}` : Détails d'un couple.
- `DELETE /countries/{id}` : Supprimer un couple.

#### **Pays aléatoire**

- `GET /random-country` : Récupérer un pays aléatoire selon les préférences utilisateur.

## **Structure des tables**

### **User**

| Champ                   | Type      | Description                         |
|-------------------------|-----------|-------------------------------------|
| `id`                    | `Int`     | ID unique de l'utilisateur.         |
| `username`              | `String`  | Nom d'utilisateur.                  |
| `password`              | `String`  | Mot de passe hashé.                 |
| `isAdmin`               | `Boolean` | Indique si l'utilisateur est admin. |
| `favorite_continent`    | `String`  | Continent préféré de l'utilisateur. |
| `preferred_temperature` | `String`  | Température préférée.               |

### **Country**

| Champ         | Type      | Description                             |
|---------------|-----------|-----------------------------------------|
| `id`          | `Int`     | ID unique du pays.                      |
| `name`        | `String`  | Nom du pays.                            |
| `continent`   | `String`  | Continent du pays.                      |
| `temperature` | `String`  | Type de température (Hot, Mild, Cold).  |
| `is_open`     | `Boolean` | Indique si le pays est ouvert ou fermé. |

### **Visit**

| Champ        | Type   | Description                          |
|--------------|--------|--------------------------------------|
| `id`         | `Int`  | ID unique de la visite.              |
| `user_id`    | `Int`  | Référence vers l'utilisateur.        |
| `country_id` | `Int`  | Référence vers le pays.              |
| `date`       | `Date` | Date de la visite.                   |
| `rating`     | `Int`  | Note donnée par l'utilisateur (1-5). |

### **Couple**

| Champ      | Type  | Description                            |
|------------|-------|----------------------------------------|
| `id`       | `Int` | ID unique du couple.                   |
| `user1_id` | `Int` | Référence vers le premier utilisateur. |
| `user2_id` | `Int` | Référence vers le second utilisateur.  |

### **Continent**

| ENUM            |
|-----------------|
| `Africa`        | 
| `Antarctica`    |
| `Asia`          |
| `Europe`        |
| `North_America` |
| `Oceania`       |
| `South_America` |

### **Temperature**

| ENUM   |
|--------|
| `Hot`  |
| `Mild` |
| `Cold` |
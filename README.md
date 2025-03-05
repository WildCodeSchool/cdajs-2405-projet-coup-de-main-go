# CoupDeMainGo

**CoupDeMainGo** est une application web développée avec une architecture en couches basée sur Docker pour simplifier le développement et le déploiement. Ce projet utilise un stack composé d'un backend, d'un frontend, et d'une base de données PostgreSQL. L'application est configurée pour être exécutée en mode développement ou en mode déploiement avec Docker Compose.

---

## Table des matières

1. [Prérequis](#prérequis)
2. [Technologies utilisées](#technologies-utilisées)
3. [Structure des dossiers](#structure-des-dossiers)
4. [Installation](#installation)
   - [Mode Développement](#mode-développement)
   - [Mode Déploiement](#mode-déploiement)
5. [Exécution des seeds](#exécution-des-seeds)
6. [Tests](#tests)
   - [Tests unitaires et d'intégration](#tests-unitaires-et-dintégration)
   - [Tests E2E](#tests-e2e)
7. [GitHub Actions](#github-actions)

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 2.0 ou supérieure)
- **Node.js** (pour exécuter les tests E2E localement)
- **Git** (pour cloner le projet)

---

## Technologies utilisées

### Backend
- **Apollo GraphQL** : Pour la gestion des API GraphQL.
- **TypeORM** : Pour l'interaction avec la base de données PostgreSQL.
- **Jest** : Pour les tests unitaires.

### Frontend
- **React** : Framework JavaScript pour l'interface utilisateur.
- **Vite** : Outil de build et de développement pour React.
- **GraphQL Client** : Pour interagir avec l'API GraphQL du backend.
- **Vitest** : Pour les tests unitaires.

### Tests E2E
- **Playwright** : Pour les tests end-to-end.

---

### Structure des dossiers

```plaintext
coupdemaingo/
├── backend/          # Code source du backend (Apollo GraphQL, TypeORM, Jest)
├── frontend/         # Code source du frontend (React, Vite, GraphQL Client, Vitest)
├── e2e/              # Tests end-to-end (Playwright)
├── docker-compose.dev.yml    # Configuration Docker pour le développement
├── docker-compose.deploy.yml # Configuration Docker pour le déploiement
├── .github/          # Configuration GitHub Actions
└── README.md         # Documentation du projet
```

---

## Installation

### Mode Développement

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/WildCodeSchool/cdajs-2405-projet-coup-de-main-go.git
   cd coupdemaingo
   ```

2. Créez un fichier `.env` à la racine du projet en vous basant sur le fichier `.env.sample`. Remplissez les variables d'environnement nécessaires.

3. Lancez les services avec Docker Compose :
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```
Cette commande va :
- Construire les images Docker pour le backend et le frontend.
- Démarrer les services suivants :
    - **Backend** (port `4000`)
    - **Frontend** (port `5173`)
    - **PostgreSQL** (port `5432`)
    - **Adminer** (port `8080` pour la gestion de la base de données).

4. Une fois les services démarrés, vous pouvez accéder à l'application via :
    - **Frontend** : `http://localhost:5173`
    - **Backend** : `http://localhost:4000`
    - **Adminer** : `http://localhost:8080` (pour gérer la base de données).

### Mode Déploiement

1. Créez un fichier .env pour le déploiement en vous basant sur `.env.sample`.

2. Lancez les services avec Docker Compose :
   ```bash
   docker compose up --build
   ```
    Les services sont configurés avec des healthchecks pour s'assurer qu'ils sont prêts avant de démarrer les dépendances.

3. Accédez à l'application via les ports exposés (identique au mode développement).

---

## Exécution des seeds

Pour remplir la base de données avec des données initiales, exécutez la commande suivante depuis le conteneur du backend :
```bash
docker exec $(docker ps -qf "name=backend") npm run seed
```

---

## Tests

### Tests unitaires et d'intégration

#### Backend
Les tests unitaires du backend sont écrits avec **Jest**. Pour les exécuter localement :

1. Assurez-vous que les services sont en cours d'exécution en mode développement.

2. Exécutez les tests depuis le conteneur du backend :
    ```bash
    docker exec $(docker ps -qf "name=backend") npm run test
    ````

#### Frontend
Les tests unitaires du frontend sont écrits avec **Vitest**. Pour les exécuter localement :

1. Assurez-vous que les services sont en cours d'exécution en mode développement.

2. Exécutez les tests depuis le conteneur du frontend :
    ```bash
    docker exec $(docker ps -qf "name=frontend") npm run test
    ```

---

### Tests e2e

Les tests end-to-end (E2E) sont réalisés avec **Playwright**. Pour les exécuter :

1. Arrêtez les services Docker (si ils sont en cours d'exécution).

2. Lancez manuellement les services suivants :
    - **Backend** : depuis le dossier `backend` avec `npm start`.
    - **Frontend** : depuis le dossier `frontend` avec `npm run dev`.
    - **Base de données** : assurez-vous d'avoir une instance PostgreSQL locale en cours d'exécution.

3. Configurez les variables d'environnement dans le dossier `e2e` pour pointer vers les services locaux.

4. Exécutez les tests E2E :
    ```bash
    cd e2e
    npm run test
    ```

---

### GitHub Actions

Le projet est configuré avec GitHub Actions pour exécuter les tests unitaires et intégrations à chaque pull request. Le workflow effectue les étapes suivantes :

1. Démarre les services en mode développement.

2. Vérifie que le frontend et le backend sont opérationnels.

3. Exécute les seeds pour peupler la base de données.

4. Lance les tests unitaires.

5. Affiche les logs Docker en cas d'échec.

---

### Api Documentation

Le projet dispose d'une documentation Api avec `Magidoc`.

Pour cela :

1. Se déplacer dans le dossier backend :
    ```bash
    cd backend
    ```

2. Installer le package globalement avec pnpm et lancer la génération :
    ```bash
    pnpm add --global @magidoc/cli@latest && magidoc generate
    ```

    Si jamais vous n'avez pas pnpm :
    - L'installer sur votre machine (exemple avec Homebrew : `brew install pnpm`)
    - Faire le setup : `pnpm setup`
    - Lancer la commande fournie en retour dans votre terminal

3. Si tout s'est bien passé, lancer la commande de prévisualisation de la documentation Api :
    ```bash
    magidoc preview
    ```






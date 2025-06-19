# ConfigurateurPC API

## Installation

```bash
git clone <repo>
cd configurateurpc-api
npm install
cp .env.example .env
# configurez MONGO_URI et JWT_SECRET dans .env
npm start
```

## Lancer les tests

```bash
npm test
```

## Documentation

La documentation interactive est disponible sur `/api-docs` (Swagger).

## Endpoints principaux

- Authentification : `/api/auth/register`, `/api/auth/login`
- Utilisateurs : `/api/users`, `/api/users/me`
- Composants : `/api/components`, `/api/components/:id`, `/api/components/:id/prices`
- Catégories : `/api/categories`
- Partenaires : `/api/partners`
- Configurations : `/api/configurations`, `/api/configurations/:id`, `/api/configurations/:id/total`

## Gestion des prix des composants

- Ajouter ou mettre à jour un prix pour un partenaire :
  - `POST /api/components/{id}/prices` (admin)
  - Body : `{ "partner": "<partnerId>", "price": 99.99 }`
- Supprimer un prix pour un partenaire :
  - `DELETE /api/components/{id}/prices/{partnerId}` (admin)

## Sécurité

- Authentification JWT requise pour toutes les routes sauf inscription/connexion.
- Les routes d'administration nécessitent un compte admin.

## Technologies

- Node.js, Express.js, MongoDB, JWT, Jest, Supertest, Swagger

## Licence

MIT
# Quick Fruit Web Server
## Serving Fruit Since 2023!

This is the backend/api for the Quick Fruit Lookup System

It uses the following Tech:
- Nest (Express, JWT)
- Prisma,
- Pactum (e2e testing)

## Generate Migration

if you change something in the prisma schema, create a migration with the following command:

```bash
yarn migration:dev:create
```
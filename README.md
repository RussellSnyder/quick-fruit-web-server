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


## TODO / Roadmap

after each of these milestones, the FE will be developed to consume.

### Milestone: MVP
- [ ] Apple Controller: Get Apple by ID
- [ ] Apple Serivce: Test creating many Apples (For seeding)
- [ ] Create Category Controller (Create, Edit with MultiLanguage Support)
- [ ] Category Translations

### Milestone: V1
- [ ] Enable users with role 'TRANSLATOR_DE' to only modify german language (same with EN)
- [ ] Apple Controller - Enable Pagination for Get Apple
- [ ] Apple Controller - Add filters to Get All Apples (category, size, color?)
- [ ] Add Spanish and French language support (4 languages total)

### Milestone: Live Launch
- [ ] Node Mailer for when a user registers to translate (send them a thank you and send me their email)
- [ ] Apple Controller - Sort functionality (By what's recently picked should be default)
- [ ] Add Polish and Ukranian languages (6 languages total)

### Milestone: V2
- [ ] Contact more apple databases to see if direct access is possible (simplify or remove the scraper all together)
- [ ] Apple Controller: Add caching logic for filter/sorts
- [ ] Add 4 more languages (10 languages total)
- [ ] Allow users to save their QR code arrangements on the BE (QRCode Crud)

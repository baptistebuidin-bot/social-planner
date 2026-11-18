# 📅 Planning éditorial réseaux sociaux

Application web de gestion éditoriale pour **Facebook**, **Instagram** et **LinkedIn** :

- **Calendrier** : vue mensuelle des publications planifiées, ajout d'un post sur n'importe quel jour en un clic.
- **État des publications** : tableau Kanban par statut — Idée, À écrire, En rédaction, Prête, Programmée, Publiée — avec compteur des posts restant à écrire.
- **Performance** : indicateurs globaux (impressions, portée, engagement) et tableau détaillé par publication. Saisie manuelle possible dès maintenant ; connexion à l'API Meta prévue pour la synchronisation automatique.

## Stack

- [Next.js 14](https://nextjs.org) (App Router) + React + Tailwind CSS
- [Prisma](https://www.prisma.io) avec base SQLite (fichier `prisma/dev.db`)

## Démarrage

```bash
npm install
npx prisma migrate dev    # crée la base de données
npm run seed              # (optionnel) publications de démonstration
npm run dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Le fichier `.env` contient :

```env
DATABASE_URL="file:./dev.db"

# Connexion Meta (pour la synchronisation des performances)
META_PAGE_ID=
META_ACCESS_TOKEN=
```

## Connexion à Meta (à venir)

L'application est pré-branchée sur l'architecture Meta Graph API :

1. Créez une application sur [developers.facebook.com](https://developers.facebook.com).
2. Obtenez un jeton d'accès de Page avec les permissions `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`.
3. Renseignez `META_PAGE_ID` (l'ID de votre Page Facebook) et `META_ACCESS_TOKEN` dans `.env`.
4. Pour chaque publication publiée, renseignez l'ID du post Meta dans l'éditeur.
5. Cliquez sur « Synchroniser avec Meta » dans l'onglet Performance : impressions, portée, réactions, commentaires, partages et clics sont récupérés automatiquement via `lib/meta.ts`.

## Commandes utiles

| Commande            | Effet                                    |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Serveur de développement                 |
| `npm run build`     | Build de production                      |
| `npm run seed`      | Ajoute des publications de démonstration |
| `npm run db:reset`  | Réinitialise la base de données          |
| `npx prisma studio` | Interface d'administration de la base    |

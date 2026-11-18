import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function dayOfMonth(monthOffset, day) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + monthOffset, day, 12, 0, 0);
}

const samples = [
  {
    title: "Portrait du mois : nouvelle arrivée dans l'équipe",
    content:
      "Découvrez Camille, notre nouvelle responsable communication 🎉\n\n#Équipe #Rencontres",
    platform: "LINKEDIN",
    status: "PUBLISHED",
    plannedDate: dayOfMonth(-1, 12),
    impressions: 4820, reach: 3150, likes: 96, comments: 14, shares: 7, clicks: 41,
  },
  {
    title: "Coulisses de l'atelier (contenu vidéo)",
    content: "Petite visite des coulisses de notre atelier…",
    platform: "INSTAGRAM",
    status: "PUBLISHED",
    plannedDate: dayOfMonth(-1, 25),
    impressions: 2960, reach: 2210, likes: 143, comments: 11, shares: 3, clicks: 0,
  },
  {
    title: "Annonce du nouvel événement printemps",
    content: "📅 Save the date ! Toutes les infos bientôt.",
    platform: "FACEBOOK",
    status: "PUBLISHED",
    plannedDate: dayOfMonth(0, 3),
    impressions: 1540, reach: 1180, likes: 38, comments: 6, shares: 12, clicks: 24,
  },
  {
    title: "Conseils pratiques : 5 astuces pour bien démarrer",
    content: "Carrousel de 5 slides avec nos meilleurs conseils.",
    platform: "INSTAGRAM",
    status: "READY",
    plannedDate: dayOfMonth(0, 14),
    mediaNote: "Carrousel 5 slides, template bleu",
  },
  {
    title: "Article de fond : notre bilan trimestriel",
    content: "Résumé chiffré du trimestre + enseignements clés.",
    platform: "LINKEDIN",
    status: "IN_PROGRESS",
    plannedDate: dayOfMonth(0, 20),
    mediaNote: "Infographie à créer",
  },
  {
    title: "Concours : à gagner ce mois-ci 🎁",
    content: "Règlement à valider avant publication.",
    platform: "FACEBOOK",
    status: "TO_WRITE",
    plannedDate: dayOfMonth(0, 26),
  },
  {
    title: "Série thématique : épisode 2",
    platform: "INSTAGRAM",
    status: "IDEA",
    plannedDate: dayOfMonth(1, 5),
  },
  {
    title: "Interview client : retour d'expérience",
    platform: "LINKEDIN",
    status: "IDEA",
    plannedDate: dayOfMonth(1, 11),
  },
];

async function main() {
  for (const sample of samples) {
    const { impressions, reach, likes, comments, shares, clicks, ...rest } = sample;
    const published = rest.status === "PUBLISHED";
    await prisma.post.create({
      data: {
        ...rest,
        impressions: impressions ?? 0,
        reach: reach ?? 0,
        likes: likes ?? 0,
        comments: comments ?? 0,
        shares: shares ?? 0,
        clicks: clicks ?? 0,
        publishedAt: published ? rest.plannedDate : null,
      },
    });
  }
  console.log(`Seed terminé : ${samples.length} publications de démonstration créées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

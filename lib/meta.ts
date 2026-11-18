import { prisma } from "./prisma";

export type MetaSyncResult = {
  configured: boolean;
  synced: number;
  message: string;
};

export function isMetaConfigured(): boolean {
  return Boolean(
    process.env.META_PAGE_ID &&
      process.env.META_ACCESS_TOKEN
  );
}

type GraphInsights = {
  data?: { name: string; values: { value: number }[] }[];
};

async function fetchInsights(postId: string) {
  const url =
    `https://graph.facebook.com/v21.0/${postId}` +
    `?fields=insights.metric(impressions,post_clicks,post_reactions_like_total,comments,shares)` +
    `&access_token=${encodeURIComponent(process.env.META_ACCESS_TOKEN as string)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Graph API error ${res.status}`);
  }
  return (await res.json()) as GraphInsights;
}

function pickValue(insights: GraphInsights, metric: string): number {
  const entry = insights.data?.find((d) => d.name === metric);
  return entry?.values?.[0]?.value ?? 0;
}

export async function syncPublishedPosts(
  posts: {
    id: string;
    platform: string;
    metaPostId: string | null;
  }[]
): Promise<MetaSyncResult> {
  if (!isMetaConfigured()) {
    return {
      configured: false,
      synced: 0,
      message:
        "La connexion Meta n'est pas configurée. Ajoutez META_PAGE_ID et META_ACCESS_TOKEN dans le fichier .env pour activer la synchronisation.",
    };
  }

  const eligible = posts.filter(
    (p) =>
      (p.platform === "FACEBOOK" || p.platform === "INSTAGRAM") && p.metaPostId
  );
  if (eligible.length === 0) {
    return {
      configured: true,
      synced: 0,
      message:
        "Aucune publication publiée avec un identifiant Meta (metaPostId) à synchroniser.",
    };
  }

  let synced = 0;
  for (const post of eligible) {
    try {
      const insights = await fetchInsights(post.metaPostId as string);
      await prisma.post.update({
        where: { id: post.id },
        data: {
          impressions: pickValue(insights, "impressions"),
          clicks: pickValue(insights, "post_clicks"),
          likes: pickValue(insights, "post_reactions_like_total"),
          comments: pickValue(insights, "comments"),
          shares: pickValue(insights, "shares"),
          metricsSyncedAt: new Date(),
        },
      });
      synced++;
    } catch {
      continue;
    }
  }

  return {
    configured: true,
    synced,
    message: `Synchronisation terminée : ${synced} publication(s) mise(s) à jour depuis l'API Meta.`,
  };
}

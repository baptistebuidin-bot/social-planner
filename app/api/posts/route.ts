import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_PLATFORM_KEYS, ALL_STATUS_KEYS } from "@/lib/constants";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { plannedDate: "asc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title?.trim() || !body.plannedDate || !body.platform) {
    return NextResponse.json(
      { error: "Titre, date planifiée et plateforme sont requis." },
      { status: 400 }
    );
  }
  if (!ALL_PLATFORM_KEYS.includes(body.platform)) {
    return NextResponse.json({ error: "Plateforme inconnue." }, { status: 400 });
  }
  const status = body.status && ALL_STATUS_KEYS.includes(body.status) ? body.status : "IDEA";
  const plannedDate = new Date(body.plannedDate);
  if (Number.isNaN(plannedDate.getTime())) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title: body.title.trim(),
      content: body.content ?? "",
      platform: body.platform,
      status,
      plannedDate,
      mediaNote: body.mediaNote ?? "",
      metaPostId: body.metaPostId || null,
      publishedAt:
        status === "PUBLISHED"
          ? body.publishedAt
            ? new Date(body.publishedAt)
            : plannedDate
          : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_PLATFORM_KEYS, ALL_STATUS_KEYS } from "@/lib/constants";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Publication introuvable." }, { status: 404 });
  }

  const data: Record<string, unknown> = {};

  if (body.title !== undefined) {
    if (!String(body.title).trim()) {
      return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
    }
    data.title = String(body.title).trim();
  }
  if (body.content !== undefined) data.content = body.content;
  if (body.mediaNote !== undefined) data.mediaNote = body.mediaNote;
  if (body.platform !== undefined) {
    if (!ALL_PLATFORM_KEYS.includes(body.platform)) {
      return NextResponse.json({ error: "Plateforme inconnue." }, { status: 400 });
    }
    data.platform = body.platform;
  }
  if (body.status !== undefined) {
    if (!ALL_STATUS_KEYS.includes(body.status)) {
      return NextResponse.json({ error: "Statut inconnu." }, { status: 400 });
    }
    data.status = body.status;
    if (body.status === "PUBLISHED") {
      data.publishedAt =
        body.publishedAt !== undefined
          ? new Date(body.publishedAt)
          : existing.publishedAt ?? new Date();
    } else {
      data.publishedAt = null;
      data.metaPostId = null;
    }
  }
  if (body.plannedDate !== undefined) {
    const plannedDate = new Date(body.plannedDate);
    if (Number.isNaN(plannedDate.getTime())) {
      return NextResponse.json({ error: "Date invalide." }, { status: 400 });
    }
    data.plannedDate = plannedDate;
  }
  if (body.metaPostId !== undefined) data.metaPostId = body.metaPostId || null;
  if (body.publishedAt !== undefined && data.status !== "PUBLISHED")
    data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;

  const metrics = ["impressions", "reach", "likes", "comments", "shares", "clicks"];
  for (const key of metrics) {
    if (body[key] !== undefined) {
      const value = Number(body[key]);
      if (!Number.isInteger(value) || value < 0) {
        return NextResponse.json(
          { error: `Métrique invalide : ${key}.` },
          { status: 400 }
        );
      }
      data[key] = value;
    }
  }
  if (data.status !== "PUBLISHED" && metrics.some((k) => body[k] !== undefined)) {
    data.status = "PUBLISHED";
    data.publishedAt = existing.publishedAt ?? new Date();
  }

  const post = await prisma.post.update({ where: { id: params.id }, data });
  return NextResponse.json(post);
}

export async function DELETE(_request: Request, { params }: Params) {
  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Publication introuvable." }, { status: 404 });
  }
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncPublishedPosts } from "@/lib/meta";

export async function POST() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, platform: true, metaPostId: true },
  });

  const result = await syncPublishedPosts(posts);
  return NextResponse.json(result, { status: 200 });
}

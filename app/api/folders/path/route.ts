import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (!folderId || !userId) {
    return NextResponse.json({ error: "Missing folderId or userId" }, { status: 400 });
  }

  const path: { id: string; name: string }[] = [];

  let currentId: string | null = folderId;

  while (currentId) {
    const [folder] = await db
      .select({
        id: files.id,
        name: files.name,
        parentId: files.parentId,
      })
      .from(files)
      .where(eq(files.id, currentId));

    if (!folder) break;

    path.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }

  return NextResponse.json(path);
}

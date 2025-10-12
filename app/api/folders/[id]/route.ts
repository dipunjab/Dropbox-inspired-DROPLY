import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, params:any ) {
  const folderId = params.id;
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [folder] = await db
    .select()
    .from(files)
    .where(
      and(eq(files.id, folderId), eq(files.userId, userId), eq(files.isFolder, true))
    );

  if (!folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  return NextResponse.json(folder);
}

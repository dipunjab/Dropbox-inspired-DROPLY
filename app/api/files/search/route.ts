import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");
    const query = searchParams.get("q"); 

    if (!queryUserId || queryUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If no search query provided, return empty array
    if (!query || query.trim() === "") {
      return NextResponse.json([]);
    }

    // Search for files/folders where name matches the query
    // Using ILIKE for case-insensitive search (works with PostgreSQL)
    const searchResults = await db
      .select()
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isTrash, false), // Don't include trashed files
          like(files.name, `%${query}%`) // Search for query in name
        )
      )
      .limit(20); // Limit results for performance

    return NextResponse.json(searchResults);
  } catch (error) {
    console.log("Search files error:", error);
    return NextResponse.json(
      { error: "Failed to search files" },
      { status: 500 }
    );
  }
}
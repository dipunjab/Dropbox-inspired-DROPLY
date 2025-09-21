import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server";


export async function GET(requst: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = requst.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId");
        const parentId = searchParams.get("parentId");


        if (!queryUserId || queryUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // fetch files from databse
        let userFiles;
        if (parentId) {
            //fethcing from a specific folder
            userFiles = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.parentId, parentId),
                        eq(files.userId, userId)
                    )
                )
            }else {
                userFiles = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.userId, userId),
                        isNull(files.parentId),
                    )
                )
            }

        return NextResponse.json(userFiles);

    } catch (error) {
        console.log("file Error", error);
        
        return NextResponse.json({error: "failed to fetch files"}, {status: 500})
   
    }
}
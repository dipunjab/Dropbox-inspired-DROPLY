import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
    requst: NextRequest,
    props: { params: Promise<{ fileId: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { fileId } = await props.params;
        if (!fileId) {
            return NextResponse.json({ error: "fileid is required" }, { status: 401 });
        }

        const [file] = await db.select().from(files).where(
            and(
                eq(files.id, fileId),
                eq(files.userId, userId),
            )
        );
        if (!file) {
            return NextResponse.json({ error: "file not found" }, { status: 401 });
        }

        //toggle the start status
        const updateFiles = await db.update(files).set({ isStarred: !file.isStarred }).where(
            and(
                eq(files.id, fileId),
                eq(files.userId, userId),
            )
        ).returning();

        //log
        console.log(updateFiles);
        
        const updateFile = updateFiles[0];

        return NextResponse.json(updateFile);


    } catch (error) {
        return NextResponse.json({ error: "file isStarred Not update" }, { status: 500 });
    }
}
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm"
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";


const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""
});

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Parse form data
        const formdata = await request.formData();
        const file = formdata.get("file") as File
        const formUserId = formdata.get("userId") as string
        const parentId = formdata.get("parentId") as string || null

        if (formUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!file) {
            return NextResponse.json({ error: "No File provided" }, { status: 401 })
        }

        if (parentId) {
            const [parentFolder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),
                        eq(files.userId, userId),
                        eq(files.isFolder, true),
                    )
                )
        }

        if (!parentId) {
            return NextResponse.json({ error: "Parent Folder not found" }, { status: 401 })
        }

        if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
            return NextResponse.json({ error: "Only images and pdf are supported" }, { status: 401 })
        }

        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        const folderPath = parentId ? `/droply/${userId}/folder/${parentId}` : `/droply/${userId}/`;

        const originalFilename = file.name;
        const fileExtension = originalFilename.split(".").pop() || "";
        //checck for empty extension
        //validation for not storing exe, php


        const uniqueFilename = `${uuidv4()}.${fileExtension}`

        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: uniqueFilename,
            folder: folderPath,
            useUniqueFileName: false
        })

        const fileData = {
            name: originalFilename,
            path: uploadResponse.filePath,
            size: file.size,
            type: file.type,

            fileUrl: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl || null,

            userId: userId,
            parentId: parentId,

            isFolder: false,
            isStarred: false,
            isTrash: false,
        }

        const [newFile] = await db.insert(files).values(fileData).returning();

        return NextResponse.json(newFile)

    } catch (error) {
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }
}
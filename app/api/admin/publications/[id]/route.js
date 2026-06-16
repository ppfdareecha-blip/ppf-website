import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Publication from "@/lib/models/Publication";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const deletedPublication = await Publication.findByIdAndDelete(id);
    if (!deletedPublication) {
      return NextResponse.json({ success: false, message: "Publication not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const existingPub = await Publication.findById(id);
    if (!existingPub) {
      return NextResponse.json({ success: false, message: "Publication not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      publicationType,
      author,
      date,
      tags,
      description,
      source,
      status,
      version,
      year,
      type,
      category,
      link,
      imgUrl,   // new Cloudinary URL if image was replaced in browser
      fileUrl,  // new Cloudinary URL if PDF was replaced in browser
    } = body;

    let tagsArray = existingPub.tags || [];
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        tagsArray = tags;
      } else if (typeof tags === "string") {
        tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      {
        title: title !== undefined ? title : existingPub.title,
        publicationType: publicationType !== undefined ? publicationType : existingPub.publicationType,
        author: author !== undefined ? author : existingPub.author,
        date: date !== undefined ? date : existingPub.date,
        tags: tagsArray,
        // Only replace img/file if a new URL was provided from browser upload
        img: imgUrl ? imgUrl : existingPub.img,
        file: fileUrl ? fileUrl : existingPub.file,
        description: description !== undefined ? description : existingPub.description,
        source: source !== undefined ? source : existingPub.source,
        status: status !== undefined ? status : existingPub.status,
        version: version !== undefined ? version : existingPub.version,
        year: year !== undefined ? year : existingPub.year,
        type: type !== undefined ? type : existingPub.type,
        category: category !== undefined ? category : existingPub.category,
        link: link !== undefined ? link : existingPub.link,
      },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, data: updatedPublication });
  } catch (error) {
    console.error("[PUT Publication] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

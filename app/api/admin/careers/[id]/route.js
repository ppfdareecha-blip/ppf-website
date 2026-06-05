import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Career from "@/lib/models/Career";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const deletedCareer = await Career.findByIdAndDelete(id);
    if (!deletedCareer) {
      return NextResponse.json({ success: false, message: "Career entry not found" }, { status: 404 });
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
    const body = await req.json();
    const {
      type,
      title,
      category,
      description,
      location,
      duration,
      stipend,
      price,
      startDate,
      requirements,
      responsibilities,
      applyLink,
      imageBase64,
      status,
    } = body;

    const existingCareer = await Career.findById(id);
    if (!existingCareer) {
      return NextResponse.json({ success: false, message: "Career entry not found" }, { status: 404 });
    }

    let imageUrl = existingCareer.image;
    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-careers",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const updatedCareer = await Career.findByIdAndUpdate(
      id,
      {
        type: type !== undefined ? type : existingCareer.type,
        title: title !== undefined ? title : existingCareer.title,
        category: category !== undefined ? category : existingCareer.category,
        description: description !== undefined ? description : existingCareer.description,
        location: location !== undefined ? location : existingCareer.location,
        duration: duration !== undefined ? duration : existingCareer.duration,
        stipend: stipend !== undefined ? stipend : existingCareer.stipend,
        price: price !== undefined ? price : existingCareer.price,
        startDate: startDate !== undefined ? startDate : existingCareer.startDate,
        requirements: requirements !== undefined ? requirements : existingCareer.requirements,
        responsibilities: responsibilities !== undefined ? responsibilities : existingCareer.responsibilities,
        applyLink: applyLink !== undefined ? applyLink : existingCareer.applyLink,
        image: imageUrl,
        status: status !== undefined ? status : existingCareer.status,
      },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, data: updatedCareer });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Dialogue from "@/lib/models/Dialogue";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/adminAuth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, { params }) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  try {
    await dbConnect();
    const { id } = params;
    const {
      title,
      description,
      date,
      sortDate,
      imageBase64,
      pdfLink,
      reportPdfBase64,
      clearReportPdf,
      clearImage,
    } = await req.json();

    const existingDialogue = await Dialogue.findById(id);
    if (!existingDialogue) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    let imageUrl = existingDialogue.image;
    if (clearImage) {
        imageUrl = "";
    } else if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-dialogues",
      });
      imageUrl = uploadResponse.secure_url;
    }

    let reportPdfUrl = existingDialogue.reportPdf;
    if (clearReportPdf) {
      reportPdfUrl = "";
      if (existingDialogue.reportPdf) {
        try {
          const urlParts = existingDialogue.reportPdf.split('/');
          const versionIndex = urlParts.findIndex(p => p.startsWith('v') && !isNaN(p.substring(1)));
          if (versionIndex !== -1) {
            const publicIdWithExt = urlParts.slice(versionIndex + 1).join('/');
            const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error("Failed to delete old PDF:", err);
        }
      }
    } else if (reportPdfBase64) {
      const uploadResponse = await cloudinary.uploader.upload(reportPdfBase64, {
        folder: "ppf-dialogue-reports",
        resource_type: "auto",
      });
      reportPdfUrl = uploadResponse.secure_url;

      if (existingDialogue.reportPdf) {
        try {
          const urlParts = existingDialogue.reportPdf.split('/');
          const versionIndex = urlParts.findIndex(p => p.startsWith('v') && !isNaN(p.substring(1)));
          if (versionIndex !== -1) {
            const publicIdWithExt = urlParts.slice(versionIndex + 1).join('/');
            const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error("Failed to delete old PDF:", err);
        }
      }
    }

    const updateData = {
      title: title !== undefined ? title : existingDialogue.title,
      description: description !== undefined ? description : existingDialogue.description,
      date: date !== undefined ? date : existingDialogue.date,
      sortDate: sortDate !== undefined ? (sortDate ? new Date(sortDate) : null) : existingDialogue.sortDate,
      image: imageUrl,
      pdfLink: pdfLink !== undefined ? pdfLink : existingDialogue.pdfLink,
      reportPdf: reportPdfUrl,
      updatedAt: new Date(),
    };

    const updatedDialogue = await Dialogue.collection.findOneAndUpdate(
      { _id: existingDialogue._id },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, data: updatedDialogue.value || updatedDialogue });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const authError = requireAdmin(req);
  if (authError) return authError;
  try {
    await dbConnect();
    const { id } = params;
    const existingDialogue = await Dialogue.findById(id);
    if (!existingDialogue) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    
    if (existingDialogue.reportPdf) {
        try {
            const urlParts = existingDialogue.reportPdf.split('/');
            const versionIndex = urlParts.findIndex(p => p.startsWith('v') && !isNaN(p.substring(1)));
            if (versionIndex !== -1) {
              const publicIdWithExt = urlParts.slice(versionIndex + 1).join('/');
              const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
              await cloudinary.uploader.destroy(publicId);
            }
          } catch (err) {
            console.error("Failed to delete old PDF:", err);
          }
    }

    await Dialogue.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

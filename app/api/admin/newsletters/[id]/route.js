import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/lib/models/Newsletter";
import { ObjectId } from "mongodb";

const validateId = (id) => {
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid newsletter ID" },
      { status: 400 }
    );
  }

  return null;
};

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const invalidIdResponse = validateId(params.id);
    if (invalidIdResponse) return invalidIdResponse;

    const { title, description, pdfLink, date } = await req.json();
    const updatedNewsletter = await Newsletter.findByIdAndUpdate(
      params.id,
      {
        title,
        description: description || "",
        pdfLink,
        date: date || "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedNewsletter) {
      return NextResponse.json(
        { success: false, error: "Newsletter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedNewsletter });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const invalidIdResponse = validateId(params.id);
    if (invalidIdResponse) return invalidIdResponse;

    const deletedNewsletter = await Newsletter.findByIdAndDelete(params.id);

    if (!deletedNewsletter) {
      return NextResponse.json(
        { success: false, error: "Newsletter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedNewsletter });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

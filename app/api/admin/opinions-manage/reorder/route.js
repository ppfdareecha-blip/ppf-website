import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Opinion from "@/lib/models/Opinion";

/**
 * PUT /api/admin/opinions-manage/reorder
 *
 * Body: { orderedIds: ["id1", "id2", "id3", ...] }
 *
 * Sets the `order` field of each opinion to its index in the array,
 * so index 0 = shown first, index 1 = shown second, etc.
 */
export async function PUT(req) {
  try {
    await dbConnect();
    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "orderedIds must be a non-empty array" },
        { status: 400 }
      );
    }

    // Bulk-write: update each document's order field to its array index
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    await Opinion.bulkWrite(bulkOps);

    return NextResponse.json({ success: true, message: `Updated order for ${orderedIds.length} opinions.` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

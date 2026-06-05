import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Opinion from "@/lib/models/Opinion";
import Author from "@/lib/models/Author";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await dbConnect();
    const opinions = await Opinion.find({}).populate("authors").sort({ order: 1, createdAt: -1 });
    
    // Format response to match nested author structure expected by the admin dashboard
    const formatted = opinions.map((op) => {
      const dateStr = op.createdAt
        ? new Date(op.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Recent";

      // Resolve multiple authors
      const resolvedAuthors = op.authors || [];

      const authorList = resolvedAuthors.map(a => ({
        id: a._id?.toString() || "",
        name: a.authorName || "PPF Expert",
        position: a.authorPosition || "Expert Analyst",
        profilePictureUrl: a.authorImage || a.authorPictureLink || a.authorImageLink || "",
        authorPictureLink: a.authorImage || a.authorPictureLink || a.authorImageLink || "",
        authorImage: a.authorImage || a.authorPictureLink || a.authorImageLink || "",
        bio: a.about || a.bio || "",
        about: a.about || a.bio || "",
        description: a.about || a.bio || "",
        socialLinks: a.socialLinks || [],
      }));

      const primaryAuthor = authorList[0] || {
        name: "PPF Expert",
        position: "Expert Analyst",
        profilePictureUrl: "",
        authorPictureLink: "",
        authorImage: "",
        bio: "",
        about: "",
        description: "",
        socialLinks: [],
      };

      return {
        _id: op._id.toString(),
        title: op.title,
        description: op.description,
        tag: op.tag,
        centerTag: op.center,
        imageUrl: op.attachedPoster,
        slug: op.opinionId,
        dateAndTime: dateStr,
        downloadableLink: op.downloadableLink || "",
        author: primaryAuthor,
        authors: authorList,
        createdAt: op.createdAt,
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const {
      title,
      description,
      dateAndTime,
      tag,
      centerTag,
      author: authorInput,
      imageBase64,
      imageUrl: existingImageUrl,
      authorProfileBase64,
      authors: reqAuthors,
    } = await req.json();

    // 1. Cover Image Upload
    let imageUrl = "";
    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-opinions-admin",
      });
      imageUrl = uploadResponse.secure_url;
    } else if (existingImageUrl) {
      imageUrl = existingImageUrl;
    }

    // 2. Resolve Author
    let authorDoc = null;

    // Check if a specific author ID is passed directly
    if (authorInput && authorInput.id) {
      authorDoc = await Author.findById(authorInput.id);
    } else if (typeof authorInput === "string" && authorInput.match(/^[0-9a-fA-F]{24}$/)) {
      authorDoc = await Author.findById(authorInput);
    }

    // Fallback: If no author is found by ID, look up by name or create a new one
    if (!authorDoc) {
      let authorName = authorInput?.name || "PPF Expert";
      let authorPosition = authorInput?.position || "Expert Analyst";
      let authorBio = authorInput?.description || "";
      let socialLinks = authorInput?.socialLinks || [];
      let authorProfileUrl = authorInput?.authorPictureLink || authorInput?.profilePictureUrl || "";

      if (authorProfileBase64) {
        const authorPublicId = `author_${authorName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        const profileUpload = await cloudinary.uploader.upload(authorProfileBase64, {
          folder: "ppf-opinions-admin/authors",
          public_id: authorPublicId,
          overwrite: true,
        });
        authorProfileUrl = profileUpload.secure_url;
      }

      authorDoc = await Author.findOne({ authorName });
      if (!authorDoc) {
        const generateShortId = () => Math.random().toString(36).substring(2, 6);
        const slugify = (text) =>
          text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const authorId = `author-${slugify(authorName)}-${generateShortId()}`;

        authorDoc = await Author.create({
          authorId,
          authorName,
          authorPosition,
          authorPictureLink: authorProfileUrl,
          authorImageLink: authorProfileUrl,
          authorImage: authorProfileUrl,
          authorIdLink: `/pages/authors/${authorId}`,
          bio: authorBio,
          about: authorBio,
          socialLinks,
        });
      } else {
        // Update existing author profile picture if a new one was uploaded
        let updated = false;
        if (authorProfileUrl && authorProfileUrl !== authorDoc.authorPictureLink) {
          authorDoc.authorPictureLink = authorProfileUrl;
          authorDoc.authorImageLink = authorProfileUrl;
          authorDoc.authorImage = authorProfileUrl;
          updated = true;
        }
        if (updated) {
          await authorDoc.save();
        }
      }
    }

    // 3. Create the Opinion linked to the Author
    let slug = title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/(^-|-$)+/g, "");

    if (!slug) {
      slug = `opinion-${Math.random().toString(36).substring(2, 8)}`;
    }

    // Resolve authors list
    let authorIds = [];
    if (reqAuthors && Array.isArray(reqAuthors)) {
      authorIds = reqAuthors;
    } else if (authorDoc) {
      authorIds = [authorDoc._id];
    }

    const newOpinion = await Opinion.create({
      opinionId: slug,
      title,
      description,
      authors: authorIds,
      tag,
      center: centerTag || "",
      attachedPoster: imageUrl,
      downloadableLink: "",
    });

    // 4. Update the Authors' opinions list
    for (const authId of authorIds) {
      await Author.findByIdAndUpdate(authId, {
        $addToSet: { opinionsWritten: newOpinion._id },
      });
    }

    // Fetch newly created opinion populated
    const populatedNewOp = await Opinion.findById(newOpinion._id).populate("authors");
    const resolvedAuthors = populatedNewOp.authors || [];

    const authorList = resolvedAuthors.map(a => ({
      id: a._id?.toString() || "",
      name: a.authorName || "PPF Expert",
      position: a.authorPosition || "Expert Analyst",
      profilePictureUrl: a.authorImage || a.authorPictureLink || a.authorImageLink || "",
      authorPictureLink: a.authorImage || a.authorPictureLink || a.authorImageLink || "",
      authorImage: a.authorImage || a.authorPictureLink || a.authorImageLink || "",
      bio: a.about || a.bio || "",
      about: a.about || a.bio || "",
      description: a.about || a.bio || "",
      socialLinks: a.socialLinks || [],
    }));

    const primaryAuthor = authorList[0] || {
      name: "PPF Expert",
      position: "Expert Analyst",
      profilePictureUrl: "",
      authorPictureLink: "",
      authorImage: "",
      bio: "",
      about: "",
      description: "",
      socialLinks: [],
    };

    // Format output matching dashboard expectation
    const resultData = {
      _id: newOpinion._id.toString(),
      title: newOpinion.title,
      description: newOpinion.description,
      tag: newOpinion.tag,
      centerTag: newOpinion.center,
      imageUrl: newOpinion.attachedPoster,
      slug: newOpinion.opinionId,
      author: primaryAuthor,
      authors: authorList,
      createdAt: newOpinion.createdAt,
    };

    return NextResponse.json({ success: true, data: resultData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

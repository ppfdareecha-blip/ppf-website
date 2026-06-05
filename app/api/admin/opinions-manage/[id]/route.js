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

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const existingOpinion = await Opinion.findById(id);
    if (!existingOpinion) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    // 1. Pull the opinion reference from all Author documents in the authors array
    if (existingOpinion.authors && existingOpinion.authors.length > 0) {
      for (const authId of existingOpinion.authors) {
        await Author.findByIdAndUpdate(authId, {
          $pull: { opinionsWritten: existingOpinion._id },
        });
      }
    }

    // 2. Delete the opinion
    await Opinion.findByIdAndDelete(id);

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const {
      title,
      description,
      dateAndTime,
      tag,
      centerTag,
      author: authorInput,
      imageBase64,
      imageUrl: incomingImageUrl,
      authorProfileBase64,
      downloadableLink,
      authors: reqAuthors,
    } = await req.json();

    const existing = await Opinion.findById(id).populate("authors");
    if (!existing) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    // 1. Update Cover Image
    let imageUrl = existing.attachedPoster;
    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "ppf-opinions-admin",
      });
      imageUrl = uploadResponse.secure_url;
    } else if (incomingImageUrl) {
      imageUrl = incomingImageUrl;
    }

    // 2. Update Author details if provided
    let authorDoc = existing.authors && existing.authors.length > 0 ? existing.authors[0] : null;
    if (reqAuthors && Array.isArray(reqAuthors)) {
      // Pull reference from old authors
      const oldAuthorIds = existing.authors || [];

      for (const oldId of oldAuthorIds) {
        await Author.findByIdAndUpdate(oldId, {
          $pull: { opinionsWritten: existing._id },
        });
      }

      // Update to new author IDs
      existing.authors = reqAuthors;

      // Push reference to new authors
      for (const newId of reqAuthors) {
        await Author.findByIdAndUpdate(newId, {
          $addToSet: { opinionsWritten: existing._id },
        });
      }
    } else if (authorInput?.name) {
      let authorProfileUrl = authorDoc?.authorPictureLink || "";

      if (authorProfileBase64) {
        const authorPublicId = `author_${authorInput.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        const profileUpload = await cloudinary.uploader.upload(authorProfileBase64, {
          folder: "ppf-opinions-admin/authors",
          public_id: authorPublicId,
          overwrite: true,
        });
        authorProfileUrl = profileUpload.secure_url;
      }

      // Check if we need to switch authors or update existing
      if (authorDoc && authorDoc.authorName === authorInput.name) {
        // Same author, just update profile properties
        let updated = false;
        if (authorInput.position && authorDoc.authorPosition !== authorInput.position) {
          authorDoc.authorPosition = authorInput.position;
          updated = true;
        }
        if (authorProfileUrl && authorDoc.authorPictureLink !== authorProfileUrl) {
          authorDoc.authorPictureLink = authorProfileUrl;
          authorDoc.authorImageLink = authorProfileUrl;
          authorDoc.authorImage = authorProfileUrl;
          updated = true;
        }
        if (authorInput.description && authorDoc.bio !== authorInput.description) {
          authorDoc.bio = authorInput.description;
          authorDoc.about = authorInput.description;
          updated = true;
        }
        if (updated) {
          await authorDoc.save();
        }
      } else {
        // Different author name! Find or create new author doc
        let newAuthor = await Author.findOne({ authorName: authorInput.name });
        if (!newAuthor) {
          const generateShortId = () => Math.random().toString(36).substring(2, 6);
          const slugify = (text) =>
            text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "");

          const authorId = `author-${slugify(authorInput.name)}-${generateShortId()}`;

          newAuthor = await Author.create({
            authorId,
            authorName: authorInput.name,
            authorPosition: authorInput.position || "Expert Analyst",
            authorPictureLink: authorProfileUrl,
            authorImageLink: authorProfileUrl,
            authorImage: authorProfileUrl,
            authorIdLink: `/pages/authors/${authorId}`,
            bio: authorInput.description || "",
            about: authorInput.description || "",
            socialLinks: authorInput.socialLinks || [],
          });
        }

        // Pull reference from old author
        if (authorDoc) {
          await Author.findByIdAndUpdate(authorDoc._id, {
            $pull: { opinionsWritten: existing._id },
          });
        }

        // Connect new author
        existing.authors = [newAuthor._id];
        authorDoc = newAuthor;

        // Push reference to new author
        await Author.findByIdAndUpdate(newAuthor._id, {
          $push: { opinionsWritten: existing._id },
        });
      }
    }

    // 3. Update Opinion fields
    if (title) existing.title = title;
    if (description !== undefined) existing.description = description;
    if (tag !== undefined) existing.tag = tag;
    if (centerTag !== undefined) existing.center = centerTag;
    if (downloadableLink !== undefined) existing.downloadableLink = downloadableLink;
    existing.attachedPoster = imageUrl;

    if (title) {
      let slug = title
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/(^-|-$)+/g, "");

      if (!slug) {
        slug = `opinion-${Math.random().toString(36).substring(2, 8)}`;
      }
      existing.opinionId = slug;
    }

    await existing.save();

    // Fetch the updated opinion populated
    const populated = await Opinion.findById(existing._id).populate("authors");

    // Map response format to match frontend expectation
    const dateStr = populated.createdAt
      ? new Date(populated.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Recent";

    // Resolve multiple authors
    const resolvedAuthors = populated.authors || [];

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

    const responseData = {
      _id: populated._id.toString(),
      title: populated.title,
      description: populated.description,
      tag: populated.tag,
      centerTag: populated.center,
      imageUrl: populated.attachedPoster,
      slug: populated.opinionId,
      dateAndTime: dateStr,
      downloadableLink: populated.downloadableLink || "",
      author: primaryAuthor,
      authors: authorList,
      createdAt: populated.createdAt,
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

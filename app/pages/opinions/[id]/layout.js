import opinionsData from "@/data/Opinions.json";
import dbConnect from "@/lib/mongodb";
import Opinion from "@/lib/models/Opinion";

export async function generateMetadata({ params }) {
  const { id } = params;

  // 1. Check local JSON first
  const localOpinion = opinionsData.find((o) => o.id === id);
  if (localOpinion) {
    const cleanDescription = localOpinion.excerpt || (localOpinion.content ? localOpinion.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : "Read this opinion piece by Public Policy Forum.");
    return {
      title: `${localOpinion.title} | PPF`,
      description: cleanDescription,
      openGraph: {
        title: localOpinion.title,
        description: cleanDescription,
        images: [localOpinion.image || '/pictures/opinionMockup.jpg'],
      },
      twitter: {
        card: "summary_large_image",
        title: localOpinion.title,
        description: cleanDescription,
        images: [localOpinion.image || '/pictures/opinionMockup.jpg'],
      }
    };
  }

  // 2. Check Database
  try {
    await dbConnect();
    // In MongoDB, the ID could be the Mongo _id or a custom opinionId
    const query = id.length === 24 ? { _id: id } : { opinionId: id };
    const dbOpinion = await Opinion.findOne(query).lean();
    
    if (dbOpinion) {
      const cleanDescription = dbOpinion.description ? dbOpinion.description.replace(/<[^>]*>?/gm, '').substring(0, 160) : "Read this opinion piece by Public Policy Forum.";
      return {
        title: `${dbOpinion.title} | PPF`,
        description: cleanDescription,
        openGraph: {
          title: dbOpinion.title,
          description: cleanDescription,
          images: [dbOpinion.attachedPoster || '/pictures/opinionMockup.jpg'],
        },
        twitter: {
          card: "summary_large_image",
          title: dbOpinion.title,
          description: cleanDescription,
          images: [dbOpinion.attachedPoster || '/pictures/opinionMockup.jpg'],
        }
      };
    }
  } catch (error) {
    console.error("Error fetching opinion metadata:", error);
  }

  // 3. Fallback
  return {
    title: "PPF Opinion",
    description: "Read the latest opinion pieces and insights from the Public Policy Forum.",
  };
}

export default function OpinionLayout({ children }) {
  return <>{children}</>;
}

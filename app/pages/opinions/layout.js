export const metadata = {
    title: "Opinions & Insights",
    description:
        "Read the latest opinion pieces, expert commentary, and policy insights from PPF researchers and fellows on governance, security, economy, and more.",
    openGraph: {
        title: "Opinions & Insights | PPF",
        description:
            "Expert commentary and policy insights from PPF researchers and fellows.",
        url: "https://www.ppf.org.in/pages/opinions",
        images: [{ url: "/image.png", width: 512, height: 512 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Opinions & Insights | PPF",
        description: "Expert commentary and policy insights from PPF researchers.",
    },
    alternates: { canonical: "https://www.ppf.org.in/pages/opinions" },
};

export default function OpinionsLayout({ children }) {
    return <>{children}</>;
}

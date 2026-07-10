export const metadata = {
    title: "About Us",
    description:
        "Learn about Policy Perspectives Foundation (PPF) — our mission, vision, centers of excellence, and the team driving evidence-based policy research across India.",
    openGraph: {
        title: "About Us | PPF",
        description:
            "Our mission, vision, and team at Policy Perspectives Foundation.",
        url: "https://www.ppf.org.in/pages/about",
        images: [{ url: "/image.png", width: 512, height: 512 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | PPF",
        description: "Mission, vision, and team of Policy Perspectives Foundation.",
    },
    alternates: { canonical: "https://www.ppf.org.in/pages/about" },
};

export default function AboutLayout({ children }) {
    return <>{children}</>;
}

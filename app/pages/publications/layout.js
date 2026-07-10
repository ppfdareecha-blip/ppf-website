export const metadata = {
    title: "Publications",
    description:
        "Explore PPF's research reports, annual reports, and project publications covering public policy, governance, security, and socio-economic development in India.",
    openGraph: {
        title: "Publications | PPF",
        description:
            "Research reports, annual audits, and project publications from Policy Perspectives Foundation.",
        url: "https://www.ppf.org.in/pages/publications",
        images: [{ url: "/image.png", width: 512, height: 512 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Publications | PPF",
        description: "Research reports and publications from PPF.",
    },
    alternates: { canonical: "https://www.ppf.org.in/pages/publications" },
};

export default function PublicationsLayout({ children }) {
    return <>{children}</>;
}

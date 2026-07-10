export const metadata = {
    title: "Activities & Events",
    description:
        "Discover PPF's events, seminars, conferences, and outreach activities focused on public policy, governance reform, and community engagement across India.",
    openGraph: {
        title: "Activities & Events | PPF",
        description:
            "Events, seminars, and outreach activities by Policy Perspectives Foundation.",
        url: "https://www.ppf.org.in/pages/activities",
        images: [{ url: "/image.png", width: 512, height: 512 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Activities & Events | PPF",
        description: "Events and activities by PPF.",
    },
    alternates: { canonical: "https://www.ppf.org.in/pages/activities" },
};

export default function ActivitiesLayout({ children }) {
    return <>{children}</>;
}

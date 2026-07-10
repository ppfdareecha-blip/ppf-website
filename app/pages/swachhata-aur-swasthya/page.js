import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditorialProjectLayout from "@/components/EditorialProjectLayout";

export default function SwachhataAurSwasthya() {
    const highlights = [
        "2 years of sustained community health and hygiene interventions.",
        "4 successful campaign cycles, each comprising 15-20 community initiatives.",
        "3,000+ beneficiaries reached across schools and local communities.",
        "Health, hygiene and sanitation awareness workshops and campaigns.",
        "Capacity building for Anganwadi Workers, ASHA Workers, Safai Mitras and Self-Help Groups.",
        "Community cleanliness drives and distribution of hygiene kits & IEC materials.",
        "Implemented with support of OIL India Limited and in collaboration with local authorities and community institutions."
    ];

    const paragraphs = [
        "Swachhata aur Swasthya Sankalp is a community health and sanitation initiative of Policy Perspectives Foundation (PPF) aimed at promoting cleanliness, hygiene and preventive healthcare through sustained community engagement.",
        "Over the past two years, PPF has successfully implemented four intensive campaign cycles, each comprising 15-20 targeted interventions, including health and hygiene workshops, cleanliness drives, awareness campaigns, training sessions and the distribution of hygiene kits.",
        "Reaching over 3,000 beneficiaries, the initiative has been implemented in collaboration with Anganwadi Centres, Primary Health Centres (PHCs), Municipal Corporation workers, schools and Self-Help Groups, fostering behavioural change and strengthening community-led action towards healthier and cleaner neighbourhoods."
    ];

    const galleryImages = [
        "1.jpg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg", "7.jpeg", "8.jpeg", "9.jpeg",
        "10.jpeg", "11.jpeg", "12.jpeg", "13.jpeg", "14.jpeg", "15.jpeg", "16.jpeg", "17.jpeg",
        "18.jpeg", "19.jpeg"
    ];

    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
            <Navbar />
            <EditorialProjectLayout
                title="Swachhata aur Swasthya Sankalp"
                subtitle="Promoting Cleanliness. Strengthening Public Health. Inspiring Community Action."
                paragraphs={paragraphs}
                highlights={highlights}
                images={galleryImages}
                folder="swachatta"
            />
            <Footer />
        </div>
    );
}

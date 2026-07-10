import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditorialProjectLayout from "@/components/EditorialProjectLayout";

export default function ProjectProtsahan() {
    const highlights = [
        "4+ years of advancing women’s empowerment and sustainable livelihoods.",
        "600+ women trained through vocational and employability programmes.",
        "Training in tailoring, office management and workplace readiness.",
        "Capacity building on financial literacy, digital literacy, health and entrepreneurship.",
        "Community-led interventions across underserved urban settlements.",
        "Promoting economic independence, self-reliance and social inclusion.",
        "Successfully implemented in partnership with leading CSR and development organisations."
    ];

    const paragraphs = [
        "Project Protsahan is a flagship initiative of Policy Perspectives Foundation (PPF) that advances women’s socio-economic empowerment through skill development, capacity building and sustainable livelihood opportunities.",
        "By equipping women from underserved communities with vocational, employability and life skills, the programme seeks to enhance financial independence, confidence and long-term resilience. Beyond technical training, Project Protsahan integrates mentorship, financial literacy, digital awareness and community engagement, creating an enabling ecosystem for women to participate more actively in the economy and society.",
        "Through this initiative, PPF continues its commitment to fostering inclusive development, strengthening communities and creating pathways for dignified and sustainable livelihood."
    ];

    const galleryImages = [
        "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg",
        "12.jpeg", "13.jpeg", "14.jpeg", "15.jpeg", "16.jpeg", "17.jpeg", "18.jpeg", "19.jpeg", "20.jpeg",
        "21.jpeg", "22.jpeg", "23.jpeg", "24.jpeg", "25.jpeg"
    ];

    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
            <Navbar />
            <EditorialProjectLayout
                title="Project Protsahan"
                subtitle="Women’s Economic Empowerment & Sustainable Livelihood Initiative"
                paragraphs={paragraphs}
                highlights={highlights}
                images={galleryImages}
                folder="protsahan"
                reportLink="https://res.cloudinary.com/diqvmxpc8/raw/upload/v1781861443/ppf-publications/cisqicv5nhr08q1msbo3.pdf"
            />
            <Footer />
        </div>
    );
}

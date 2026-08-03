import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const CommunityOutreach = ({ sectionWidth }) => {
    const projects = [
        {
            title: "Project Protsahan",
            subtitle: "Women’s Economic Empowerment & Sustainable Livelihood Initiative",
            stats: [
                { label: "Duration", value: "4+ Years" },
                { label: "Focus", value: "Driving women’s empowerment" },
                { label: "Impact", value: "600+ Women" },
                { label: "Outcome", value: "Trained through livelihood programmes" },
            ],
            image: "/Project/protsahan.jpeg",
            link: "/pages/project-protsahan",
            color: "bg-ppf-lilac border-ppf-purple text-ppf-purple",
            buttonColor: "bg-ppf-purple hover:opacity-90 text-white",
        },
        {
            title: "Swachhata aur Swasthya Sankalp",
            subtitle: "Promoting Cleanliness. Strengthening Public Health. Inspiring Community Action.",
            stats: [
                { label: "Duration", value: "4 Campaign Cycles" },
                { label: "Scale", value: "15-20 Activities Each" },
                { label: "Impact", value: "3,000+ Beneficiaries" },
                { label: "Reach", value: "Across Schools & Communities" },
            ],
            image: "/Project/swachatta_and_sankalp.jpeg",
            link: "/pages/swachhata-aur-swasthya",
            color: "bg-ppf-lilac border-ppf-purple text-ppf-purple",
            buttonColor: "bg-ppf-purple hover:opacity-90 text-white",
        }
    ];

    return (
        <section id="community-outreach" className={`py-10 ${sectionWidth}`}>
            <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-ppf-purple mb-3">Community Outreach</h2>
                <div className="w-24 h-1 bg-ppf-orange mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`rounded-2xl border p-5 md:p-6 flex flex-col h-full bg-opacity-30 ${project.color}`}
                    >
                        <div className="w-full h-40 relative mb-4 rounded-xl overflow-hidden shadow-sm">
                            <Image src={project.image} alt={project.title} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                        <p className="text-sm font-medium opacity-90 mb-4 h-[40px] line-clamp-2 leading-tight">{project.subtitle}</p>

                        <div className="grid grid-cols-2 gap-3 mb-5 flex-grow">
                            {project.stats.map((stat, i) => (
                                <div key={i} className="bg-white/70 p-3 rounded-xl border border-white/60">
                                    <span className="block text-xs font-semibold opacity-80 mb-0.5">{stat.label}</span>
                                    <span className="block font-bold text-sm">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-2 text-center">
                            <Link href={project.link} className={`inline-block px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg ${project.buttonColor}`}>
                                View Details
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default CommunityOutreach;

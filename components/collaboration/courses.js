"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Award, Users, ArrowUpRight, PlayCircle } from "lucide-react";

export default function CoursesSection({ courses = [] }) {
  // Use DB courses if available, otherwise fall back to static default courses
  const displayCourses = courses.length > 0 ? courses : [
    {
      _id: "01",
      title: "Public Policy & Governance",
      category: "Foundations",
      duration: "6 Weeks",
      price: "Free",
      image: "https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/colaboration/1.avif",
      description: "Analytical tools to evaluate complex legislative frameworks and lead with data-driven insights.",
      applyLink: "https://forms.gle/ppf-course-enroll-placeholder"
    },
    {
      _id: "02",
      title: "Data-Driven Legislations",
      category: "Advanced Analytics",
      duration: "8 Weeks",
      price: "Free",
      image: "https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/colaboration/2.jpg",
      description: "Learn how data science helps write effective public laws and governance indicators.",
      applyLink: "https://forms.gle/ppf-course-enroll-placeholder"
    },
    {
      _id: "03",
      title: "Diplomatic Communication",
      category: "Specialized",
      duration: "4 Weeks",
      price: "Free",
      image: "https://raw.githubusercontent.com/Khushi-bhaskar01/PPF_Blob/main/colaboration/3.webp",
      description: "Practical course on policy negotiation, drafting statements, and international relations dynamics.",
      applyLink: "https://forms.gle/ppf-course-enroll-placeholder"
    },
  ];

  return (
    /* Reduced py-20 to py-12 */
    <section id="courses" className="py-12 bg-white relative overflow-hidden">

      {/* Brand-colored subtle glow */}
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-ppf-purple/5 blur-3xl opacity-40 rounded-full" />

      <div className="container mx-auto px-6 relative z-10">

        {/* Header - Using ppf-purple */}
        <div className="flex justify-between items-end mb-8 gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
              <span className="text-ppf-purple">PPF</span> Courses
            </h2>
          </div>

          <button className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-ppf-purple hover:text-ppf-purple/80 transition-all">
            View All
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Cards */}
        <div className="max-w-5xl mx-auto space-y-4">
          {displayCourses.map((course, index) => (
            <motion.div
              key={course._id || course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group flex flex-col md:flex-row bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-ppf-purple/30 hover:shadow-xl hover:shadow-ppf-purple/5 transition-all"
            >

              {/* Image with brand overlay */}
              <div className="md:w-[25%] h-40 md:h-auto relative overflow-hidden">
                <img
                  src={course.image || "https://raw.githubusercontent.com/Khushi-bhaskar01/PPF-Website-assets/main/collaboration-1.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-ppf-purple/10 group-hover:bg-transparent transition-colors" />
                <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              </div>

              {/* Content Area */}
              <div className="p-4 flex flex-col justify-center md:w-[75%]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-ppf-purple">
                      {course.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-ppf-purple transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  {/* Metadata - Using ppf-teal for icons */}
                  <div className="flex gap-3 text-[11px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      <BookOpen className="w-3 h-3 text-ppf-teal" />
                      {course.duration || "Self-Paced"}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      <Award className="w-3 h-3 text-ppf-teal" />
                      {course.price || "Free"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-2 line-clamp-2 font-medium">
                  {course.description || "Analytical tools to evaluate complex legislative frameworks and lead with data-driven insights."}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                  <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <Award className="w-3.5 h-3.5 text-ppf-orange" />
                    Verified Certificate
                  </span>

                  {course.applyLink ? (
                    <a
                      href={course.applyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-black text-ppf-purple hover:text-ppf-teal flex items-center gap-1 transition-colors uppercase tracking-tight group/btn"
                    >
                      Enroll Now
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </a>
                  ) : (
                    <button className="text-sm font-black text-ppf-purple hover:text-ppf-teal flex items-center gap-1 transition-colors uppercase tracking-tight group/btn">
                      Enroll Now
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
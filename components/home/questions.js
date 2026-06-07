"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaShieldAlt, FaHeart, FaCheckCircle } from "react-icons/fa"; // Removed FaChevronRight as it's no longer needed

export default function SupportQueries({ sectionWidth }) {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    query: "", // Changed from queryType to query
    citizenship: "", 
  });

  // State to manage submission status (idle, submitting, success, error)
  const [status, setStatus] = useState("idle");

  const itemAnimate = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle silent form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    // CRITICAL: Must use /formResponse instead of /viewform for silent submissions
    const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSf5xJ5ubPOhkXqfH5diAKnNjmoQvnhb4GDyXJ8Uy2NFZLXhUw/formResponse";
    
    // Construct URL parameters with the exact entry IDs
    const params = new URLSearchParams({
      "entry.1331648626": formData.name,
      "entry.1136254546": formData.contactNo,
      "entry.82436542": formData.email,
      "entry.506193359": formData.citizenship, 
      "entry.1151916087": formData.query, // Now sending the textarea string
    });

    try {
      // Send the data silently in the background
      await fetch(baseUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      // Show success message and clear form
      setStatus("success");
      setFormData({
        name: "",
        contactNo: "",
        email: "",
        query: "",
        citizenship: "",
      });
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus("error");
    }
  };

  return (
    <section id="queries" className={`relative py-12 px-6 bg-white ${sectionWidth}`}>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        
        {/* LEFT COLUMN: Compact Form */}
        <motion.div 
          {...itemAnimate}
          className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-lg shadow-ppf-purple/5 min-h-[480px] flex flex-col justify-center"
        >
          {status === "success" ? (
            // SUCCESS STATE UI
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 text-3xl">
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl font-lora font-bold text-slate-900 mb-2">Message Sent!</h3>
              <p className="text-sm font-lato font-medium text-slate-500 mb-6">
                Thank you for reaching out. Our team will get back to you shortly.
              </p>
              <button 
                onClick={() => setStatus("idle")}
                className="text-xs font-lato font-bold text-ppf-purple uppercase tracking-widest hover:underline"
              >
                Send Another Query
              </button>
            </motion.div>
          ) : (
            // NORMAL FORM UI
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-lora font-bold text-slate-900 leading-tight">Have a Question ?</h3>
                <p className="text-sm text-slate-500 font-lato font-medium">Our team will get back to you shortly.</p>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name" 
                  required
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-ppf-purple focus:ring-2 focus:ring-ppf-purple/5 transition-all text-sm font-lato font-medium text-slate-700"
                />

                <input 
                  type="tel" 
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  placeholder="Contact Number" 
                  required
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-ppf-purple focus:ring-2 focus:ring-ppf-purple/5 transition-all text-sm font-lato font-medium text-slate-700"
                />

                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address" 
                  required
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-ppf-purple focus:ring-2 focus:ring-ppf-purple/5 transition-all text-sm font-lato font-medium text-slate-700"
                />

                {/* Replaced Select Dropdown with Textarea */}
                <textarea 
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  placeholder="Write your query here..." 
                  required
                  rows="3"
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-ppf-purple focus:ring-2 focus:ring-ppf-purple/5 transition-all text-sm font-lato font-medium text-slate-700 resize-none"
                ></textarea>

                <div className="py-1">
                  <p className="text-xs text-slate-600 font-lato font-black mb-2">Are you a citizen?</p>
                  <div className="flex flex-wrap gap-4">
                    <label htmlFor="citizen-india" className="flex items-center gap-2 text-xs text-slate-600 font-lato font-bold cursor-pointer">
                      <input
                        type="radio"
                        id="citizen-india"
                        name="citizenship"
                        value="Yes" 
                        onChange={handleChange}
                        required
                        className="w-4 h-4 accent-ppf-purple cursor-pointer"
                      />
                      India
                    </label>
                    <label htmlFor="citizen-foreign" className="flex items-center gap-2 text-xs text-slate-600 font-lato font-bold cursor-pointer">
                      <input
                        type="radio"
                        id="citizen-foreign"
                        name="citizenship"
                        value="No" 
                        onChange={handleChange}
                        required
                        className="w-4 h-4 accent-ppf-purple cursor-pointer"
                      />
                      Foreign Country
                    </label>
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-xs text-center font-bold">Something went wrong. Please try again.</p>
                )}

                <motion.button 
                  type="submit"
                  disabled={status === "submitting"}
                  whileHover={{ scale: status === "submitting" ? 1 : 1.01 }}
                  whileTap={{ scale: status === "submitting" ? 1 : 0.99 }}
                  className={`w-full text-white font-lato font-black uppercase tracking-widest text-xs py-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                    status === "submitting" ? "bg-ppf-purple/70 cursor-not-allowed" : "bg-ppf-purple hover:bg-ppf-purple/90"
                  }`}
                >
                  {status === "submitting" ? "SENDING..." : "PROCEED TO CONNECT"}
                  {status !== "submitting" && <FaPaperPlane className="text-[10px]" />}
                </motion.button>
              </form>

              <div className="mt-4 flex items-center gap-2 text-[9px] font-lato font-bold text-slate-400 uppercase tracking-wider justify-center">
                <FaShieldAlt className="text-ppf-teal" /> Encrypted Data Handling
              </div>
            </>
          )}
        </motion.div>

        {/* RIGHT COLUMN: Impact Text */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:pl-4"
        >
          <h2 className="text-3xl md:text-4xl font-lora font-black text-slate-900 mb-4 leading-tight">
            CONNECT
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-ppf-orange/20 rounded-full flex items-center justify-center text-ppf-purple text-sm">
                <FaPaperPlane />
              </div>
              <p className="text-sm font-lato font-bold md:text-base text-slate-600 leading-relaxed">
                We are here to answer your questions. Drop us a message and we will get back to you shortly.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-ppf-purple rounded-full flex items-center justify-center text-white text-sm">
                <FaHeart />
              </div>
              <p className="text-sm md:text-base font-lato font-bold text-slate-600 leading-relaxed">
                Our work relies on the support of individuals and foundations. We invite you to support our vision.
              </p>
            </div>
          </div>

          <div className="mt-6 p-5 border-l-2 border-ppf-purple bg-slate-50 rounded-r-xl">
            <p className="text-slate-800 font-lato font-bold text-sm md:text-base italic leading-snug">
              &quot; Help us navigate the world towards a better place. &quot;
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
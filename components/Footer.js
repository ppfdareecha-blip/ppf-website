"use client";
import React from 'react';
import Image from 'next/image';
import {
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaArrowRight
} from 'react-icons/fa';

const Footer = ({ sectionWidth }) => {
  const footerSections = [
    {
      title: 'ADDRESS',
      content: (
        // Increased font from text-xs (12px) to text-[13px]
        <div className="text-[13px] space-y-2 text-vibrant-offwhite/90 font-futura">
          <div className="flex items-start gap-2.5">
            <FaMapMarkerAlt className="text-vibrant-teal mt-1 flex-shrink-0" />
            <p className="leading-snug">
              371, Chandanwari Plot No.8, Dwarka Sector-10, <br />
              New Delhi-110075
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <FaPhoneAlt className="text-vibrant-teal flex-shrink-0" />
            <p className="font-bold font-helvetica">+91 11 4105 8454</p>
          </div>
          <div className="flex items-center gap-2.5">
            <FaEnvelope className="text-vibrant-teal flex-shrink-0" />
            <p className="hover:text-vibrant-teal transition-colors cursor-pointer"><a href="mailto:policyperspective@gmail.com">policyperspective@gmail.com</a></p>
          </div>
        </div>
      ),
    },
    {
      title: 'QUICK LINKS',
      links: [
        { label: 'About Us', href: '/#about' },
        { label: 'Centers', href: '/#centers' },
        { label: 'Recent Activities', href: '/#activities' },
        { label: 'Opinions', href: '/pages/opinions' },
      ],
    },
    {
      title: 'RESOURCES',
      links: [
        { label: 'Research Reports', href: '/pages/publications/#scholars' },
        { label: 'Annual Reports', href: '/pages/publications/#annualReport' },
        { label: 'Upcoming Events', href: '/pages/activities?tab=upcoming' },
        { label: 'Media', href: '/pages/Media' },
      ],
    },
    {
      title: 'COLLABORATION',
      links: [
        { label: 'Donate', href: '/pages/collaboration/#donate' },
        { label: 'Courses', href: '/pages/collaboration/#courses' },
        { label: 'Internships', href: '/pages/collaboration/#internships' },
        { label: 'Contact Support', href: '/#queries' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: 'https://www.facebook.com/profile.php?id=100068783625651', label: 'Facebook' },
    { icon: <FaTwitter />, href: 'https://x.com/PPFNewDelhi', label: 'X' },
    { icon: <FaLinkedinIn />, href: 'https://www.linkedin.com/company/policy-perspectives-foundation-ppf-%E0%A4%A8%E0%A5%80%E0%A4%A4%E0%A4%BF-%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A5%87%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AF-%E0%A4%B8%E0%A4%82%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A4%BE%E0%A4%A8/', label: 'LinkedIn' },
    { icon: <FaInstagram />, href: 'https://www.instagram.com/policy_perspectives_foundation/', label: 'Instagram' },
  ];

  return (
    <footer className="bg-ppf-purple text-vibrant-offwhite border-t border-vibrant-violet/30 pt-12 pb-12 px-6 relative overflow-hidden mt-auto">
      <div className="absolute top-0 right-0 w-48 h-48 bg-vibrant-violet/10 blur-[80px] rounded-full pointer-events-none" />

      <div className={`${sectionWidth || 'max-w-7xl'} mx-auto relative z-10`}>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-y-8 gap-x-6 mb-10">

          {/* Brand Identity */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start">
            <div className="bg-white p-2 rounded-lg mb-4 shadow-lg">
              <Image src="/logo-circle.png" alt="PPF Logo" width={42} height={42} className="object-contain" />
            </div>
            <h2 className="text-xs font-helvetica font-black tracking-[0.15em] uppercase">
              Policy Perspectives<br />
              <span className="text-vibrant-teal text-[9px] ">Foundation</span>
            </h2>
          </div>

          {/* Mapping Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col">
              {/* Higher contrast for headers: pure vibrant-offwhite */}
              <h3 className="text-[11px] font-helvetica font-black tracking-[0.15em] uppercase mb-5 text-vibrant-offwhite">
                {section.title}
              </h3>

              {section.content && <div>{section.content}</div>}

              {section.links && (
                <ul className="space-y-2 font-futura">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {/* Increased link size to text-sm (14px) for better legibility */}
                      <a
                        href={link.href}
                        className="text-sm text-vibrant-offwhite/80 hover:text-vibrant-teal transition-all duration-200 flex items-center group"
                      >
                        <span className="h-[1.5px] w-0 bg-vibrant-teal group-hover:w-2 mr-0 group-hover:mr-2 transition-all"></span>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Newsletter Section */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-[11px] font-helvetica font-black tracking-[0.15em] uppercase mb-5 text-vibrant-offwhite">Newsletter</h3>
            <p className="text-sm font-futura text-vibrant-offwhite/80 mb-3 leading-snug">
              Read our latest publications and insights.
            </p>
            <a 
              href="/pages/newsletter"
              className="inline-flex items-center gap-2 bg-vibrant-teal/10 hover:bg-vibrant-teal/20 text-vibrant-teal border border-vibrant-teal/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
            >
              Read Now <FaArrowRight size={10} />
            </a>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="border-t border-vibrant-offwhite/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-helvetica font-bold uppercase  text-vibrant-offwhite/40 flex items-center gap-6">
            <p>© {new Date().getFullYear()} PPF India</p>
            <div className="hidden sm:flex gap-4">
              <a href="#" className="hover:text-vibrant-teal transition-colors">Privacy</a>
              <a href="#" className="hover:text-vibrant-teal transition-colors">Terms</a>
            </div>
          </div>

          <div className="flex space-x-2.5">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="w-8 h-8 rounded-lg bg-black/20 border border-vibrant-violet/20 flex items-center justify-center text-vibrant-offwhite/70 hover:text-vibrant-teal hover:border-vibrant-teal transition-all duration-300"
                aria-label={link.label}
              >
                <span className="text-xs">{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
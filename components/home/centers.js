"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaPlus } from "react-icons/fa";
import Link from "next/link";

const centers = [
  { 
    name: 'Centre for Women and Child Welfare', 
    abbr: 'PPF-CWCW', 
    img: '/CentersPictures/WomenWelfare.jpg',
    innerImgs: [
      "/CentersPictures/Women and Child Welfare-20260703T070530Z-3-001/Women and Child Welfare/481069956_934950565474389_2256850297384037541_n.jpg",
      "/CentersPictures/Women and Child Welfare-20260703T070530Z-3-001/Women and Child Welfare/481225239_934950842141028_7191490683642867923_n.jpg",
      "/CentersPictures/Women and Child Welfare-20260703T070530Z-3-001/Women and Child Welfare/485684195_650415404596987_43476781262464276_n.jpg",
      "/CentersPictures/Women and Child Welfare-20260703T070530Z-3-001/Women and Child Welfare/486157324_650415781263616_5821018844301577313_n.jpg"
    ]
  },
  { 
    name: 'Centre for New Technologies', 
    abbr: 'PPF-CNT', 
    img: '/CentersPictures/NewTechnologies.jpg',
    innerImgs: [
      "/CentersPictures/New Technologies-20260703T070529Z-3-001/New Technologies/71497084_1121686878030039_8541761422764277760_n.jpg",
      "/CentersPictures/New Technologies-20260703T070529Z-3-001/New Technologies/71783163_1121686814696712_8466702286536572928_n.jpg",
      "/CentersPictures/New Technologies-20260703T070529Z-3-001/New Technologies/72756626_1121686974696696_4324232292621877248_n.jpg",
      "/CentersPictures/New Technologies-20260703T070529Z-3-001/New Technologies/88156409_1247885062076886_1408131983208349696_n.jpg"
    ]
  },
  { 
    name: 'Centre for Neighbourhood Studies', 
    abbr: 'PPF-CNS', 
    img: '/CentersPictures/NeighbourhoodStudies.jpg',
    innerImgs: [
      "/CentersPictures/Neighbourhood Studies-20260703T070529Z-3-001/Neighbourhood Studies/485068363_2619039574961421_5431773696228440077_n.jpg",
      "/CentersPictures/Neighbourhood Studies-20260703T070529Z-3-001/Neighbourhood Studies/485302840_2619039241628121_529896400925547850_n.jpg",
      "/CentersPictures/Neighbourhood Studies-20260703T070529Z-3-001/Neighbourhood Studies/485308709_2619039438294768_290771796700627132_n.jpg",
      "/CentersPictures/Neighbourhood Studies-20260703T070529Z-3-001/Neighbourhood Studies/70346377_1108713615994032_1148346325054521344_n.jpg"
    ]
  },
  { 
    name: 'Centre for Disaster Risk Reduction and Management', 
    abbr: 'PPF-CDRRM', 
    img: '/CentersPictures/DisasterManagement.jpg',
    innerImgs: [
      "/CentersPictures/Disaster Risk Reduction and Management-20260703T070534Z-3-001/Disaster Risk Reduction and Management/482006172_2607125029486209_3227192961001290221_n.jpg",
      "/CentersPictures/Disaster Risk Reduction and Management-20260703T070534Z-3-001/Disaster Risk Reduction and Management/482016662_2607125046152874_1877085211119097492_n.jpg",
      "/CentersPictures/Disaster Risk Reduction and Management-20260703T070534Z-3-001/Disaster Risk Reduction and Management/561366870_1104136598555784_1168552525667655998_n.jpg",
      "/CentersPictures/Disaster Risk Reduction and Management-20260703T070534Z-3-001/Disaster Risk Reduction and Management/84055097_1226028957595830_8834361021901570048_n.jpg"
    ]
  },
  { 
    name: 'Centre for Cohesive Society Studies', 
    abbr: 'PPF-CCSS', 
    img: '/CentersPictures/CohesiveSociety.jpg',
    innerImgs: [
      "/CentersPictures/Cohesive Society Studies-20260703T070532Z-3-001/Cohesive Society Studies/83227795_1230449837153742_6672155583220547584_n.jpg",
      "/CentersPictures/Cohesive Society Studies-20260703T070532Z-3-001/Cohesive Society Studies/83910879_1230449547153771_2387673161383542784_n.jpg",
      "/CentersPictures/Cohesive Society Studies-20260703T070532Z-3-001/Cohesive Society Studies/84182454_1230451037153622_2141255743557337088_n.jpg",
      "/CentersPictures/Cohesive Society Studies-20260703T070532Z-3-001/Cohesive Society Studies/83227795_1230449837153742_6672155583220547584_n.jpg"
    ]
  },
  { 
    name: 'Centre for Radicalisation and Security Studies', 
    abbr: 'PPF-CRSS', 
    img: '/CentersPictures/Radicalisation.jpg',
    innerImgs: [
      "/CentersPictures/Radicalisation and Security Studies-20260703T070538Z-3-001/Radicalisation and Security Studies/66292894_1059249280940466_5939306623469092864_n.jpg",
      "/CentersPictures/Radicalisation and Security Studies-20260703T070538Z-3-001/Radicalisation and Security Studies/66385887_1059249234273804_98938583162814464_n.jpg",
      "/CentersPictures/Radicalisation and Security Studies-20260703T070538Z-3-001/Radicalisation and Security Studies/66407511_1059249334273794_263802689526169600_n.jpg",
      "/CentersPictures/Radicalisation and Security Studies-20260703T070538Z-3-001/Radicalisation and Security Studies/66615838_1059249454273782_7645117292405063680_n.jpg"
    ]
  },
  { 
    name: 'Centre for Equity and Diversity Studies', 
    abbr: 'PPF-CEDS', 
    img: '/CentersPictures/Equity&Diversity.jpg',
    innerImgs: [
      "/CentersPictures/Equity and Diversity Studies-20260703T070535Z-3-001/Equity and Diversity Studies/69351170_1096192723912788_6972045017464438784_n.jpg",
      "/CentersPictures/Equity and Diversity Studies-20260703T070535Z-3-001/Equity and Diversity Studies/69501942_1095480647317329_1875704903557447680_n.jpg",
      "/CentersPictures/Equity and Diversity Studies-20260703T070535Z-3-001/Equity and Diversity Studies/69618904_1096192667246127_8374768906702684160_n.jpg",
      "/CentersPictures/Equity and Diversity Studies-20260703T070535Z-3-001/Equity and Diversity Studies/69351170_1096192723912788_6972045017464438784_n.jpg"
    ]
  }
];

export default function Centers({ sectionWidth }) {
  return (
    <section id="centers" className="py-20 bg-[#f8f7ff]">
      <div className={sectionWidth || "max-w-7xl mx-auto px-6"}>
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-10 bg-ppf-purple" />
            <span className="text-ppf-purple font-lato font-bold uppercase text-[10px]">
              Specialized Divisions
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-lora font-bold text-vibrant-charcoal mb-6 leading-tight">
            Centers of Excellence
          </h2>
          <p className="text-slate-600 text-lg font-lato max-w-2xl leading-relaxed">
            Independent research wings focused on shaping policy through 
            <span className="text-ppf-orange font-semibold"> data-driven analysis</span> and strategic foresight.
          </p>
        </motion.div>

        {/* Two-Part Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centers.map((center, i) => (
            <Link 
              key={i} 
              href={`/pages/centers/${center.abbr.toLowerCase()}`}
              className="block h-full"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.3 } }}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 cursor-pointer"
              >
                {/* TOP PART: IMAGE */}
                <div className="relative h-44 overflow-hidden flex-shrink-0 bg-slate-50">
                  {/* Main Front Image */}
                  <img 
                    src={center.img} 
                    alt={center.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0 z-10" 
                  />

                  {/* 4 Inner Images Reveal on Hover */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-slate-50 z-0">
                    {center.innerImgs?.map((imgSrc, idx) => {
                      return (
                        <div
                          key={idx}
                          className="relative w-full h-full overflow-hidden rounded-sm opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out"
                          style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                           <img src={imgSrc} className="w-full h-full object-cover" alt={`${center.name} detail ${idx + 1}`} />
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Abbreviation Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm z-20">
                    <span className="text-ppf-purple font-lato font-bold text-[10px] tracking-widest uppercase">
                      {center.abbr.split('-')[1]}
                    </span>
                  </div>
                </div>

                {/* BOTTOM PART: CONTENT */}
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <p className="text-ppf-purple font-lato font-bold text-[9px] uppercase tracking-[0.2em] mb-2 opacity-70">
                    {center.abbr}
                  </p>
                  <h3 className="text-slate-800 text-lg font-lora font-bold leading-snug mb-4 group-hover:text-ppf-purple transition-colors flex-grow">
                    {center.name}
                  </h3>
                  
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-lato font-bold text-slate-400 uppercase tracking-widest group-hover:text-ppf-purple transition-colors">
                      Explore Research
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-ppf-purple flex items-center justify-center transition-all duration-300">
                      <FaArrowRight className="text-slate-800 group-hover:text-white text-[10px] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
          
          {/* Join Us / Expanding Card */}
          <motion.div 
             className="group flex flex-col justify-center items-center h-full min-h-[320px] rounded-2xl border-2 border-dashed border-ppf-purple/20 p-8 text-center bg-white/40 hover:bg-white hover:border-ppf-purple/40 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-ppf-purple/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaPlus className="text-ppf-purple text-lg" />
            </div>
            <h4 className="text-slate-800 font-lora font-bold text-base mb-2">New Initiatives</h4>
            <p className="text-slate-500/60 font-lato text-xs leading-relaxed mb-4">
              Expanding our research horizons with upcoming centers in 2026.
            </p>
            <span className="inline-block px-4 py-1.5 rounded-full bg-ppf-purple/5 text-ppf-purple text-[9px] font-lato font-bold uppercase tracking-widest">
              Coming Soon
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
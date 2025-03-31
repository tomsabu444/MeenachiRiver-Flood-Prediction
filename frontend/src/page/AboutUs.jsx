import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RiverFlowImage from '../assets/About/river-flow.jpeg';
import VillageLifeImage from '../assets/About/village-life.jpeg';
import SensorTechImage from '../assets/About/iot1.jpeg';
import DataFlowImage from '../assets/About/iot2.jpeg';
import AlertFlashImage from '../assets/About/s1.jpeg';
import WarningUIImage from '../assets/About/s11.jpeg';
import DashboardImage from '../assets/About/w1.jpeg';
import AnalyticsImage from '../assets/About/w11.jpeg';
import CommunityImage from '../assets/About/s2.jpeg';
import FutureHopeImage from '../assets/About/s22.jpeg';
import iotImage from '../assets/About/i2.jpeg';
import iotImage1 from '../assets/About/i22.jpeg';
import intImage from '../assets/About/in.jpeg';
import intImage1 from '../assets/About/in1.jpg';
import iImage from '../assets/About/si.jpeg';
import iImage1 from '../assets/About/si1.jpeg';
import kImage from '../assets/About/k1.jpeg';
import kImage1 from '../assets/About/k.jpeg';
import aImage from '../assets/About/a.png';
import aImage1 from '../assets/About/a1.png';
import sImage from '../assets/About/sr.jpeg';
import sImage1 from '../assets/About/sr1.jpeg';
import pImage from '../assets/About/p.png';
import alertImage from '../assets/About/al.png';
import alertImage1 from '../assets/About/al1.jpeg';
import pImage1 from '../assets/About/p1.png';
import cImage from '../assets/About/c.jpeg';
import cImage1 from '../assets/About/c1.jpeg';
import eImage from '../assets/About/e.jpeg';
import eImage1 from '../assets/About/e1.jpeg';

function AboutUs() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const timelineItems = [
    {
      number: 1,
      color: "cyan",
      title: "Our Roots",
      description: "We're pioneers safeguarding the Meenachil River communities with a revolutionary water monitoring and flood prediction system fueled by next-gen tech.",
      images: [RiverFlowImage, VillageLifeImage]
    },
    // Add the rest of your timeline items similarly
    // ... (you can copy the structure from the original component)
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-rose-500 mb-16 animate-pulse">
        Our Epic Journey
      </h1>

      {/* Timeline Container */}
      <div className="relative max-w-6xl mx-auto">
        {/* Vertical Line for Timeline */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-rose-500 h-full opacity-60 hidden md:block"></div>

        {/* Timeline Items */}
        <div className="space-y-20">
          {/* Item 1: Introduction */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up">
            <div className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">1</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-cyan-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-cyan-400 mb-3">Site Selection</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">Comprehensive site selection at Palai, Erattupetta, and Poonjar to develop advanced flood prediction system using strategic location analysis and water level monitoring technologies.
                </p>
            </div>
            {/* Multi-Image Carousel */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={RiverFlowImage} 
                alt="River Flow" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(RiverFlowImage)}
              />
              <img 
                src={VillageLifeImage} 
                alt="Village Life" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(VillageLifeImage)}
              />
            </div>
          </div>

          {/* Item 2: Technology */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-200">
            <div className="w-14 h-14 bg-fuchsia-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">2</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-fuchsia-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-fuchsia-400 mb-3">First Structure</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              Advanced IoT-enabled monitoring structure integrating ESP32 microcontroller, ultrasonic sensors for real-time water level tracking, transmitting precise data to centralized flood prediction system.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={AlertFlashImage} 
                alt="Alert Flash" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(AlertFlashImage)}
              />
              <img 
                src={WarningUIImage} 
                alt="Warning UI" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(WarningUIImage)}
              />
            </div>
          </div>

          {/* Item 3: Alerts */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-400">
            <div className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">3</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-rose-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-rose-400 mb-3">IoT v1: Smart Water Level Detector</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We developed an IoT component using a waterproof sensor and ESP32 to accurately monitor and detect water levels in real-time.</p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={SensorTechImage} 
                alt="Sensor Tech" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(SensorTechImage)}
              />
              <img 
                src={DataFlowImage} 
                alt="Data Flow" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(DataFlowImage)}
              />
            </div>
          </div>

          {/* Item 4: Platform */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-600">
            <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">4</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-emerald-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-emerald-400 mb-3">Website</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              Developed inaugural web interface displaying real-time water level monitoring, integrating sensor data visualization, threshold alerts, and comprehensive environmental parameters for initial hydraulic infrastructure tracking.</p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={DashboardImage} 
                alt="Dashboard" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(DashboardImage)}
              />
              <img 
                src={AnalyticsImage} 
                alt="Analytics" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(AnalyticsImage)}
              />
            </div>
          </div>

          {/* Item 5: Goal */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-800">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">5</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-amber-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-3">Elevated Sensor Structure for Water Level Monitoring</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We built a new external structure, integrating a single ultrasonic sensor to measure water levels accurately from outside the water surface.
</p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={CommunityImage} 
                alt="Community" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(CommunityImage)}
              />
              <img 
                src={FutureHopeImage} 
                alt="Future Hope" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(FutureHopeImage)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-200">
            <div className="w-14 h-14 bg-fuchsia-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">6</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-fuchsia-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-fuchsia-400 mb-3">IoT v2: Upgraded with GSM for Reliable Connectivity</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We enhanced our IoT setup by integrating a GSM module, ensuring stable internet connectivity without relying on Wi-Fi networks.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={iotImage} 
                alt="Alert Flash" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(iotImage)}
              />
              <img 
                src={iotImage1} 
                alt="Warning UI" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(iotImage1)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-800">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">7</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-amber-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-3">Water Level Monitoring Structure Installed at Poonjar</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              The new structure was successfully installed at Poonjar, featuring a sturdy design with GSM connectivity for reliable and accurate water level monitoring.</p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={iImage} 
                alt="Community" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(iImage)}
              />
              <img 
                src={iImage1} 
                alt="Future Hope" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(iImage1)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-200">
            <div className="w-14 h-14 bg-fuchsia-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">8</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-fuchsia-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-fuchsia-400 mb-3">Website v2: User-Friendly Water Monitoring Platform</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We developed a user-friendly website displaying real-time water levels and an interactive map for easy monitoring and location tracking.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={aImage} 
                alt="Alert Flash" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(aImage)}
              />
              <img 
                src={aImage1} 
                alt="Warning UI" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(aImage1)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-800">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">9</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-amber-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-3">National-Level Science Fest Achievement</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We proudly participated in the national-level science fest Srishti, where our civil team showcased their exceptional skills and secured 2nd prize.</p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={sImage} 
                alt="Community" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(sImage)}
              />
              <img 
                src={sImage1} 
                alt="Future Hope" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(sImage1)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-200">
            <div className="w-14 h-14 bg-fuchsia-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">10</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-fuchsia-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-fuchsia-400 mb-3">Water Level Monitoring Structure Installed at Kidangoor</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We designed and installed a complex water monitoring structure at Kidangoor, integrating a new IoT system with two ultrasonic sensors for enhanced accuracy.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={kImage} 
                alt="Alert Flash" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(kImage)}
              />
              <img 
                src={kImage1} 
                alt="Warning UI" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(kImage1)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-800">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">11</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-amber-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-3">Water Level Prediction System</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We developed a prediction system for Kidangoor that accurately forecasts water levels for the next 6 hours, enhancing monitoring and preparedness.</p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={pImage} 
                alt="Community" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(pImage)}
              />
              <img 
                src={pImage1} 
                alt="Future Hope" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(pImage1)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-200">
            <div className="w-14 h-14 bg-fuchsia-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">12</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-fuchsia-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-fuchsia-400 mb-3">Project Presentation at St. Joseph College of Engineering</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We participated in the Inventra project competition at St. Joseph College of Engineering, showcasing our water level monitoring and prediction system.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={cImage} 
                alt="Alert Flash" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(cImage)}
              />
              <img 
                src={cImage1} 
                alt="Warning UI" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(cImage1)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-800">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">13</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-amber-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-3">Complex Water Monitoring Structure Installed at Erattupetta</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We successfully implemented a complex water monitoring structure at Erattupetta, enhancing accuracy and reliability in tracking real-time water levels.</p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={eImage} 
                alt="Community" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(eImage)}
              />
              <img 
                src={eImage1} 
                alt="Future Hope" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(eImage1)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-200">
            <div className="w-14 h-14 bg-fuchsia-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">14</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-fuchsia-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-fuchsia-400 mb-3">SMS and Call Alert System Implemented
              </h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We developed a dual alert system that sends both SMS and call notifications, ensuring timely warnings and improved responsiveness during critical water level changes.</p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={alertImage} 
                alt="Alert Flash" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(alertImage)}
              />
              <img 
                src={alertImage1} 
                alt="Warning UI" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(alertImage1)}
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-800">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">15</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-amber-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-3">Internship Completion with MRRM</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
              We successfully completed our internship with MRRM, contributing to a water monitoring project, and received certification during Bhoomika's 22nd anniversary celebration.</p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={intImage} 
                alt="Community" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(intImage)}
              />
              <img 
                src={intImage1} 
                alt="Future Hope" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                onClick={() => handleImageClick(intImage1)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            />
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700"
              onClick={handleClose}
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default AboutUs;
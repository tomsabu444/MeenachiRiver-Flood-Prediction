import React from "react";
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
import iImage from '../assets/About/si.jpeg';
import iImage1 from '../assets/About/si1.jpeg';

function AboutUs() {
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
              <h2 className="text-2xl lg:text-3xl font-bold text-cyan-400 mb-3">Our Roots</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                We're pioneers safeguarding the Meenachil River communities with a revolutionary water monitoring and flood prediction system fueled by next-gen tech.
              </p>
            </div>
            {/* Multi-Image Carousel */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={RiverFlowImage} 
                alt="River Flow" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
              <img 
                src={VillageLifeImage} 
                alt="Village Life" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
            </div>
          </div>

          {/* Item 2: Technology */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-200">
            <div className="w-14 h-14 bg-fuchsia-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">2</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-fuchsia-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-fuchsia-400 mb-3">Tech Alchemy</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                IoT sensors across Kidangoor, Theekoy, Cheripadu, Pala, and Perror feed real-time data into our 93% accurate ML flood prediction engine.
              </p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={AlertFlashImage} 
                alt="Alert Flash" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
              <img 
                src={WarningUIImage} 
                alt="Warning UI" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
            </div>
          </div>

          {/* Item 3: Alerts */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-400">
            <div className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">3</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-rose-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-rose-400 mb-3">Alert Nexus</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                Our tri-color warning system (yellow, orange, red) blasts instant web and email alerts when water levels flirt with danger.
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={SensorTechImage} 
                alt="Sensor Tech" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
              <img 
                src={DataFlowImage} 
                alt="Data Flow" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
            </div>
          </div>

          {/* Item 4: Platform */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-600">
            <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">4</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-emerald-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-emerald-400 mb-3">Digital Haven</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                Our sleek web platform offers stakeholders real-time insights, historical data, and predictive analytics for smarter disaster moves.
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={DashboardImage} 
                alt="Dashboard" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
              <img 
                src={AnalyticsImage} 
                alt="Analytics" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
            </div>
          </div>

          {/* Item 5: Goal */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-800">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">5</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-amber-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-3">Our Vision</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                We're here to save lives, boost resilience, and redefine flood management for vulnerable regions across the globe.
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={CommunityImage} 
                alt="Community" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
              <img 
                src={FutureHopeImage} 
                alt="Future Hope" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-200">
            <div className="w-14 h-14 bg-fuchsia-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">6</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-fuchsia-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-fuchsia-400 mb-3">Tech Alchemy</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                IoT sensors across Kidangoor, Theekoy, Cheripadu, Pala, and Perror feed real-time data into our 93% accurate ML flood prediction engine.
              </p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={iotImage} 
                alt="Alert Flash" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
              <img 
                src={iotImage1} 
                alt="Warning UI" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
            </div>
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 animate-fade-up animation-delay-800">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center z-10 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold">7</span>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-2xl max-w-sm lg:max-w-md hover:shadow-amber-500/20 transition-shadow duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-3">Our Vision</h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed">
                We're here to save lives, boost resilience, and redefine flood management for vulnerable regions across the globe.
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <img 
                src={iImage} 
                alt="Community" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
              <img 
                src={iImage1} 
                alt="Future Hope" 
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0 snap-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
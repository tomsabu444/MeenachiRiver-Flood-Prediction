import React from "react";

function AboutUs() {
 return (
   <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center p-6">
     {/* Heading */}
     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 text-center">
       About Us
     </h1>
     {/* Content */}
     <div className="flex justify-center items-center">
       <p className="text-lg text-center leading-relaxed max-w-4xl mx-auto">
         Our automated water level monitoring and flood prediction system safeguards communities along the Meenachil River through innovative technology. Using strategically placed sensors at key locations including Kidangoor, Theekoy, Cheripadu, Pala, and Perror, we continuously monitor water levels and environmental conditions in real-time. By combining Internet of Things (IoT) technology with advanced machine learning, our system achieves 93% accuracy in predicting water levels. When water levels approach critical thresholds, our platform automatically issues alerts through web notifications and email, using a simple three-tier warning system (yellow, orange, red). Through our user-friendly web platform, stakeholders can access real-time data visualization, historical trends, and predictive analytics. This comprehensive approach to flood monitoring and prediction helps protect lives and property while enabling better-informed disaster response decisions. Our goal is to strengthen community resilience and serve as a model for flood management in similar regions.
       </p>
     </div>
   </div>
 );
}

export default AboutUs;
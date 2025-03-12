import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating resource fetching
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-lavender-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lavender-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-lavender-600 to-lavender-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Pawsitive Resources</h1>
          <p className="text-lg md:text-xl mb-6 text-lavender-100">Connecting pet parents with the resources they need</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigate("/search")}
              className="bg-white text-lavender-700 hover:bg-lavender-50 px-6 py-2 rounded-lg font-medium text-sm transition-colors duration-300 shadow-sm"
            >
              Search Resources
            </button>
            <button 
              onClick={() => navigate("/nearby")}
              className="bg-transparent hover:bg-lavender-700 border border-white px-6 py-2 rounded-lg font-medium text-sm transition-colors duration-300"
            >
              Find Nearby
            </button>
          </div>
        </div>
      </div>

      {/* Pet Type Selection */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center text-lavender-900 mb-8">Choose Your Pet</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dog Section */}
          <div 
            onClick={() => navigate("/dog-resources")}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 bg-lavender-100 flex items-center justify-center">
              <span className="text-7xl">🐕</span>
            </div>
            <div className="p-5 border-t border-lavender-100">
              <h3 className="text-xl font-bold mb-2 text-lavender-900">Dog Resources</h3>
              <p className="mb-3 text-sm text-gray-600">Find everything your canine companion needs - from healthcare and nutrition to training and supplies.</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1.5">
                  <span className="h-7 w-7 rounded-full bg-lavender-100 flex items-center justify-center">🏥</span>
                  <span className="h-7 w-7 rounded-full bg-lavender-100 flex items-center justify-center">🍖</span>
                  <span className="h-7 w-7 rounded-full bg-lavender-100 flex items-center justify-center">🧶</span>
                  <span className="h-7 w-7 rounded-full bg-lavender-100 flex items-center justify-center">🦮</span>
                </div>
                <span className="text-lavender-600 text-sm font-medium flex items-center">
                  View All <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          
          {/* Cat Section */}
          <div 
            onClick={() => navigate("/cat-resources")}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 bg-lavender-100 flex items-center justify-center">
              <span className="text-7xl">🐈</span>
            </div>
            <div className="p-5 border-t border-lavender-100">
              <h3 className="text-xl font-bold mb-2 text-lavender-900">Cat Resources</h3>
              <p className="mb-3 text-sm text-gray-600">Discover all the essentials for your feline friend - from health services and food to toys and grooming.</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1.5">
                  <span className="h-7 w-7 rounded-full bg-lavender-100 flex items-center justify-center">🏥</span>
                  <span className="h-7 w-7 rounded-full bg-lavender-100 flex items-center justify-center">🍖</span>
                  <span className="h-7 w-7 rounded-full bg-lavender-100 flex items-center justify-center">🧶</span>
                  <span className="h-7 w-7 rounded-full bg-lavender-100 flex items-center justify-center">🐾</span>
                </div>
                <span className="text-lavender-600 text-sm font-medium flex items-center">
                  View All <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Resources Section */}
      <div className="bg-lavender-100/50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-lavender-900 mb-8">Featured Pet Resources</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Featured Resource 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 border-l-3 border-lavender-500">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🏥</span>
                  <h3 className="text-lg font-semibold text-lavender-900">24/7 Pet Emergency Clinic</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">Round-the-clock emergency care for your pets when they need it most.</p>
                <p className="text-xs text-gray-500">Race Course Circle, Vadodara</p>
              </div>
              <div className="px-4 py-3 bg-lavender-50 border-t border-lavender-100">
                <button 
                  onClick={() => navigate("/dog-resources/dog_health")}
                  className="text-lavender-700 font-medium text-xs hover:text-lavender-900 flex items-center"
                >
                  Find Emergency Clinics
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Featured Resource 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 border-l-3 border-lavender-500">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🧶</span>
                  <h3 className="text-lg font-semibold text-lavender-900">Pet Supplies Megastore</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">One-stop shop for all your pet needs - from food to toys to accessories.</p>
                <p className="text-xs text-gray-500">Alkapuri, Vadodara</p>
              </div>
              <div className="px-4 py-3 bg-lavender-50 border-t border-lavender-100">
                <button 
                  onClick={() => navigate("/dog-resources/dog_supplies")}
                  className="text-lavender-700 font-medium text-xs hover:text-lavender-900 flex items-center"
                >
                  Find Pet Supplies
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Featured Resource 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 border-l-3 border-lavender-500">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🦮</span>
                  <h3 className="text-lg font-semibold text-lavender-900">Professional Pet Training</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">Expert trainers to help with obedience, behavior issues, and specialized skills.</p>
                <p className="text-xs text-gray-500">Fatehgunj, Vadodara</p>
              </div>
              <div className="px-4 py-3 bg-lavender-50 border-t border-lavender-100">
                <button 
                  onClick={() => navigate("/dog-resources/dog_services")}
                  className="text-lavender-700 font-medium text-xs hover:text-lavender-900 flex items-center"
                >
                  Find Training Services
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center border border-lavender-200">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-xl font-bold text-lavender-900 mb-3">Need help finding the right resources?</h2>
            <p className="text-gray-600 text-sm mb-4">
              Not sure what your pet needs? Our resource finder can help you discover the perfect services and products.
            </p>
            <button 
              onClick={() => navigate("/resource-finder")}
              className="bg-lavender-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-lavender-700 transition-colors duration-300 shadow-sm"
            >
              Try Resource Finder
            </button>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="text-6xl bg-lavender-100 p-4 rounded-full">🔍</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add support for the border-l-3 class
const style = document.createElement('style');
style.textContent = `
  .border-l-3 {
    border-left-width: 3px;
  }
`;
document.head.appendChild(style);

export default Home;
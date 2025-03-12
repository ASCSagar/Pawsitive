import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Hospital, Store, Rotate3d, MapPin } from "lucide-react";

const featuredResources = [
  {
    title: "24/7 Pet Emergency Clinic",
    description:
      "Round-the-clock emergency care for your pets when they need it most.",
    address: "Race Course Circle, Vadodara",
    buttonTitle: "Find Emergency Clinics",
    icon: <Hospital size={16} className="ml-1" />,
  },
  {
    title: "Pet Supplies Megastore",
    description: "Find premium food, toys, and accessories for your pets.",
    address: "City Mall, Vadodara",
    buttonTitle: "Explore Supplies",
    icon: <Store size={16} className="ml-1" />,
  },
  {
    title: "Professional Pet Training",
    description:
      "Expert trainers to help with obedience, behavior issues, and specialized skills.",
    address: "Fatehgunj, Vadodara",
    buttonTitle: "Find Training Services",
    icon: <Rotate3d size={16} className="ml-1" />,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center text-lavender-900 mb-8">
          Choose Your Pet "Dog" OR "Cat"
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/dog-resources")}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 bg-lavender-100 flex items-center justify-center">
              <span className="text-7xl">🐕</span>
            </div>
            <div className="p-5 border-t border-lavender-100">
              <h3 className="text-xl font-bold mb-2 text-lavender-900">
                Dog Resources
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                Find everything your canine companion needs - from healthcare
                and nutrition to training and supplies.
              </p>
              <div className="flex justify-end items-center">
                <span className="text-lavender-600 text-sm font-medium flex items-center">
                  View All <ArrowRight size={16} className="ml-1" />
                </span>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/cat-resources")}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 bg-lavender-100 flex items-center justify-center">
              <span className="text-7xl">🐈</span>
            </div>
            <div className="p-5 border-t border-lavender-100">
              <h3 className="text-xl font-bold mb-2 text-lavender-900">
                Cat Resources
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                Discover all the essentials for your feline friend - from health
                services and food to toys and grooming.
              </p>
              <div className="flex justify-end items-center">
                <span className="text-lavender-600 text-sm font-medium flex items-center">
                  View All <ArrowRight size={16} className="ml-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-lavender-100/50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-lavender-900 mb-8">
            Featured Pet Resources
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredResources.map((resource, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-l-4 border-lavender-500">
                  <div className="flex items-center mb-3">
                    {resource.icon}
                    <h3 className="text-lg font-semibold text-lavender-900 ml-2">
                      {resource.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {resource.description}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin size={14} className="mr-1" /> {resource.address}
                  </p>
                </div>
                <div className="px-4 py-3 bg-lavender-50 border-t border-lavender-100">
                  <button className="text-lavender-700 font-medium text-xs hover:text-lavender-900 flex items-center">
                    {resource.buttonTitle}
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
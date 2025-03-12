import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Hospital,
  Store,
  Rotate3d,
  MapPin,
  Search,
  X,
} from "lucide-react";

const dogResourceCategories = [
  {
    id: "dog_health",
    name: "Health & Wellness",
    icon: "🏥",
    description:
      "Veterinarians, emergency care, grooming, dental care, and preventative treatments.",
    examples: [
      "Veterinarians",
      "Emergency clinics",
      "Dental care",
      "Grooming",
      "Preventative care",
    ],
  },
  {
    id: "dog_nutrition",
    name: "Nutrition",
    icon: "🍖",
    description:
      "Pet food stores, specialty foods, treats, and water supplies for your dog.",
    examples: [
      "Pet food stores",
      "Online retailers",
      "Treat suppliers",
      "Fresh water solutions",
    ],
  },
  {
    id: "dog_supplies",
    name: "Supplies & Equipment",
    icon: "🧶",
    description:
      "Collars, leashes, carriers, beds, bowls, toys, and grooming supplies.",
    examples: [
      "Collars & leashes",
      "Carriers & crates",
      "Beds & bowls",
      "Toys",
      "Grooming tools",
    ],
  },
  {
    id: "dog_services",
    name: "Services",
    icon: "🦮",
    description:
      "Dog walkers, pet sitters, trainers, boarding facilities, and daycares.",
    examples: ["Dog walking", "Pet sitting", "Training", "Boarding", "Daycare"],
  },
  {
    id: "dog_information",
    name: "Information & Support",
    icon: "📚",
    description:
      "Online resources, breed info, animal shelters, pet communities, and helplines.",
    examples: [
      "Online resources",
      "Breed guides",
      "Shelters & rescues",
      "Community groups",
      "Helplines",
    ],
  },
  {
    id: "dog_legal",
    name: "Legal & Identification",
    icon: "🏷️",
    description:
      "Microchipping, ID tags, licensing, and local animal regulations.",
    examples: ["Microchipping", "ID tags", "Licensing", "Local regulations"],
  },
];

const featuredResources = [
  {
    title: "City Pet Hospital",
    description:
      "Comprehensive veterinary care for dogs of all breeds and ages.",
    address: "Near Police Parade Ground, Vadodara",
    buttonTitle: "Find Vet Clinics",
    icon: <Hospital size={16} className="ml-1" />,
  },
  {
    title: "Pet Food Emporium",
    description: "Premium dog foods, treats, and specialty nutrition products.",
    address: "Karelibaug, Vadodara",
    buttonTitle: "Find Pet Food",
    icon: <Store size={16} className="ml-1" />,
  },
  {
    title: "Paws & Learn Training",
    description: "Professional dog training and behavioral solutions.",
    address: "Fatehgunj, Vadodara",
    buttonTitle: "Find Training Services",
    icon: <Rotate3d size={16} className="ml-1" />,
  },
];

const DogResources = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCategories = searchTerm
    ? dogResourceCategories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dogResourceCategories;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-lavender-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lavender-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-50">
      <div className="relative bg-gradient-to-r from-lavender-700 via-lavender-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
            <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-10 left-1/4 w-24 h-24 rounded-full bg-white"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-white"></div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 bg-white rounded-full transform rotate-45"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <div className="absolute -top-3 -left-1 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute -top-3 -right-1 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute -bottom-1 -right-3 w-4 h-4 bg-white rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                <span className="inline-block transform transition-all hover:scale-105 duration-300">
                  Dog Resources
                </span>
              </h1>
              <p className="text-lg text-lavender-100 max-w-lg leading-relaxed">
                Find everything your canine companion needs for a happy, healthy
                life
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <button className="px-6 py-2 bg-white text-lavender-800 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Get Started
                </button>
                <button className="px-6 py-2 bg-transparent border-2 border-white/70 rounded-full font-medium hover:bg-white/10 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full p-4 flex items-center justify-center">
                <div className="text-8xl animate-bounce-slow">🐕</div>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-lavender-400 text-white p-3 rounded-full shadow-lg animate-pulse">
                <span className="text-xl">🦴</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for dog resources..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-lavender-200 focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent text-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-lavender-400" />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lavender-400 hover:text-lavender-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((category) => (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300">
                <div className="flex items-center p-4 border-b border-lavender-100">
                  <div className="bg-lavender-100 rounded-full p-3 mr-4">
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-lavender-900">
                    {category.name}
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-lavender-800 mb-2">
                      Common services:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {category.examples.map((example, index) => (
                        <span
                          key={index}
                          className="text-xs bg-lavender-50 text-lavender-700 px-2 py-0.5 rounded-full border border-lavender-200"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-lavender-600 text-white py-2 rounded-md text-sm font-medium hover:bg-lavender-700 transition-colors duration-300 mt-2">
                    View Resources
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-5xl mb-4">🐕</div>
            <h3 className="text-xl font-semibold text-lavender-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-4">Try adjusting your search term</p>
            <button
              onClick={() => setSearchTerm("")}
              className="bg-lavender-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-lavender-700"
            >
              Clear
            </button>
          </div>
        )}
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

export default DogResources;

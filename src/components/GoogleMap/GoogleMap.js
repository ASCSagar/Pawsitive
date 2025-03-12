import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useParams, useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "400px", // Increased height for better visibility
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

// Define the libraries to load
const libraries = ["places"];

// Define advanced keywords for each category based on detailed requirements
const categoryKeywords = {
  // NEW PET CATEGORIES - DOG RESOURCES
  dog_health: [
    "veterinarian for dogs",
    "emergency vet clinic",
    "dog groomer",
    "pet dental care",
    "flea tick prevention dogs",
    "heartworm prevention dogs",
    "pet insurance for dogs",
    "dog vaccination clinic",
    "canine healthcare",
    "dog wellness"
  ],
  
  dog_nutrition: [
    "pet food store",
    "dog food specialty",
    "online pet food retailer",
    "dog treats supplier",
    "raw dog food",
    "fresh dog food",
    "grain free dog food",
    "prescription dog food",
    "puppy food"
  ],
  
  dog_supplies: [
    "dog collar and leash",
    "dog harness",
    "dog carrier",
    "dog bed",
    "dog bowls",
    "dog toys",
    "poop bags",
    "dog grooming supplies",
    "dog crate",
    "dog kennels"
  ],
  
  dog_services: [
    "dog walker",
    "pet sitter",
    "professional dog groomer",
    "dog trainer",
    "dog behaviorist",
    "pet boarding facility",
    "dog kennels",
    "dog daycare",
    "dog park",
    "dog obedience school"
  ],
  
  dog_information: [
    "pet resources",
    "dog breed information",
    "animal shelter dogs",
    "dog rescue",
    "dog owner community",
    "veterinary helpline",
    "online vet consultation",
    "dog adoption center",
    "dog breeder",
    "canine behavior specialist"
  ],
  
  // CAT RESOURCES
  cat_health: [
    "veterinarian for cats",
    "emergency vet clinic cats",
    "cat groomer",
    "cat dental care",
    "flea tick prevention cats",
    "cat vaccination clinic",
    "cat healthcare",
    "feline wellness",
    "cat healthcare specialist",
    "pet insurance for cats"
  ],
  
  cat_nutrition: [
    "cat food store",
    "specialty cat food",
    "online cat food retailer",
    "cat treats",
    "wet cat food",
    "dry cat food",
    "raw cat food",
    "grain free cat food",
    "kitten food",
    "senior cat food"
  ],
  
  cat_supplies: [
    "cat collar",
    "cat harness",
    "cat carrier",
    "cat bed",
    "cat bowls",
    "cat toys",
    "scratching post",
    "litter box",
    "cat litter",
    "cat grooming supplies",
    "cat trees",
    "cat furniture"
  ],
  
  cat_services: [
    "cat sitter",
    "cat groomer",
    "cat behaviorist",
    "cat boarding facility",
    "cattery",
    "professional cat grooming",
    "mobile cat groomer",
    "cat daycare"
  ],
  
  cat_information: [
    "cat resources",
    "cat breed information",
    "animal shelter cats",
    "cat rescue",
    "cat owner community",
    "feline behavior specialist",
    "cat adoption center",
    "cat breeder",
    "online vet for cats"
  ]
};

const categoryTypes = {
  // NEW DOG RESOURCE TYPES
  dog_health: ["veterinary_care", "pet_store", "health"],
  dog_nutrition: ["pet_store", "store", "establishment"],
  dog_supplies: ["pet_store", "store", "establishment"],
  dog_services: ["pet_store", "establishment", "park"],
  dog_information: ["establishment", "library", "pet_store"],
  
  // CAT RESOURCE TYPES
  cat_health: ["veterinary_care", "pet_store", "health"],
  cat_nutrition: ["pet_store", "store", "establishment"],
  cat_supplies: ["pet_store", "store", "establishment"],
  cat_services: ["pet_store", "establishment"],
  cat_information: ["establishment", "library", "pet_store"]
};

// When no resources are found, use these mock resources for testing
const mockResources = {
  dog_health: [
    {
      id: "mock-dog-vet-1",
      name: "City Pet Hospital",
      address: "123 Main Street, Vadodara, Gujarat",
      lat: 22.3072,
      lng: 73.1812,
      phone: "+91 98765 43210",
      website: "https://example.com/citypethospital",
      status: "Open",
      hours: ["Monday-Friday: 9AM-7PM", "Saturday: 10AM-4PM", "Sunday: Closed"],
      photoUrl: "https://via.placeholder.com/400x300?text=City+Pet+Hospital",
      rating: 4.7,
      userRatingsTotal: 156,
      category: "dog_health",
      type: "Veterinarian"
    },
    {
      id: "mock-dog-vet-2",
      name: "Emergency Pet Clinic",
      address: "456 Hospital Road, Vadodara, Gujarat",
      lat: 22.3229,
      lng: 73.2124,
      phone: "+91 98765 12345",
      website: "https://example.com/emergencypetclinic",
      status: "Open 24 Hours",
      hours: ["Open 24 Hours"],
      photoUrl: "https://via.placeholder.com/400x300?text=Emergency+Pet+Clinic",
      rating: 4.5,
      userRatingsTotal: 98,
      category: "dog_health",
      type: "Emergency Clinic"
    }
  ],
  dog_nutrition: [
    {
      id: "mock-dog-food-1",
      name: "Premium Pet Foods",
      address: "789 Market Street, Vadodara, Gujarat",
      lat: 22.3126,
      lng: 73.1905,
      phone: "+91 98765 67890",
      website: "https://example.com/premiumpetfoods",
      status: "Open",
      hours: ["Monday-Saturday: 10AM-8PM", "Sunday: 11AM-5PM"],
      photoUrl: "https://via.placeholder.com/400x300?text=Premium+Pet+Foods",
      rating: 4.3,
      userRatingsTotal: 87,
      category: "dog_nutrition",
      type: "Pet Food Store"
    }
  ],
  dog_services: [
    {
      id: "mock-dog-walker-1",
      name: "Professional Dog Walking Service",
      address: "223 Walker Street, Vadodara, Gujarat",
      lat: 22.3158,
      lng: 73.1845,
      phone: "+91 98765 54321",
      website: "https://example.com/dogwalking",
      status: "Open",
      hours: ["Monday-Friday: 8AM-6PM", "Saturday: 9AM-4PM", "Sunday: Closed"],
      photoUrl: "https://via.placeholder.com/400x300?text=Dog+Walking+Service",
      rating: 4.6,
      userRatingsTotal: 75,
      category: "dog_services",
      type: "Dog Walker"
    },
    {
      id: "mock-dog-trainer-1",
      name: "Canine Training Academy",
      address: "450 Training Lane, Vadodara, Gujarat",
      lat: 22.3198,
      lng: 73.1965,
      phone: "+91 98765 87654",
      website: "https://example.com/dogtraining",
      status: "Open",
      hours: ["Monday-Saturday: 10AM-7PM", "Sunday: By appointment"],
      photoUrl: "https://via.placeholder.com/400x300?text=Canine+Training",
      rating: 4.8,
      userRatingsTotal: 112,
      category: "dog_services",
      type: "Dog Trainer"
    }
  ],
  cat_health: [
    {
      id: "mock-cat-vet-1",
      name: "Feline Wellness Center",
      address: "101 Cat Street, Vadodara, Gujarat",
      lat: 22.3189,
      lng: 73.1765,
      phone: "+91 98765 98765",
      website: "https://example.com/felinewellness",
      status: "Open",
      hours: ["Monday-Friday: 9AM-6PM", "Saturday: 10AM-3PM", "Sunday: Closed"],
      photoUrl: "https://via.placeholder.com/400x300?text=Feline+Wellness+Center",
      rating: 4.8,
      userRatingsTotal: 112,
      category: "cat_health",
      type: "Veterinarian"
    }
  ],
  cat_services: [
    {
      id: "mock-cat-sitter-1",
      name: "Professional Cat Sitting Services",
      address: "187 Feline Avenue, Vadodara, Gujarat",
      lat: 22.3175,
      lng: 73.1832,
      phone: "+91 98765 23456",
      website: "https://example.com/catsitting",
      status: "Open",
      hours: ["Monday-Sunday: 8AM-8PM"],
      photoUrl: "https://via.placeholder.com/400x300?text=Cat+Sitting+Services",
      rating: 4.7,
      userRatingsTotal: 89,
      category: "cat_services",
      type: "Cat Sitter"
    }
  ]
};

const Googlemap = React.forwardRef(({ onResourcesFetched = () => {}, center, viewMode = "map", directions = false, destination = null, onMapLoaded = () => {} }, ref) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [nearbyResources, setNearbyResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [resourcesError, setResourcesError] = useState(null);
  const [mapsError, setMapsError] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchedPlaces = useRef(new Set());
  
  // Get API key from environment variable or use a default key for testing
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE";
  
  // Log API key (but mask it for security)
  useEffect(() => {
    const maskedKey = googleMapsApiKey?.substring(0, 4) + "..." + googleMapsApiKey?.substring(googleMapsApiKey.length - 4);
    console.log("Using Google Maps API Key (masked):", maskedKey);
    if (!googleMapsApiKey || googleMapsApiKey === "YOUR_API_KEY_HERE") {
      console.warn("⚠️ No Google Maps API key found in environment variables. Map functionality will be limited.");
      setMapsError("API key missing or invalid");
    }
  }, [googleMapsApiKey]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries,
  });

  // Log Maps loading status
  useEffect(() => {
    console.log("Google Maps loading status:", isLoaded ? "Loaded" : "Loading...");
    if (loadError) {
      console.error("Google Maps load error:", loadError);
      setMapsError(loadError.message);
    }
  }, [isLoaded, loadError]);

  // Improved relevance score calculation with more accurate category matching
  const calculateRelevanceScore = (place, keyword) => {
    let score = 0;
    
    // Name matching - more weight for exact matches
    const placeName = place.name.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    
    if (placeName === keywordLower) {
      score += 30; // Exact match gets highest score
    } else if (placeName.includes(keywordLower)) {
      score += 15; // Partial match
    }
    
    // Check if the place name contains specific service terms that match the category
    if (category === 'dog_services' && 
        (placeName.includes('walker') || 
         placeName.includes('walking') || 
         placeName.includes('daycare') || 
         placeName.includes('boarding') ||
         placeName.includes('trainer') ||
         placeName.includes('training'))) {
      score += 20;
    }
    
    if (category === 'cat_services' && 
        (placeName.includes('sitter') || 
         placeName.includes('sitting') || 
         placeName.includes('boarding') ||
         placeName.includes('groomer') ||
         placeName.includes('grooming'))) {
      score += 20;
    }
    
    // Check for health-related keywords
    if (category?.includes('_health') && 
        (placeName.includes('vet') || 
         placeName.includes('clinic') || 
         placeName.includes('hospital') ||
         placeName.includes('doctor') ||
         placeName.includes('emergency'))) {
      score += 20;
    }
    
    // Rating score
    if (place.rating) {
      score += place.rating * 2;
    }
    
    // User ratings total - more ratings means more confidence
    if (place.user_ratings_total) {
      score += Math.min(place.user_ratings_total / 50, 10); // Increased weight for popular places
    }
    
    return score;
  };

  const fetchPlaceDetails = async (service, place) => {
    return new Promise((resolve) => {
      const detailsRequest = {
        placeId: place.place_id,
        fields: [
          "name",
          "vicinity",
          "geometry",
          "formatted_phone_number",
          "business_status",
          "opening_hours",
          "photos",
          "types",
          "rating",
          "user_ratings_total",
          "website",
          "formatted_address",
          "international_phone_number"
        ],
      };

      service.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
        if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
          const photoUrl = placeDetails.photos?.[0]?.getUrl({
            maxHeight: 300,
            maxWidth: 400,
          });

          // Determine the resource type based on place types and name
          let resourceType = "Establishment";
          const name = placeDetails.name.toLowerCase();
          const types = placeDetails.types || [];
          
          // Categorize health resources
          if (types.includes("veterinary_care") || 
              name.includes("vet") || 
              name.includes("clinic") || 
              name.includes("hospital")) {
            resourceType = "Veterinarian";
          } 
          // Categorize dog services
          else if (category === "dog_services") {
            if (name.includes("walk") || name.includes("walker")) {
              resourceType = "Dog Walker";
            } else if (name.includes("train") || name.includes("obedience")) {
              resourceType = "Dog Trainer";
            } else if (name.includes("daycare") || name.includes("boarding")) {
              resourceType = "Pet Boarding";
            } else if (name.includes("groom")) {
              resourceType = "Pet Groomer";
            } else if (types.includes("park") || name.includes("park")) {
              resourceType = "Dog Park";
            }
          }
          // Categorize cat services
          else if (category === "cat_services") {
            if (name.includes("sit") || name.includes("sitter")) {
              resourceType = "Cat Sitter";
            } else if (name.includes("groom")) {
              resourceType = "Cat Groomer";
            } else if (name.includes("board") || name.includes("hotel")) {
              resourceType = "Cat Boarding";
            }
          }
          // Categorize nutrition and food
          else if (category?.includes("_nutrition")) {
            resourceType = "Pet Food Store";
          }
          // Categorize supplies
          else if (category?.includes("_supplies")) {
            resourceType = "Pet Supplies";
          }

          const formattedResource = {
            id: place.place_id,
            name: placeDetails.name,
            address: placeDetails.formatted_address || placeDetails.vicinity,
            lat: placeDetails.geometry.location.lat(),
            lng: placeDetails.geometry.location.lng(),
            phone: placeDetails.international_phone_number || placeDetails.formatted_phone_number || "N/A",
            website: placeDetails.website || "N/A",
            status: placeDetails.business_status === "OPERATIONAL" ? "Open" : "Closed",
            hours: placeDetails.opening_hours?.weekday_text || "N/A",
            photoUrl,
            types: placeDetails.types || [],
            rating: placeDetails.rating || 0,
            userRatingsTotal: placeDetails.user_ratings_total || 0,
            category: category, // Make sure to include the category
            type: resourceType // Add the determined resource type
          };

          resolve(formattedResource);
        } else {
          console.warn("Place details fetch failed:", detailsStatus);
          resolve(null);
        }
      });
    });
  };

  const performSearch = async (service, location, keyword) => {
    return new Promise((resolve) => {
      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: 10000, // Using radius instead of rankBy
        keyword: keyword,
        type: categoryTypes[category?.toLowerCase()]?.[0] || "establishment" // Use first type as primary
      };

      console.log(`Searching for: ${keyword} with type: ${categoryTypes[category?.toLowerCase()]?.[0] || "establishment"}`);
      
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          console.log(`Found ${results.length} results for keyword "${keyword}"`);
          resolve(results);
        } else {
          console.warn(`Search failed for keyword ${keyword}:`, status);
          resolve([]);
        }
      });
    });
  };

  // New function to filter results based on user's search query
  const filterBySearchQuery = (resources, query) => {
    if (!query || query.trim() === "") {
      return resources;
    }
    
    const queryTerms = query.toLowerCase().trim().split(/\s+/);
    
    return resources.filter(resource => {
      const name = resource.name.toLowerCase();
      const type = resource.type.toLowerCase();
      
      // Check if any query term is in the name or type
      return queryTerms.some(term => 
        name.includes(term) || type.includes(term)
      );
    });
  };

  const fetchNearbyPlaces = useCallback(async (location, keywords) => {
    setLoadingResources(true);
    setResourcesError(null);

    // Check if Google Maps is loaded
    if (!window.google || !window.google.maps) {
      console.error("Google Maps not loaded");
      setResourcesError("Google Maps failed to load. Please refresh the page and try again.");
      setLoadingResources(false);
      
      // Use mock data as fallback
      const mockData = mockResources[category?.toLowerCase()] || [];
      onResourcesFetched(mockData);
      setNearbyResources(mockData);
      return;
    }

    console.log("Fetching nearby places for category:", category);
    console.log("Using keywords:", keywords);

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const allResults = new Map();
    searchedPlaces.current.clear();

    try {
      // If we have a specific search query, add it to the beginning of the keywords list
      if (searchQuery && searchQuery.trim() !== "") {
        keywords = [searchQuery, ...keywords];
      }
      
      for (const keyword of keywords) {
        const results = await performSearch(service, location, keyword);
        
        for (const place of results) {
          if (!searchedPlaces.current.has(place.place_id)) {
            searchedPlaces.current.add(place.place_id);
            
            const relevanceScore = calculateRelevanceScore(place, keyword);

            if (!allResults.has(place.place_id) || 
                allResults.get(place.place_id).relevanceScore < relevanceScore) {
              allResults.set(place.place_id, {
                place,
                relevanceScore,
                keyword // Store the keyword that found this place
              });
            }
          }
        }
      }

      // Sort and limit results
      const sortedResults = Array.from(allResults.values())
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 20);

      console.log(`Found ${sortedResults.length} unique places after processing`);

      // Fetch details for top results
      const detailedResources = await Promise.all(
        sortedResults.map(({ place }) => fetchPlaceDetails(service, place))
      );

      const validResources = detailedResources.filter(resource => resource !== null);
      console.log(`Got details for ${validResources.length} resources`);
      
      if (validResources.length === 0) {
        console.log("No resources found, using mock data for this category");
        const mockData = mockResources[category?.toLowerCase()] || [];
        
        // If we have a specific search query, filter the mock data too
        const filteredMockData = searchQuery && searchQuery.trim() !== "" 
          ? filterBySearchQuery(mockData, searchQuery)
          : mockData;
          
        onResourcesFetched(filteredMockData);
        setNearbyResources(filteredMockData);
      } else {
        // Apply search query filter if needed
        const filteredResources = searchQuery && searchQuery.trim() !== ""
          ? filterBySearchQuery(validResources, searchQuery)
          : validResources;
          
        onResourcesFetched(filteredResources);
        setNearbyResources(filteredResources);
      }
      
    } catch (error) {
      console.error("Error in fetchNearbyPlaces:", error);
      setResourcesError("Failed to fetch resources. " + error.message);
      
      // Use mock data as fallback
      const mockData = mockResources[category?.toLowerCase()] || [];
      
      // Filter mock data if we have a search query
      const filteredMockData = searchQuery && searchQuery.trim() !== "" 
        ? filterBySearchQuery(mockData, searchQuery)
        : mockData;
        
      onResourcesFetched(filteredMockData);
      setNearbyResources(filteredMockData);
    } finally {
      setLoadingResources(false);
    }
  }, [category, onResourcesFetched, searchQuery]);

  const requestLocation = useCallback(() => {
    console.log("Requesting user location...");
    setLocationRequested(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got user location:", position.coords);
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          
          // Get keywords for this category
          const keywords = categoryKeywords[category?.toLowerCase()] || ["pet store"];
          fetchNearbyPlaces(userPos, keywords);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setResourcesError(`Location permission denied: ${error.message}. Using default location.`);
          setUserLocation(defaultCenter);
          
          // Get keywords for this category
          const keywords = categoryKeywords[category?.toLowerCase()] || ["pet store"];
          fetchNearbyPlaces(defaultCenter, keywords);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.warn("Geolocation not supported by this browser");
      setResourcesError("Geolocation is not supported by your browser. Using default location.");
      setUserLocation(defaultCenter);
      
      // Get keywords for this category
      const keywords = categoryKeywords[category?.toLowerCase()] || ["pet store"];
      fetchNearbyPlaces(defaultCenter, keywords);
    }
  }, [category, fetchNearbyPlaces]);

  // Handler for search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (userLocation) {
      const keywords = categoryKeywords[category?.toLowerCase()] || ["pet store"];
      fetchNearbyPlaces(userLocation, keywords);
    }
  };

  useEffect(() => {
    if (isLoaded && !locationRequested && category) {
      requestLocation();
    }
  }, [isLoaded, locationRequested, category, requestLocation]);

  // Determine icon based on category
  const getMarkerIcon = (category) => {
    if (category?.startsWith('dog_')) {
      return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    } else if (category?.startsWith('cat_')) {
      return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    } else {
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    }
  };

  // Get color theme based on category
  const getThemeColor = () => {
    if (category?.startsWith('dog_')) {
      return 'blue';
    } else if (category?.startsWith('cat_')) {
      return 'amber';
    } else {
      return 'lavender';
    }
  };

  const themeColor = getThemeColor();

  if (loadError || mapsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
        <p className="text-red-700 font-medium">Error loading Google Maps</p>
        <p className="text-red-600 text-sm mt-1">{loadError?.message || mapsError}</p>
        <div className="mt-4">
          <button 
            onClick={() => window.location.reload()} 
            className={`bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white px-4 py-2 rounded-md transition-colors`}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-${themeColor}-600 mb-4`}></div>
        <p className={`text-${themeColor}-700`}>Loading Maps...</p>
      </div>
    );
  }

  if (loadingResources) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-${themeColor}-600 mb-4`}></div>
        <p className={`text-${themeColor}-700`}>Searching for pet resources near you...</p>
      </div>
    );
  }

  return (
    <div>
      {resourcesError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-yellow-700 text-sm">{resourcesError}</p>
        </div>
      )}
      
      {/* Search bar */}
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={`Search for ${category?.replace('_', ' ')} resources...`}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className={`bg-${themeColor}-600 text-white px-4 py-2 rounded-r-md hover:bg-${themeColor}-700 transition-colors`}
          >
            Search
          </button>
        </form>
      </div>
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || center || defaultCenter}
        zoom={13}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            title="Your Location"
          />
        )}
        
        {nearbyResources.map((resource) => (
          <Marker
            key={resource.id}
            position={{ lat: resource.lat, lng: resource.lng }}
            onClick={() => setSelectedMarker(resource)}
            icon={getMarkerIcon(category)}
            title={resource.name}
          />
        ))}
        
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="max-w-xs">
              <h3 className="text-lg font-bold mb-1">{selectedMarker.name}</h3>
              {selectedMarker.type && (
                <p className="text-sm text-gray-600 mb-2">{selectedMarker.type}</p>
              )}
              <p className="text-sm mb-2">{selectedMarker.address}</p>
              
              {selectedMarker.photoUrl && selectedMarker.photoUrl !== "N/A" && (
                <img 
                  src={selectedMarker.photoUrl} 
                  alt={selectedMarker.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              
              <div className="text-sm">
                <p><strong>Phone:</strong> {selectedMarker.phone}</p>
                <p><strong>Status:</strong> {selectedMarker.status}</p>
                
                {selectedMarker.website && selectedMarker.website !== "N/A" && (
                  <p>
                    <strong>Website:</strong>{' '}
                    <a 
                      href={selectedMarker.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </p>
                )}
                
                {selectedMarker.rating > 0 && (
                  <p><strong>Rating:</strong> {selectedMarker.rating} ({selectedMarker.userRatingsTotal} reviews)</p>
                )}
              </div>
              
              <div className="mt-3">
                <button 
                  onClick={() => navigate(`/resource-details/${selectedMarker.id}`)}
                  className={`bg-${themeColor}-600 text-white px-3 py-1 rounded-md text-sm hover:bg-${themeColor}-700 transition-colors`}
                >
                  View Details
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      <div className="mt-4 text-center">
        <p className={`text-sm text-${themeColor}-700`}>
          {nearbyResources.length > 0 
            ? `Showing ${nearbyResources.length} ${category?.replace('_', ' ')} resources near you` 
            : `No ${category?.replace('_', ' ')} resources found near you`}
        </p>
        
        {!locationRequested && (
          <button
            onClick={requestLocation}
            className={`mt-2 bg-${themeColor}-600 text-white px-4 py-2 rounded-md hover:bg-${themeColor}-700 transition-colors`}
          >
            Find resources near me
          </button>
        )}
      </div>
    </div>
  );
});

export default Googlemap;
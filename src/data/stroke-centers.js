// Stroke centers in Baden-Württemberg, Germany
// Data includes comprehensive stroke centers and stroke units

export const strokeCenters = [
  {
    id: 'uniklinik-freiburg',
    name: 'Universitätsklinikum Freiburg',
    type: 'comprehensive', // comprehensive, primary, telemedicine
    address: 'Hugstetter Str. 55, 79106 Freiburg im Breisgau',
    coordinates: {
      lat: 48.0025,
      lng: 7.8347
    },
    phone: '+49 761 270-0',
    emergency: '+49 761 270-34010',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'uniklinik-heidelberg',
    name: 'Universitätsklinikum Heidelberg',
    type: 'comprehensive',
    address: 'Im Neuenheimer Feld 400, 69120 Heidelberg',
    coordinates: {
      lat: 49.4178,
      lng: 8.6706
    },
    phone: '+49 6221 56-0',
    emergency: '+49 6221 56-36643',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'uniklinik-tuebingen',
    name: 'Universitätsklinikum Tübingen',
    type: 'comprehensive',
    address: 'Geissweg 3, 72076 Tübingen',
    coordinates: {
      lat: 48.5378,
      lng: 9.0538
    },
    phone: '+49 7071 29-0',
    emergency: '+49 7071 29-82211',
    services: ['thrombectory', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'uniklinik-ulm',
    name: 'Universitätsklinikum Ulm',
    type: 'comprehensive',
    address: 'Albert-Einstein-Allee 23, 89081 Ulm',
    coordinates: {
      lat: 48.4196,
      lng: 9.9592
    },
    phone: '+49 731 500-0',
    emergency: '+49 731 500-63001',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'klinikum-stuttgart',
    name: 'Klinikum Stuttgart - Katharinenhospital',
    type: 'comprehensive',
    address: 'Kriegsbergstraße 60, 70174 Stuttgart',
    coordinates: {
      lat: 48.7784,
      lng: 9.1682
    },
    phone: '+49 711 278-0',
    emergency: '+49 711 278-32001',
    services: ['thrombectomy', 'neurosurgery', 'icu'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'robert-bosch-stuttgart',
    name: 'Robert-Bosch-Krankenhaus Stuttgart',
    type: 'primary',
    address: 'Auerbachstraße 110, 70376 Stuttgart',
    coordinates: {
      lat: 48.7447,
      lng: 9.2294
    },
    phone: '+49 711 8101-0',
    emergency: '+49 711 8101-3456',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'diakonie-stuttgart',
    name: 'Diakonie-Klinikum Stuttgart',
    type: 'primary',
    address: 'Rosenbergstraße 38, 70176 Stuttgart',
    coordinates: {
      lat: 48.7861,
      lng: 9.1736
    },
    phone: '+49 711 991-0',
    emergency: '+49 711 991-2201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'rkh-ludwigsburg',
    name: 'RKH Klinikum Ludwigsburg',
    type: 'primary',
    address: 'Posilipostraße 4, 71640 Ludwigsburg',
    coordinates: {
      lat: 48.8901,
      lng: 9.1953
    },
    phone: '+49 7141 99-0',
    emergency: '+49 7141 99-67201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'klinikum-karlsruhe',
    name: 'Städtisches Klinikum Karlsruhe',
    type: 'comprehensive',
    address: 'Moltkestraße 90, 76133 Karlsruhe',
    coordinates: {
      lat: 49.0047,
      lng: 8.3858
    },
    phone: '+49 721 974-0',
    emergency: '+49 721 974-2301',
    services: ['thrombectomy', 'neurosurgery', 'icu'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'vincentius-karlsruhe',
    name: 'ViDia Kliniken Karlsruhe - St. Vincentius',
    type: 'primary',
    address: 'Südendstraße 32, 76135 Karlsruhe',
    coordinates: {
      lat: 48.9903,
      lng: 8.3711
    },
    phone: '+49 721 8108-0',
    emergency: '+49 721 8108-9201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'klinikum-mannheim',
    name: 'Universitätsmedizin Mannheim',
    type: 'comprehensive',
    address: 'Theodor-Kutzer-Ufer 1-3, 68167 Mannheim',
    coordinates: {
      lat: 49.4828,
      lng: 8.4664
    },
    phone: '+49 621 383-0',
    emergency: '+49 621 383-2251',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'theresienkrankenhaus-mannheim',
    name: 'Theresienkrankenhaus Mannheim',
    type: 'primary',
    address: 'Bassermannstraße 1, 68165 Mannheim',
    coordinates: {
      lat: 49.4904,
      lng: 8.4594
    },
    phone: '+49 621 424-0',
    emergency: '+49 621 424-2101',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'klinikum-pforzheim',
    name: 'Helios Klinikum Pforzheim',
    type: 'primary',
    address: 'Kanzlerstraße 2-6, 75175 Pforzheim',
    coordinates: {
      lat: 48.8833,
      lng: 8.6936
    },
    phone: '+49 7231 969-0',
    emergency: '+49 7231 969-2301',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'zollernalb-klinikum',
    name: 'Zollernalb Klinikum Albstadt',
    type: 'primary',
    address: 'Zollernring 10-14, 72488 Sigmaringen',
    coordinates: {
      lat: 48.0878,
      lng: 9.2233
    },
    phone: '+49 7571 100-0',
    emergency: '+49 7571 100-1501',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'klinikum-konstanz',
    name: 'Gesundheitsverbund Landkreis Konstanz',
    type: 'primary',
    address: 'Mainaustraße 14, 78464 Konstanz',
    coordinates: {
      lat: 47.6779,
      lng: 9.1732
    },
    phone: '+49 7531 801-0',
    emergency: '+49 7531 801-2301',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'klinikum-friedrichshafen',
    name: 'Klinikum Friedrichshafen',
    type: 'primary',
    address: 'Röntgenstraße 2, 88048 Friedrichshafen',
    coordinates: {
      lat: 47.6587,
      lng: 9.4685
    },
    phone: '+49 7541 96-0',
    emergency: '+49 7541 96-2401',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'oberschwabenklinik-ravensburg',
    name: 'Oberschwabenklinik Ravensburg',
    type: 'primary',
    address: 'Elisabethenstraße 17, 88212 Ravensburg',
    coordinates: {
      lat: 47.7815,
      lng: 9.6078
    },
    phone: '+49 751 87-0',
    emergency: '+49 751 87-2201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'alb-donau-klinikum',
    name: 'Alb Donau Klinikum Ehingen',
    type: 'primary',
    address: 'Schwörhausgasse 7, 89584 Ehingen',
    coordinates: {
      lat: 48.2833,
      lng: 9.7262
    },
    phone: '+49 7391 789-0',
    emergency: '+49 7391 789-1801',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'ortenau-klinikum-offenburg',
    name: 'Ortenau Klinikum Offenburg',
    type: 'primary',
    address: 'Ebertplatz 12, 77654 Offenburg',
    coordinates: {
      lat: 48.4706,
      lng: 7.9444
    },
    phone: '+49 781 472-0',
    emergency: '+49 781 472-2001',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'klinikum-baden-baden',
    name: 'Klinikum Mittelbaden Baden-Baden',
    type: 'primary',
    address: 'Balger Str. 50, 76532 Baden-Baden',
    coordinates: {
      lat: 48.7606,
      lng: 8.2275
    },
    phone: '+49 7221 91-0',
    emergency: '+49 7221 91-1701',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-01-01'
  }
];

// Helper functions for stroke center data
export function getStrokeCentersByType(type) {
  return strokeCenters.filter(center => center.type === type);
}

export function getComprehensiveStrokeCenters() {
  return getStrokeCentersByType('comprehensive');
}

export function getPrimaryStrokeCenters() {
  return getStrokeCentersByType('primary');
}

export function getStrokeCenterById(id) {
  return strokeCenters.find(center => center.id === id);
}

// Calculate distance between two coordinates using Haversine formula (fallback)
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Calculate travel time using OpenRoute Service API
export async function calculateTravelTime(fromLat, fromLng, toLat, toLng, profile = 'driving-car') {
  try {
    // Using OpenRoute Service (free tier)
    const url = `https://api.openrouteservice.org/v2/directions/${profile}`;
    const body = {
      coordinates: [[fromLng, fromLat], [toLng, toLat]],
      radiuses: [1000, 1000], // Allow 1km radius for routing
      format: 'json'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': '5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688', // Free tier key
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Routing API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        duration: Math.round(route.summary.duration / 60), // Convert to minutes
        distance: Math.round(route.summary.distance / 1000), // Convert to km
        source: 'routing'
      };
    } else {
      throw new Error('No route found');
    }
  } catch (error) {
    console.warn('Travel time calculation failed, using distance estimate:', error);
    
    // Fallback to distance-based time estimation
    const distance = calculateDistance(fromLat, fromLng, toLat, toLng);
    const estimatedTime = Math.round(distance / 0.8); // Assume 48 km/h average (urban + highway)
    
    return {
      duration: estimatedTime,
      distance: Math.round(distance),
      source: 'estimated'
    };
  }
}

// Enhanced travel time calculation for emergency vehicles
export async function calculateEmergencyTravelTime(fromLat, fromLng, toLat, toLng) {
  try {
    // For emergency vehicles, we can use a faster profile and adjust
    const result = await calculateTravelTime(fromLat, fromLng, toLat, toLng, 'driving-car');
    
    // Reduce time by 25% for emergency vehicle (sirens, priority routing)
    const emergencyDuration = Math.round(result.duration * 0.75);
    
    return {
      duration: emergencyDuration,
      distance: result.distance,
      source: result.source === 'routing' ? 'emergency-routing' : 'emergency-estimated'
    };
  } catch (error) {
    // Fallback calculation
    const distance = calculateDistance(fromLat, fromLng, toLat, toLng);
    const emergencyTime = Math.round(distance / 1.2); // Assume 72 km/h for emergency vehicles
    
    return {
      duration: emergencyTime,
      distance: Math.round(distance), 
      source: 'emergency-estimated'
    };
  }
}

// Find nearest stroke centers with travel time calculation
export async function findNearestStrokeCentersWithTravelTime(lat, lng, maxResults = 5, maxTime = 120, useEmergencyRouting = true) {
  console.log('Calculating travel times to stroke centers...');
  
  const centersWithTravelTime = await Promise.all(
    strokeCenters.map(async (center) => {
      try {
        const travelInfo = useEmergencyRouting 
          ? await calculateEmergencyTravelTime(lat, lng, center.coordinates.lat, center.coordinates.lng)
          : await calculateTravelTime(lat, lng, center.coordinates.lat, center.coordinates.lng);
        
        return {
          ...center,
          travelTime: travelInfo.duration,
          distance: travelInfo.distance,
          travelSource: travelInfo.source
        };
      } catch (error) {
        console.warn(`Failed to calculate travel time to ${center.name}:`, error);
        // Fallback to distance calculation
        const distance = calculateDistance(lat, lng, center.coordinates.lat, center.coordinates.lng);
        return {
          ...center,
          travelTime: Math.round(distance / 0.8), // Estimate: 48 km/h average
          distance: Math.round(distance),
          travelSource: 'fallback'
        };
      }
    })
  );

  return centersWithTravelTime
    .filter(center => center.travelTime <= maxTime)
    .sort((a, b) => a.travelTime - b.travelTime)
    .slice(0, maxResults);
}

// Find nearest stroke centers using distance (fallback/fast method)
export function findNearestStrokeCenters(lat, lng, maxResults = 5, maxDistance = 100) {
  const centersWithDistance = strokeCenters.map(center => ({
    ...center,
    distance: calculateDistance(lat, lng, center.coordinates.lat, center.coordinates.lng)
  }));

  return centersWithDistance
    .filter(center => center.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults);
}

// Get stroke center recommendations with travel time (async)
export async function getRecommendedStrokeCentersWithTravelTime(lat, lng, conditionType = 'stroke') {
  const nearestCenters = await findNearestStrokeCentersWithTravelTime(lat, lng, 10, 120, true);
  
  if (conditionType === 'lvo' || conditionType === 'thrombectomy') {
    // For LVO cases, prioritize comprehensive stroke centers within 60 minutes
    const comprehensive = nearestCenters.filter(center => 
      center.type === 'comprehensive' && 
      center.services.includes('thrombectomy') &&
      center.travelTime <= 60
    );
    
    const primary = nearestCenters.filter(center => center.type === 'primary');
    
    return {
      recommended: comprehensive.slice(0, 3),
      alternative: primary.slice(0, 2)
    };
  }
  
  // For ICH cases, prioritize neurosurgical capabilities
  if (conditionType === 'ich') {
    const neurosurgical = nearestCenters.filter(center =>
      center.services.includes('neurosurgery') &&
      center.travelTime <= 45
    );
    
    return {
      recommended: neurosurgical.slice(0, 3),
      alternative: nearestCenters.filter(c => !neurosurgical.includes(c)).slice(0, 2)
    };
  }
  
  // For general stroke cases, return nearest centers regardless of type
  return {
    recommended: nearestCenters.slice(0, 5),
    alternative: []
  };
}

// Get stroke center recommendations based on patient condition (fallback - distance only)
export function getRecommendedStrokeCenters(lat, lng, conditionType = 'stroke') {
  const nearestCenters = findNearestStrokeCenters(lat, lng, 10);
  
  if (conditionType === 'lvo' || conditionType === 'thrombectomy') {
    // For LVO cases, prioritize comprehensive stroke centers
    const comprehensive = nearestCenters.filter(center => 
      center.type === 'comprehensive' && 
      center.services.includes('thrombectomy')
    );
    
    const primary = nearestCenters.filter(center => center.type === 'primary');
    
    return {
      recommended: comprehensive.slice(0, 3),
      alternative: primary.slice(0, 2)
    };
  }
  
  // For general stroke cases, return nearest centers regardless of type
  return {
    recommended: nearestCenters.slice(0, 5),
    alternative: []
  };
}
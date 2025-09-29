// Stroke centers in Bayern (Bavaria), Germany
// Data includes comprehensive stroke centers and stroke units with neurosurgical capabilities

export const strokeCenters = [
  // Major comprehensive stroke centers in München
  {
    id: 'klinikum-grosshadern-muenchen',
    name: 'LMU Klinikum München - Großhadern',
    type: 'comprehensive',
    address: 'Marchioninistraße 15, 81377 München',
    coordinates: {
      lat: 48.1106,
      lng: 11.4684,
    },
    phone: '+49 89 4400-0',
    emergency: '+49 89 4400-73331',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-rechts-der-isar-muenchen',
    name: 'Klinikum rechts der Isar München (TUM)',
    type: 'comprehensive',
    address: 'Ismaninger Str. 22, 81675 München',
    coordinates: {
      lat: 48.1497,
      lng: 11.6052,
    },
    phone: '+49 89 4140-0',
    emergency: '+49 89 4140-2249',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-schwabing-muenchen',
    name: 'Städtisches Klinikum München Schwabing',
    type: 'comprehensive',
    address: 'Kölner Platz 1, 80804 München',
    coordinates: {
      lat: 48.1732,
      lng: 11.5755,
    },
    phone: '+49 89 3068-0',
    emergency: '+49 89 3068-2050',
    services: ['thrombectomy', 'neurosurgery', 'icu'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-bogenhausen-muenchen',
    name: 'Städtisches Klinikum München Bogenhausen',
    type: 'comprehensive',
    address: 'Englschalkinger Str. 77, 81925 München',
    coordinates: {
      lat: 48.1614,
      lng: 11.6254,
    },
    phone: '+49 89 9270-0',
    emergency: '+49 89 9270-2050',
    services: ['thrombectomy', 'neurosurgery', 'icu'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-08-01',
  },

  // Major centers in other Bayern cities
  {
    id: 'uniklinikum-erlangen',
    name: 'Universitätsklinikum Erlangen',
    type: 'comprehensive',
    address: 'Maximiliansplatz 2, 91054 Erlangen',
    coordinates: {
      lat: 49.5982,
      lng: 11.0037,
    },
    phone: '+49 9131 85-0',
    emergency: '+49 9131 85-39003',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'uniklinikum-regensburg',
    name: 'Universitätsklinikum Regensburg',
    type: 'comprehensive',
    address: 'Franz-Josef-Strauß-Allee 11, 93053 Regensburg',
    coordinates: {
      lat: 49.0134,
      lng: 12.0991,
    },
    phone: '+49 941 944-0',
    emergency: '+49 941 944-7501',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'uniklinikum-wuerzburg',
    name: 'Universitätsklinikum Würzburg',
    type: 'comprehensive',
    address: 'Oberdürrbacher Str. 6, 97080 Würzburg',
    coordinates: {
      lat: 49.7840,
      lng: 9.9721,
    },
    phone: '+49 931 201-0',
    emergency: '+49 931 201-24444',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-nuernberg',
    name: 'Klinikum Nürnberg Nord',
    type: 'comprehensive',
    address: 'Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg',
    coordinates: {
      lat: 49.4521,
      lng: 11.0767,
    },
    phone: '+49 911 398-0',
    emergency: '+49 911 398-2369',
    services: ['thrombectomy', 'neurosurgery', 'icu'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-augsburg',
    name: 'Universitätsklinikum Augsburg',
    type: 'comprehensive',
    address: 'Stenglinstr. 2, 86156 Augsburg',
    coordinates: {
      lat: 48.3668,
      lng: 10.9093,
    },
    phone: '+49 821 400-01',
    emergency: '+49 821 400-2356',
    services: ['thrombectomy', 'neurosurgery', 'icu', 'telemedicine'],
    certified: true,
    certification: 'DSG/DGN',
    lastUpdated: '2024-08-01',
  },

  // Primary stroke centers
  {
    id: 'klinikum-ingolstadt',
    name: 'Klinikum Ingolstadt',
    type: 'primary',
    address: 'Krumenauerstraße 25, 85049 Ingolstadt',
    coordinates: {
      lat: 48.7665,
      lng: 11.4364,
    },
    phone: '+49 841 880-0',
    emergency: '+49 841 880-2201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-passau',
    name: 'Klinikum Passau',
    type: 'primary',
    address: 'Bischof-Pilgrim-Str. 1, 94032 Passau',
    coordinates: {
      lat: 48.5665,
      lng: 13.4513,
    },
    phone: '+49 851 5300-0',
    emergency: '+49 851 5300-2100',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-bamberg',
    name: 'Sozialstiftung Bamberg Klinikum',
    type: 'primary',
    address: 'Buger Str. 80, 96049 Bamberg',
    coordinates: {
      lat: 49.8988,
      lng: 10.9027,
    },
    phone: '+49 951 503-0',
    emergency: '+49 951 503-11101',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-bayreuth',
    name: 'Klinikum Bayreuth',
    type: 'primary',
    address: 'Preuschwitzer Str. 101, 95445 Bayreuth',
    coordinates: {
      lat: 49.9459,
      lng: 11.5779,
    },
    phone: '+49 921 400-0',
    emergency: '+49 921 400-5401',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-landshut',
    name: 'Klinikum Landshut',
    type: 'primary',
    address: 'Robert-Koch-Str. 1, 84034 Landshut',
    coordinates: {
      lat: 48.5436,
      lng: 12.1619,
    },
    phone: '+49 871 698-0',
    emergency: '+49 871 698-3333',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-rosenheim',
    name: 'RoMed Klinikum Rosenheim',
    type: 'primary',
    address: 'Pettenkoferstr. 10, 83022 Rosenheim',
    coordinates: {
      lat: 47.8567,
      lng: 12.1265,
    },
    phone: '+49 8031 365-0',
    emergency: '+49 8031 365-3711',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-memmingen',
    name: 'Klinikum Memmingen',
    type: 'primary',
    address: 'Bismarckstr. 23, 87700 Memmingen',
    coordinates: {
      lat: 47.9833,
      lng: 10.1833,
    },
    phone: '+49 8331 70-0',
    emergency: '+49 8331 70-2500',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-kempten',
    name: 'Klinikum Kempten-Oberallgäu',
    type: 'primary',
    address: 'Robert-Weixler-Str. 50, 87439 Kempten',
    coordinates: {
      lat: 47.7261,
      lng: 10.3097,
    },
    phone: '+49 831 530-0',
    emergency: '+49 831 530-2201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-coburg',
    name: 'Klinikum Coburg',
    type: 'primary',
    address: 'Ketschendorfer Str. 33, 96450 Coburg',
    coordinates: {
      lat: 50.2596,
      lng: 10.9685,
    },
    phone: '+49 9561 22-0',
    emergency: '+49 9561 22-6300',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-aschaffenburg',
    name: 'Klinikum Aschaffenburg-Alzenau',
    type: 'primary',
    address: 'Am Hasenkopf 1, 63739 Aschaffenburg',
    coordinates: {
      lat: 49.9747,
      lng: 9.1581,
    },
    phone: '+49 6021 32-0',
    emergency: '+49 6021 32-2700',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },

  // Additional smaller stroke units in Bayern
  {
    id: 'goldberg-klinik-kelheim',
    name: 'Goldberg-Klinik Kelheim',
    type: 'primary',
    address: 'Traubenweg 3, 93309 Kelheim',
    coordinates: {
      lat: 48.9166,
      lng: 11.8742,
    },
    phone: '+49 9441 702-0',
    emergency: '+49 9441 702-6800',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-deggendorf',
    name: 'DONAUISAR Klinikum Deggendorf',
    type: 'primary',
    address: 'Perlasberger Str. 41, 94469 Deggendorf',
    coordinates: {
      lat: 48.8372,
      lng: 12.9619,
    },
    phone: '+49 991 380-0',
    emergency: '+49 991 380-2201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-straubing',
    name: 'Klinikum St. Elisabeth Straubing',
    type: 'primary',
    address: 'St.-Elisabeth-Str. 23, 94315 Straubing',
    coordinates: {
      lat: 48.8742,
      lng: 12.5733,
    },
    phone: '+49 9421 710-0',
    emergency: '+49 9421 710-2000',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-freising',
    name: 'Klinikum Freising',
    type: 'primary',
    address: 'Mainburger Str. 29, 85356 Freising',
    coordinates: {
      lat: 48.4142,
      lng: 11.7461,
    },
    phone: '+49 8161 24-0',
    emergency: '+49 8161 24-2800',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-erding',
    name: 'Klinikum Landkreis Erding',
    type: 'primary',
    address: 'Bajuwarenstr. 5, 85435 Erding',
    coordinates: {
      lat: 48.3061,
      lng: 11.9067,
    },
    phone: '+49 8122 59-0',
    emergency: '+49 8122 59-2201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'helios-dachau',
    name: 'Helios Amper-Klinikum Dachau',
    type: 'primary',
    address: 'Krankenhausstr. 15, 85221 Dachau',
    coordinates: {
      lat: 48.2599,
      lng: 11.4342,
    },
    phone: '+49 8131 76-0',
    emergency: '+49 8131 76-2201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
  {
    id: 'klinikum-fuerstenfeldbruck',
    name: 'Klinikum Fürstenfeldbruck',
    type: 'primary',
    address: 'Dachauer Str. 33, 82256 Fürstenfeldbruck',
    coordinates: {
      lat: 48.1772,
      lng: 11.2578,
    },
    phone: '+49 8141 99-0',
    emergency: '+49 8141 99-2201',
    services: ['stroke_unit', 'telemedicine'],
    certified: true,
    certification: 'DSG',
    lastUpdated: '2024-08-01',
  },
];

// Helper functions for stroke center data
export function getStrokeCentersByType(type) {
  return strokeCenters.filter((center) => center.type === type);
}

export function getComprehensiveStrokeCenters() {
  return getStrokeCentersByType('comprehensive');
}

export function getPrimaryStrokeCenters() {
  return getStrokeCentersByType('primary');
}

export function getStrokeCenterById(id) {
  return strokeCenters.find((center) => center.id === id);
}

// Calculate distance between two coordinates using Haversine formula (fallback)
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
    * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
      format: 'json',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        Authorization: '5b3ce3597851110001cf624868c4c27b63ae476c9c26c8bffbc35688', // Free tier key
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(body),
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
        source: 'routing',
      };
    }
    throw new Error('No route found');
  } catch (error) {
    //('Travel time calculation failed, using distance estimate:', error);

    // Fallback to distance-based time estimation
    const distance = calculateDistance(fromLat, fromLng, toLat, toLng);
    const estimatedTime = Math.round(distance / 0.8); // Assume 48 km/h average (urban + highway)

    return {
      duration: estimatedTime,
      distance: Math.round(distance),
      source: 'estimated',
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
      source: result.source === 'routing' ? 'emergency-routing' : 'emergency-estimated',
    };
  } catch (error) {
    // Fallback calculation
    const distance = calculateDistance(fromLat, fromLng, toLat, toLng);
    const emergencyTime = Math.round(distance / 1.2); // Assume 72 km/h for emergency vehicles

    return {
      duration: emergencyTime,
      distance: Math.round(distance),
      source: 'emergency-estimated',
    };
  }
}

// Find nearest stroke centers with travel time calculation
export async function findNearestStrokeCentersWithTravelTime(lat, lng, maxResults = 5, maxTime = 120, useEmergencyRouting = true) {
  //('Calculating travel times to stroke centers...');

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
          travelSource: travelInfo.source,
        };
      } catch (error) {
        //(`Failed to calculate travel time to ${center.name}:`, error);
        // Fallback to distance calculation
        const distance = calculateDistance(lat, lng, center.coordinates.lat, center.coordinates.lng);
        return {
          ...center,
          travelTime: Math.round(distance / 0.8), // Estimate: 48 km/h average
          distance: Math.round(distance),
          travelSource: 'fallback',
        };
      }
    }),
  );

  return centersWithTravelTime
    .filter((center) => center.travelTime <= maxTime)
    .sort((a, b) => a.travelTime - b.travelTime)
    .slice(0, maxResults);
}

// Find nearest stroke centers using distance (fallback/fast method)
export function findNearestStrokeCenters(lat, lng, maxResults = 5, maxDistance = 100) {
  const centersWithDistance = strokeCenters.map((center) => ({
    ...center,
    distance: calculateDistance(lat, lng, center.coordinates.lat, center.coordinates.lng),
  }));

  return centersWithDistance
    .filter((center) => center.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults);
}

// Get stroke center recommendations with travel time (async)
export async function getRecommendedStrokeCentersWithTravelTime(lat, lng, conditionType = 'stroke') {
  const nearestCenters = await findNearestStrokeCentersWithTravelTime(lat, lng, 10, 120, true);

  if (conditionType === 'lvo' || conditionType === 'thrombectomy') {
    // For LVO cases, prioritize comprehensive stroke centers within 60 minutes
    const comprehensive = nearestCenters.filter((center) => center.type === 'comprehensive'
      && center.services.includes('thrombectomy')
      && center.travelTime <= 60);

    const primary = nearestCenters.filter((center) => center.type === 'primary');

    return {
      recommended: comprehensive.slice(0, 3),
      alternative: primary.slice(0, 2),
    };
  }

  // For ICH cases, prioritize neurosurgical capabilities
  if (conditionType === 'ich') {
    const neurosurgical = nearestCenters.filter((center) => center.services.includes('neurosurgery')
      && center.travelTime <= 45);

    return {
      recommended: neurosurgical.slice(0, 3),
      alternative: nearestCenters.filter((c) => !neurosurgical.includes(c)).slice(0, 2),
    };
  }

  // For general stroke cases, return nearest centers regardless of type
  return {
    recommended: nearestCenters.slice(0, 5),
    alternative: [],
  };
}

// Get stroke center recommendations based on patient condition (fallback - distance only)
export function getRecommendedStrokeCenters(lat, lng, conditionType = 'stroke') {
  const nearestCenters = findNearestStrokeCenters(lat, lng, 10);

  if (conditionType === 'lvo' || conditionType === 'thrombectomy') {
    // For LVO cases, prioritize comprehensive stroke centers
    const comprehensive = nearestCenters.filter((center) => center.type === 'comprehensive'
      && center.services.includes('thrombectomy'));

    const primary = nearestCenters.filter((center) => center.type === 'primary');

    return {
      recommended: comprehensive.slice(0, 3),
      alternative: primary.slice(0, 2),
    };
  }

  // For general stroke cases, return nearest centers regardless of type
  return {
    recommended: nearestCenters.slice(0, 5),
    alternative: [],
  };
}

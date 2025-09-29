// Simple test for geocoding functionality
async function testGeocoding(locationString) {
  try {
    const encodedLocation = encodeURIComponent(locationString + ', Deutschland');
    // SECURITY: API key moved to environment variables
    const apiKey = process.env.OPENROUTE_API_KEY || 'YOUR_API_KEY_HERE';
    if (apiKey === 'YOUR_API_KEY_HERE') {
      throw new Error('OpenRoute API key not configured. Set OPENROUTE_API_KEY environment variable.');
    }
    const url = `https://api.openrouteservice.org/geocoding/v1/search?api_key=${apiKey}&text=${encodedLocation}&boundary.country=DE&size=1`;
    
    console.log(`Testing geocoding for: ${locationString}`);
    console.log(`URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const location = data.features[0];
      const [lng, lat] = location.geometry.coordinates;
      const locationName = location.properties.label || locationString;
      
      console.log(`✅ Found: ${locationName}`);
      console.log(`   Coordinates: ${lat}, ${lng}`);
      return { lat, lng, name: locationName, success: true };
    } else {
      console.log(`❌ Location "${locationString}" not found`);
      return { success: false, error: 'Not found' };
    }
    
  } catch (error) {
    console.log(`❌ Geocoding failed for "${locationString}":`, error.message);
    return { success: false, error: error.message };
  }
}

// Test Bayern cities
async function runTests() {
  const cities = [
    'München',
    'Nürnberg', 
    'Augsburg',
    'Regensburg',
    'Würzburg',
    'Erlangen',
    'Ingolstadt',
    'Bamberg'
  ];
  
  console.log('Testing geocoding with Bayern cities...\n');
  
  for (const city of cities) {
    await testGeocoding(city);
    console.log(''); // Empty line between tests
  }
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testGeocoding, runTests };
}

// Run tests if in browser
if (typeof window !== 'undefined') {
  window.testGeocoding = testGeocoding;
  window.runTests = runTests;
}
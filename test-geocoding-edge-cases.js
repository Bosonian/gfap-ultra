// Test geocoding with challenging locations
console.log('🗺️ GEOCODING EDGE CASE TESTING\n');

const challengingLocations = [
  // German locations with umlauts and special characters
  'Garmisch-Partenkirchen',
  'Bad Tölz',
  'Fürstenfeldbruck',
  'Würzburg',
  'Düsseldorf',
  'Köln',
  'Mühlheim an der Ruhr',
  
  // Small villages
  'Oberammergau',
  'Rothenburg ob der Tauber',
  'Dinkelsbühl',
  
  // Ambiguous names
  'Frankfurt', // Could be Frankfurt am Main or Frankfurt (Oder)
  'Neustadt', // Many cities named Neustadt
  'Berg',
  
  // Addresses with special characters
  'Marienplatz 1, München',
  'Kürfürstendamm 100, Berlin', // Outside our coverage area
  'Römerstraße 5, Köln',
  
  // Edge cases
  '',
  '   ',
  'Nonexistent City XYZ',
  'Paris', // Outside Germany
  '48.1351, 11.5820', // Direct coordinates
  '48.1351,11.5820', // No space
  '48,1351, 11,5820', // Wrong decimal separator
  
  // Long location names
  'Universitätsklinikum Schleswig-Holstein, Campus Lübeck, Ratzeburger Allee 160, 23538 Lübeck'
];

async function testGeocoding(locationString) {
  try {
    // Simulate the app's geocoding logic
    let searchLocation = locationString.trim();
    
    if (searchLocation === '') {
      return { success: false, error: 'Empty location string' };
    }
    
    // Add Deutschland if needed
    if (!searchLocation.toLowerCase().includes('deutschland') &&
        !searchLocation.toLowerCase().includes('germany') &&
        !searchLocation.toLowerCase().includes('bayern') &&
        !searchLocation.toLowerCase().includes('bavaria') &&
        !searchLocation.toLowerCase().includes('nordrhein') &&
        !searchLocation.toLowerCase().includes('baden')) {
      searchLocation = searchLocation + ', Deutschland';
    }
    
    const encodedLocation = encodeURIComponent(searchLocation);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&countrycodes=de&format=json&limit=3&addressdetails=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'iGFAP-StrokeTriage-Test/2.1.0'
      }
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const supportedStates = ['Bayern', 'Baden-Württemberg', 'Nordrhein-Westfalen'];
      
      let location = data[0];
      for (const result of data) {
        if (result.address && supportedStates.includes(result.address.state)) {
          location = result;
          break;
        }
      }
      
      return {
        success: true,
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon),
        name: location.display_name,
        state: location.address?.state || 'Unknown',
        inSupportedState: supportedStates.includes(location.address?.state)
      };
    } else {
      return { success: false, error: 'No results found' };
    }
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Test all locations
let totalTests = 0;
let passedTests = 0;
let supportedStateResults = 0;

for (const locationString of challengingLocations) {
  totalTests++;
  console.log(`Testing: "${locationString}"`);
  
  try {
    const result = await testGeocoding(locationString);
    
    if (result.success) {
      passedTests++;
      if (result.inSupportedState) {
        supportedStateResults++;
      }
      
      console.log(`  ✅ Found: ${result.name}`);
      console.log(`     Coordinates: ${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`);
      console.log(`     State: ${result.state} ${result.inSupportedState ? '(Supported)' : '(Not supported)'}`);
    } else {
      console.log(`  ❌ Failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  
  console.log('');
  
  // Add delay to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 100));
}

console.log('📊 GEOCODING TEST SUMMARY');
console.log('=' .repeat(50));
console.log(`Total tests: ${totalTests}`);
console.log(`Successful geocoding: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);
console.log(`Results in supported states: ${supportedStateResults}/${totalTests} (${Math.round(supportedStateResults/totalTests*100)}%)`);
console.log(`Failed tests: ${totalTests - passedTests}/${totalTests} (${Math.round((totalTests-passedTests)/totalTests*100)}%)`);

if (passedTests/totalTests >= 0.8) {
  console.log('✅ GEOCODING ROBUSTNESS TEST PASSED (≥80% success rate)');
} else {
  console.log('❌ GEOCODING ROBUSTNESS TEST FAILED (<80% success rate)');
}
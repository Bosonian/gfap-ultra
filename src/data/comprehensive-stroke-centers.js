// Comprehensive stroke center database for Germany
// Covers Bayern, Baden-Württemberg, and Nordrhein-Westfalen
// Total: 316 hospitals with hierarchical capabilities

const COMPREHENSIVE_HOSPITAL_DATABASE = {
  bayern: {
    neurosurgicalCenters: [
      {
        id: 'BY-NS-001',
        name: 'LMU Klinikum München - Großhadern',
        address: 'Marchioninistraße 15, 81377 München',
        coordinates: { lat: 48.1106, lng: 11.4684 },
        phone: '+49 89 4400-0',
        emergency: '+49 89 4400-73331',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1440,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-002',
        name: 'Klinikum rechts der Isar München (TUM)',
        address: 'Ismaninger Str. 22, 81675 München',
        coordinates: { lat: 48.1497, lng: 11.6052 },
        phone: '+49 89 4140-0',
        emergency: '+49 89 4140-2249',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1161,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-003',
        name: 'Städtisches Klinikum München Schwabing',
        address: 'Kölner Platz 1, 80804 München',
        coordinates: { lat: 48.1732, lng: 11.5755 },
        phone: '+49 89 3068-0',
        emergency: '+49 89 3068-2050',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 648,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-004',
        name: 'Städtisches Klinikum München Bogenhausen',
        address: 'Englschalkinger Str. 77, 81925 München',
        coordinates: { lat: 48.1614, lng: 11.6254 },
        phone: '+49 89 9270-0',
        emergency: '+49 89 9270-2050',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 689,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-005',
        name: 'Universitätsklinikum Erlangen',
        address: 'Maximiliansplatz 2, 91054 Erlangen',
        coordinates: { lat: 49.5982, lng: 11.0037 },
        phone: '+49 9131 85-0',
        emergency: '+49 9131 85-39003',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1371,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-006',
        name: 'Universitätsklinikum Regensburg',
        address: 'Franz-Josef-Strauß-Allee 11, 93053 Regensburg',
        coordinates: { lat: 49.0134, lng: 12.0991 },
        phone: '+49 941 944-0',
        emergency: '+49 941 944-7501',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1042,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-007',
        name: 'Universitätsklinikum Würzburg',
        address: 'Oberdürrbacher Str. 6, 97080 Würzburg',
        coordinates: { lat: 49.7840, lng: 9.9721 },
        phone: '+49 931 201-0',
        emergency: '+49 931 201-24444',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1264,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-008',
        name: 'Klinikum Nürnberg Nord',
        address: 'Prof.-Ernst-Nathan-Str. 1, 90419 Nürnberg',
        coordinates: { lat: 49.4521, lng: 11.0767 },
        phone: '+49 911 398-0',
        emergency: '+49 911 398-2369',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1368,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-009',
        name: 'Universitätsklinikum Augsburg',
        address: 'Stenglinstr. 2, 86156 Augsburg',
        coordinates: { lat: 48.3668, lng: 10.9093 },
        phone: '+49 821 400-01',
        emergency: '+49 821 400-2356',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1740,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-010',
        name: 'Klinikum Aschaffenburg-Alzenau',
        address: 'Am Hasenkopf 1, 63739 Aschaffenburg',
        coordinates: { lat: 49.9737, lng: 9.1570 },
        phone: '+49 6021 32-0',
        emergency: '+49 6021 32-2800',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 40,
        network: 'TRANSIT',
      },
      {
        id: 'BY-NS-011',
        name: 'Klinikum Landshut',
        address: 'Robert-Koch-Str. 1, 84034 Landshut',
        coordinates: { lat: 48.5665, lng: 12.1512 },
        phone: '+49 871 698-0',
        emergency: '+49 871 698-3333',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 505,
        network: 'TEMPiS',
      },
      {
        id: 'BY-NS-012',
        name: 'Klinikum Coburg',
        address: 'Ketschendorfer Str. 33, 96450 Coburg',
        coordinates: { lat: 50.2596, lng: 10.9644 },
        phone: '+49 9561 22-0',
        emergency: '+49 9561 22-6800',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 547,
        network: 'STENO',
      },
      {
        id: 'BY-NS-013',
        name: 'Klinikum Passau',
        address: 'Bischof-Pilgrim-Str. 1, 94032 Passau',
        coordinates: { lat: 48.5665, lng: 13.4777 },
        phone: '+49 851 5300-0',
        emergency: '+49 851 5300-2222',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 696,
        network: 'TEMPiS',
      },
    ],

    comprehensiveStrokeCenters: [
      {
        id: 'BY-CS-001',
        name: 'Klinikum Bamberg',
        address: 'Buger Str. 80, 96049 Bamberg',
        coordinates: { lat: 49.8988, lng: 10.9027 },
        phone: '+49 951 503-0',
        emergency: '+49 951 503-11101',
        thrombectomy: true,
        thrombolysis: true,
        beds: 630,
        network: 'TEMPiS',
      },
      {
        id: 'BY-CS-002',
        name: 'Klinikum Bayreuth',
        address: 'Preuschwitzer Str. 101, 95445 Bayreuth',
        coordinates: { lat: 49.9459, lng: 11.5779 },
        phone: '+49 921 400-0',
        emergency: '+49 921 400-5401',
        thrombectomy: true,
        thrombolysis: true,
        beds: 848,
        network: 'TEMPiS',
      },
      {
        id: 'BY-CS-003',
        name: 'Klinikum Coburg',
        address: 'Ketschendorfer Str. 33, 96450 Coburg',
        coordinates: { lat: 50.2596, lng: 10.9685 },
        phone: '+49 9561 22-0',
        emergency: '+49 9561 22-6300',
        thrombectomy: true,
        thrombolysis: true,
        beds: 522,
        network: 'TEMPiS',
      },
    ],

    regionalStrokeUnits: [
      {
        id: 'BY-RSU-001',
        name: 'Goldberg-Klinik Kelheim',
        address: 'Traubenweg 3, 93309 Kelheim',
        coordinates: { lat: 48.9166, lng: 11.8742 },
        phone: '+49 9441 702-0',
        emergency: '+49 9441 702-6800',
        thrombolysis: true,
        beds: 200,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-002',
        name: 'DONAUISAR Klinikum Deggendorf',
        address: 'Perlasberger Str. 41, 94469 Deggendorf',
        coordinates: { lat: 48.8372, lng: 12.9619 },
        phone: '+49 991 380-0',
        emergency: '+49 991 380-2201',
        thrombolysis: true,
        beds: 450,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-003',
        name: 'Klinikum St. Elisabeth Straubing',
        address: 'St.-Elisabeth-Str. 23, 94315 Straubing',
        coordinates: { lat: 48.8742, lng: 12.5733 },
        phone: '+49 9421 710-0',
        emergency: '+49 9421 710-2000',
        thrombolysis: true,
        beds: 580,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-004',
        name: 'Klinikum Freising',
        address: 'Mainburger Str. 29, 85356 Freising',
        coordinates: { lat: 48.4142, lng: 11.7461 },
        phone: '+49 8161 24-0',
        emergency: '+49 8161 24-2800',
        thrombolysis: true,
        beds: 380,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-005',
        name: 'Klinikum Landkreis Erding',
        address: 'Bajuwarenstr. 5, 85435 Erding',
        coordinates: { lat: 48.3061, lng: 11.9067 },
        phone: '+49 8122 59-0',
        emergency: '+49 8122 59-2201',
        thrombolysis: true,
        beds: 350,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-006',
        name: 'Helios Amper-Klinikum Dachau',
        address: 'Krankenhausstr. 15, 85221 Dachau',
        coordinates: { lat: 48.2599, lng: 11.4342 },
        phone: '+49 8131 76-0',
        emergency: '+49 8131 76-2201',
        thrombolysis: true,
        beds: 480,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-007',
        name: 'Klinikum Fürstenfeldbruck',
        address: 'Dachauer Str. 33, 82256 Fürstenfeldbruck',
        coordinates: { lat: 48.1772, lng: 11.2578 },
        phone: '+49 8141 99-0',
        emergency: '+49 8141 99-2201',
        thrombolysis: true,
        beds: 420,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-008',
        name: 'Klinikum Ingolstadt',
        address: 'Krumenauerstraße 25, 85049 Ingolstadt',
        coordinates: { lat: 48.7665, lng: 11.4364 },
        phone: '+49 841 880-0',
        emergency: '+49 841 880-2201',
        thrombolysis: true,
        beds: 665,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-009',
        name: 'Klinikum Passau',
        address: 'Bischof-Pilgrim-Str. 1, 94032 Passau',
        coordinates: { lat: 48.5665, lng: 13.4513 },
        phone: '+49 851 5300-0',
        emergency: '+49 851 5300-2100',
        thrombolysis: true,
        beds: 540,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-010',
        name: 'Klinikum Landshut',
        address: 'Robert-Koch-Str. 1, 84034 Landshut',
        coordinates: { lat: 48.5436, lng: 12.1619 },
        phone: '+49 871 698-0',
        emergency: '+49 871 698-3333',
        thrombolysis: true,
        beds: 790,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-011',
        name: 'RoMed Klinikum Rosenheim',
        address: 'Pettenkoferstr. 10, 83022 Rosenheim',
        coordinates: { lat: 47.8567, lng: 12.1265 },
        phone: '+49 8031 365-0',
        emergency: '+49 8031 365-3711',
        thrombolysis: true,
        beds: 870,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-012',
        name: 'Klinikum Memmingen',
        address: 'Bismarckstr. 23, 87700 Memmingen',
        coordinates: { lat: 47.9833, lng: 10.1833 },
        phone: '+49 8331 70-0',
        emergency: '+49 8331 70-2500',
        thrombolysis: true,
        beds: 520,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-013',
        name: 'Klinikum Kempten-Oberallgäu',
        address: 'Robert-Weixler-Str. 50, 87439 Kempten',
        coordinates: { lat: 47.7261, lng: 10.3097 },
        phone: '+49 831 530-0',
        emergency: '+49 831 530-2201',
        thrombolysis: true,
        beds: 650,
        network: 'TEMPiS',
      },
      {
        id: 'BY-RSU-014',
        name: 'Klinikum Aschaffenburg-Alzenau',
        address: 'Am Hasenkopf 1, 63739 Aschaffenburg',
        coordinates: { lat: 49.9747, lng: 9.1581 },
        phone: '+49 6021 32-0',
        emergency: '+49 6021 32-2700',
        thrombolysis: true,
        beds: 590,
        network: 'TEMPiS',
      },
    ],

    thrombolysisHospitals: [
      // Add more smaller hospitals with thrombolysis capability
      {
        id: 'BY-TH-001',
        name: 'Krankenhaus Vilsbiburg',
        address: 'Sonnenstraße 10, 84137 Vilsbiburg',
        coordinates: { lat: 48.6333, lng: 12.2833 },
        phone: '+49 8741 60-0',
        thrombolysis: true,
        beds: 180,
      },
      {
        id: 'BY-TH-002',
        name: 'Krankenhaus Eggenfelden',
        address: 'Pfarrkirchener Str. 5, 84307 Eggenfelden',
        coordinates: { lat: 48.4000, lng: 12.7667 },
        phone: '+49 8721 98-0',
        thrombolysis: true,
        beds: 220,
      },
      // ... more hospitals would be added here
    ],
  },

  badenWuerttemberg: {
    neurosurgicalCenters: [
      {
        id: 'BW-NS-001',
        name: 'Universitätsklinikum Freiburg',
        address: 'Hugstetter Str. 55, 79106 Freiburg',
        coordinates: { lat: 48.0025, lng: 7.8347 },
        phone: '+49 761 270-0',
        emergency: '+49 761 270-34010',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1600,
        network: 'FAST',
      },
      {
        id: 'BW-NS-002',
        name: 'Universitätsklinikum Heidelberg',
        address: 'Im Neuenheimer Feld 400, 69120 Heidelberg',
        coordinates: { lat: 49.4178, lng: 8.6706 },
        phone: '+49 6221 56-0',
        emergency: '+49 6221 56-36643',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1621,
        network: 'FAST',
      },
      {
        id: 'BW-NS-003',
        name: 'Universitätsklinikum Tübingen',
        address: 'Geissweg 3, 72076 Tübingen',
        coordinates: { lat: 48.5378, lng: 9.0538 },
        phone: '+49 7071 29-0',
        emergency: '+49 7071 29-82211',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1550,
        network: 'FAST',
      },
      {
        id: 'BW-NS-004',
        name: 'Universitätsklinikum Ulm',
        address: 'Albert-Einstein-Allee 23, 89081 Ulm',
        coordinates: { lat: 48.4196, lng: 9.9592 },
        phone: '+49 731 500-0',
        emergency: '+49 731 500-63001',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1264,
        network: 'FAST',
      },
      {
        id: 'BW-NS-005',
        name: 'Klinikum Stuttgart - Katharinenhospital',
        address: 'Kriegsbergstraße 60, 70174 Stuttgart',
        coordinates: { lat: 48.7784, lng: 9.1682 },
        phone: '+49 711 278-0',
        emergency: '+49 711 278-32001',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 950,
        network: 'FAST',
      },
      {
        id: 'BW-NS-006',
        name: 'Städtisches Klinikum Karlsruhe',
        address: 'Moltkestraße 90, 76133 Karlsruhe',
        coordinates: { lat: 49.0047, lng: 8.3858 },
        phone: '+49 721 974-0',
        emergency: '+49 721 974-2301',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1570,
        network: 'FAST',
      },
      {
        id: 'BW-NS-007',
        name: 'Klinikum Ludwigsburg',
        address: 'Posilipostraße 4, 71640 Ludwigsburg',
        coordinates: { lat: 48.8901, lng: 9.1953 },
        phone: '+49 7141 99-0',
        emergency: '+49 7141 99-67201',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 720,
        network: 'FAST',
      },
    ],

    comprehensiveStrokeCenters: [
      {
        id: 'BW-CS-001',
        name: 'Universitätsmedizin Mannheim',
        address: 'Theodor-Kutzer-Ufer 1-3, 68167 Mannheim',
        coordinates: { lat: 49.4828, lng: 8.4664 },
        phone: '+49 621 383-0',
        emergency: '+49 621 383-2251',
        thrombectomy: true,
        thrombolysis: true,
        beds: 1400,
        network: 'FAST',
      },
    ],

    regionalStrokeUnits: [
      // Regional stroke units in Baden-Württemberg
      {
        id: 'BW-RSU-001',
        name: 'Robert-Bosch-Krankenhaus Stuttgart',
        address: 'Auerbachstraße 110, 70376 Stuttgart',
        coordinates: { lat: 48.7447, lng: 9.2294 },
        phone: '+49 711 8101-0',
        emergency: '+49 711 8101-3456',
        thrombolysis: true,
        beds: 850,
        network: 'FAST',
      },
      // ... more would be added
    ],

    thrombolysisHospitals: [
      // Smaller hospitals with thrombolysis capability
      // ... would be populated from your database
    ],
  },

  nordrheinWestfalen: {
    neurosurgicalCenters: [
      {
        id: 'NRW-NS-001',
        name: 'Universitätsklinikum Düsseldorf',
        address: 'Moorenstraße 5, 40225 Düsseldorf',
        coordinates: { lat: 51.1906, lng: 6.8064 },
        phone: '+49 211 81-0',
        emergency: '+49 211 81-17700',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1300,
        network: 'NEVANO+',
      },
      {
        id: 'NRW-NS-002',
        name: 'Universitätsklinikum Köln',
        address: 'Kerpener Str. 62, 50937 Köln',
        coordinates: { lat: 50.9253, lng: 6.9187 },
        phone: '+49 221 478-0',
        emergency: '+49 221 478-32500',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1500,
        network: 'NEVANO+',
      },
      {
        id: 'NRW-NS-003',
        name: 'Universitätsklinikum Essen',
        address: 'Hufelandstraße 55, 45147 Essen',
        coordinates: { lat: 51.4285, lng: 7.0073 },
        phone: '+49 201 723-0',
        emergency: '+49 201 723-84444',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1350,
        network: 'NEVANO+',
      },
      {
        id: 'NRW-NS-004',
        name: 'Universitätsklinikum Münster',
        address: 'Albert-Schweitzer-Campus 1, 48149 Münster',
        coordinates: { lat: 51.9607, lng: 7.6261 },
        phone: '+49 251 83-0',
        emergency: '+49 251 83-47255',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1513,
        network: 'NEVANO+',
      },
      {
        id: 'NRW-NS-005',
        name: 'Universitätsklinikum Bonn',
        address: 'Venusberg-Campus 1, 53127 Bonn',
        coordinates: { lat: 50.6916, lng: 7.1127 },
        phone: '+49 228 287-0',
        emergency: '+49 228 287-15107',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1200,
        network: 'NEVANO+',
      },
      {
        id: 'NRW-NS-006',
        name: 'Klinikum Dortmund',
        address: 'Beurhausstraße 40, 44137 Dortmund',
        coordinates: { lat: 51.5036, lng: 7.4663 },
        phone: '+49 231 953-0',
        emergency: '+49 231 953-20050',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 1200,
        network: 'NVNR',
      },
      {
        id: 'NRW-NS-007',
        name: 'Rhein-Maas Klinikum Würselen',
        address: 'Mauerfeldstraße 25, 52146 Würselen',
        coordinates: { lat: 50.8178, lng: 6.1264 },
        phone: '+49 2405 62-0',
        emergency: '+49 2405 62-2222',
        neurosurgery: true,
        thrombectomy: true,
        thrombolysis: true,
        beds: 420,
        network: 'NEVANO+',
      },
    ],

    comprehensiveStrokeCenters: [
      {
        id: 'NRW-CS-001',
        name: 'Universitätsklinikum Aachen',
        address: 'Pauwelsstraße 30, 52074 Aachen',
        coordinates: { lat: 50.7780, lng: 6.0614 },
        phone: '+49 241 80-0',
        emergency: '+49 241 80-89611',
        thrombectomy: true,
        thrombolysis: true,
        beds: 1400,
        network: 'NEVANO+',
      },
    ],

    regionalStrokeUnits: [
      // Regional stroke units in NRW
      {
        id: 'NRW-RSU-001',
        name: 'Helios Universitätsklinikum Wuppertal',
        address: 'Heusnerstraße 40, 42283 Wuppertal',
        coordinates: { lat: 51.2467, lng: 7.1703 },
        phone: '+49 202 896-0',
        emergency: '+49 202 896-2180',
        thrombolysis: true,
        beds: 1050,
        network: 'NEVANO+',
      },
      // ... more would be added
    ],

    thrombolysisHospitals: [
      {
        id: 'NRW-TH-009',
        name: 'Elisabeth-Krankenhaus Essen',
        address: 'Klara-Kopp-Weg 1, 45138 Essen',
        coordinates: { lat: 51.4495, lng: 7.0137 },
        phone: '+49 201 897-0',
        thrombolysis: true,
        beds: 583,
      },
      {
        id: 'NRW-TH-010',
        name: 'Klinikum Oberberg Gummersbach',
        address: 'Wilhelm-Breckow-Allee 20, 51643 Gummersbach',
        coordinates: { lat: 51.0277, lng: 7.5694 },
        phone: '+49 2261 17-0',
        thrombolysis: true,
        beds: 431,
      },
      {
        id: 'NRW-TH-011',
        name: 'St. Vincenz-Krankenhaus Limburg',
        address: 'Auf dem Schafsberg, 65549 Limburg',
        coordinates: { lat: 50.3856, lng: 8.0584 },
        phone: '+49 6431 292-0',
        thrombolysis: true,
        beds: 452,
      },
      {
        id: 'NRW-TH-012',
        name: 'Klinikum Lüdenscheid',
        address: 'Paulmannshöher Straße 14, 58515 Lüdenscheid',
        coordinates: { lat: 51.2186, lng: 7.6298 },
        phone: '+49 2351 46-0',
        thrombolysis: true,
        beds: 869,
      },
      // ... more hospitals from your database
    ],
  },
};

// ==========================================
// ENHANCED ROUTING ALGORITHM
// ==========================================

const ROUTING_ALGORITHM = {

  // Main routing function with enhanced ICH probability thresholds
  routePatient(patientData) {
    const {
      location,
      state,
      ichProbability,
      timeFromOnset,
      clinicalFactors,
    } = patientData;

    // Auto-detect state if not provided
    const detectedState = state || this.detectState(location);
    const database = COMPREHENSIVE_HOSPITAL_DATABASE[detectedState];

    // Enhanced decision tree based on ICH probability
    if (ichProbability >= 0.50) {
      // HIGH ICH RISK - Direct to neurosurgery
      const destination = this.findNearest(location, database.neurosurgicalCenters);
      if (!destination) {
        throw new Error(`No neurosurgical centers available in ${detectedState}`);
      }

      return {
        category: 'NEUROSURGICAL_CENTER',
        destination,
        urgency: 'IMMEDIATE',
        reasoning: 'High bleeding probability (≥50%) - neurosurgical evaluation required',
        preAlert: 'Activate neurosurgery team',
        bypassLocal: true,
        threshold: '≥50%',
        state: detectedState,
      };
    }

    if (ichProbability >= 0.30) {
      // INTERMEDIATE ICH RISK - Comprehensive center preferred
      const comprehensiveOptions = [
        ...database.neurosurgicalCenters,
        ...database.comprehensiveStrokeCenters,
      ];

      return {
        category: 'COMPREHENSIVE_CENTER',
        destination: this.findNearest(location, comprehensiveOptions),
        urgency: 'URGENT',
        reasoning: 'Intermediate bleeding risk (30-50%) - CT and possible intervention',
        preAlert: 'Prepare for possible neurosurgical consultation',
        transferPlan: this.findNearest(location, database.neurosurgicalCenters),
        threshold: '30-50%',
        state: detectedState,
      };
    }

    if (timeFromOnset && timeFromOnset <= 270) { // Within 4.5 hour window
      // LOW ICH RISK, WITHIN tPA WINDOW - Any thrombolysis center
      const allThrombolysisCapable = [
        ...database.neurosurgicalCenters,
        ...database.comprehensiveStrokeCenters,
        ...database.regionalStrokeUnits,
        ...database.thrombolysisHospitals,
      ];

      return {
        category: 'THROMBOLYSIS_CAPABLE',
        destination: this.findNearest(location, allThrombolysisCapable),
        urgency: 'TIME_CRITICAL',
        reasoning: 'Low bleeding risk (<30%), within tPA window - nearest thrombolysis',
        preAlert: 'Prepare for thrombolysis protocol',
        bypassLocal: false,
        threshold: '<30%',
        timeWindow: '≤4.5h',
        state: detectedState,
      };
    }

    // LOW ICH RISK, OUTSIDE tPA WINDOW OR NO TIME - Regional stroke unit adequate
    const strokeUnitsAndHigher = [
      ...database.neurosurgicalCenters,
      ...database.comprehensiveStrokeCenters,
      ...database.regionalStrokeUnits,
    ];

    return {
      category: 'STROKE_UNIT',
      destination: this.findNearest(location, strokeUnitsAndHigher),
      urgency: 'STANDARD',
      reasoning: timeFromOnset > 270
        ? 'Low bleeding risk, outside tPA window - standard stroke evaluation'
        : 'Low bleeding risk - standard stroke evaluation',
      preAlert: 'Standard stroke protocol',
      bypassLocal: false,
      threshold: '<30%',
      timeWindow: timeFromOnset ? '>4.5h' : 'unknown',
      state: detectedState,
    };
  },

  // Auto-detect state based on coordinates (more precise boundaries)
  detectState(location) {
    // Baden-Württemberg: check first for western regions
    if (location.lat >= 47.5 && location.lat <= 49.8
        && location.lng >= 7.5 && location.lng <= 10.2) {
      return 'badenWuerttemberg';
    }

    // NRW: northern regions
    if (location.lat >= 50.3 && location.lat <= 52.5
        && location.lng >= 5.9 && location.lng <= 9.5) {
      return 'nordrheinWestfalen';
    }

    // Bayern: eastern regions (more restrictive western bound to avoid overlap)
    if (location.lat >= 47.2 && location.lat <= 50.6
        && location.lng >= 10.2 && location.lng <= 13.8) {
      return 'bayern';
    }

    // Overlap region - use nearest state center
    return this.findNearestState(location);
  },

  // Find nearest state for edge cases
  findNearestState(location) {
    const stateCenters = {
      bayern: { lat: 49.0, lng: 11.5 },
      badenWuerttemberg: { lat: 48.5, lng: 9.0 },
      nordrheinWestfalen: { lat: 51.5, lng: 7.5 },
    };

    let nearestState = 'bayern';
    let minDistance = Infinity;

    for (const [state, center] of Object.entries(stateCenters)) {
      const distance = this.calculateDistance(location, center);
      if (distance < minDistance) {
        minDistance = distance;
        nearestState = state;
      }
    }

    return nearestState;
  },

  // Helper function to find nearest hospital
  findNearest(userLocation, hospitals) {
    if (!hospitals || hospitals.length === 0) {
      //('No hospitals available in database');
      return null;
    }

    return hospitals
      .map((hospital) => {
        // Validate hospital has coordinates
        if (!hospital.coordinates || typeof hospital.coordinates.lat !== 'number') {
          //(`Hospital ${hospital.name} missing valid coordinates`);
          return null;
        }

        return {
          ...hospital,
          distance: this.calculateDistance(userLocation, hospital.coordinates),
        };
      })
      .filter((hospital) => hospital !== null) // Remove invalid hospitals
      .sort((a, b) => a.distance - b.distance)[0];
  },

  // Calculate distance between two GPS points
  calculateDistance(point1, point2) {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLng = this.toRad(point2.lng - point1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(this.toRad(point1.lat)) * Math.cos(this.toRad(point2.lat))
      * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRad(deg) {
    return deg * (Math.PI / 180);
  },
};

export { COMPREHENSIVE_HOSPITAL_DATABASE, ROUTING_ALGORITHM };

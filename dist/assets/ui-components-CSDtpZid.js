import{t as l,R as F,C as D,c as T,b as I}from"./index-bLHn9iqQ.js";import{s as E}from"./enterprise-features-DOrIKDK9.js";import{f as H}from"./prediction-models-DkrcyEmP.js";function q(e){return`
        <div id="locationContainer" >
          <!-- Location Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <button 
              type="button" 
              id="useGpsButton" 
              class="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition transform hover:scale-[1.02] shadow-sm"
            >
              📍 ${l("useCurrentLocation")}
            </button>

            <button 
              type="button" 
              id="manualLocationButton" 
              class="px-4 py-2 rounded-md font-medium text-white bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none transition transform hover:scale-[1.02] shadow-sm"
            >
              ✏️ ${l("enterManually")}
            </button>
          </div>

          <!-- Manual Location Input -->
          <div class="location-manual hidden flex gap-2">
            <input 
              type="text" 
              id="locationInput" 
              class="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition"
              placeholder="${l("enterLocationPlaceholder")||"e.g. München, Köln, Stuttgart, or 48.1351, 11.5820"}"
            />
            <button 
              type="button" 
              id="searchLocationButton" 
              class="px-4 py-2 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition transform hover:scale-[1.02] shadow-sm"
            >
              ${l("search")}
            </button>
          </div>

          <!-- Results -->
          <div 
            id="strokeCenterResults" 
            class="stroke-center-results space-y-3"
          ></div>
        </div>
  `}function z(e){console.log("[StrokeMap] Initializing stroke center map with results:",e);const o=document.getElementById("useGpsButton"),t=document.getElementById("manualLocationButton"),n=document.querySelector(".location-manual"),r=document.getElementById("locationInput"),a=document.getElementById("searchLocationButton"),d=document.getElementById("strokeCenterResults");d.className="mt-4",console.log("[StrokeMap] Found elements:",{useGpsButton:!!o,manualLocationButton:!!t,locationManual:!!n,locationInput:!!r,searchLocationButton:!!a,resultsContainer:!!d}),o&&o.addEventListener("click",()=>{R(e,d)}),t&&t.addEventListener("click",()=>{const g=getComputedStyle(n).display==="none";n.style.display=g?"block":"none",n.className="mt-4"}),a&&a.addEventListener("click",()=>{const g=r.value.trim();g&&C(g,e,d)}),r&&r.addEventListener("keypress",g=>{if(g.key==="Enter"){const y=r.value.trim();y&&C(y,e,d)}})}function R(e,o){if(!navigator.geolocation){$(l("geolocationNotSupported"),o);return}try{E(o,`<div class="loading">${l("gettingLocation")}...</div>`)}catch(t){o.textContent="Getting location...",console.error("Sanitization failed:",t)}navigator.geolocation.getCurrentPosition(t=>{const{latitude:n,longitude:r}=t.coords;B(n,r,e,o)},t=>{let n=l("locationError");switch(t.code){case t.PERMISSION_DENIED:n=l("locationPermissionDenied");break;case t.POSITION_UNAVAILABLE:n=l("locationUnavailable");break;case t.TIMEOUT:n=l("locationTimeout");break}$(n,o)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function C(e,o,t){window.__geocodeCache||(window.__geocodeCache=new Map);const n=window.__geocodeCache;if(!e||!e.trim()){$("Please enter a location or coordinates.",t);return}try{E(t,`<div class="loading">${l("searchingLocation")}...</div>`)}catch(i){t.textContent="Searching location...",console.error("Sanitization failed:",i)}const r=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,a=e.trim().match(r);if(a){const i=parseFloat(a[1]),m=parseFloat(a[2]);if(i>=46.5&&i<=55.1&&m>=5.5&&m<=15.5){try{E(t,`
          <div class="location-success">
            <p>📍 Coordinates: ${i.toFixed(4)}, ${m.toFixed(4)}</p>
          </div>
        `)}catch(h){t.textContent=`Coordinates: ${i.toFixed(4)}, ${m.toFixed(4)}`,console.error("Sanitization failed:",h)}setTimeout(()=>B(i,m,o,t),500);return}$("Coordinates appear to be outside Germany. Please check the values.",t);return}let d=e.trim();if(/deutschland|germany|bayern|bavaria|baden|württemberg|nordrhein|westfalen/i.test(d)||(d+=", Deutschland"),n.has(d)){const i=n.get(d);displayLocationSuccess(i,o,t);return}await new Promise(i=>setTimeout(i,300));const y=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(d)}&countrycodes=de&format=json&limit=3&addressdetails=1`;try{const i=await fetch(y,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0 (contact: support@yourdomain.de)"}});if(!i.ok)throw new Error(`Geocoding API error: ${i.status}`);const m=await i.json();if(m&&m.length>0){const h=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];let x=m.find(c=>c.address&&h.includes(c.address.state))||m[0];const w=parseFloat(x.lat),p=parseFloat(x.lon),b=x.display_name||e;n.set(d,{lat:w,lng:p,locationName:b}),displayLocationSuccess({lat:w,lng:p,locationName:b},o,t)}else $(`
        <strong>Location "${e}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,t)}catch(i){console.error("Geocoding failed:",i),$(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,t)}}async function B(e,o,t,n){var g,y,i,m,h,x,w;const r={lat:e,lng:o},a=F.routePatient({location:r,ichProbability:((g=t==null?void 0:t.ich)==null?void 0:g.probability)||0,timeFromOnset:(t==null?void 0:t.timeFromOnset)||null,clinicalFactors:(t==null?void 0:t.clinicalFactors)||{}});if(!a||!a.destination){E(n,`
      <div class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-lg p-4">
        <p class="font-semibold">⚠️ No suitable stroke centers found in this area.</p>
        <p class="text-sm mt-1 text-gray-600 dark:text-gray-400">
          Please try a different location or contact emergency services directly.
        </p>
      </div>
      `);return}const d=G(a,t);E(n,`
    <div class="bg-yellow-100 dark:bg-yellow-900/20 text-blue-900 dark:text-blue-200 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
      <p><strong>${l("yourLocation")}:</strong> ${e.toFixed(4)}, ${o.toFixed(4)}</p>
      <p><strong>${l("detectedState")||"Detected State"}:</strong> ${P(a.state)}</p>
      <div class="text-gray-700 dark:text-gray-300 text-sm italic mt-2">${l("calculatingTravelTimes")}...</div>
    </div>
    `);try{const p=D[a.state],b=[...p.neurosurgicalCenters,...p.comprehensiveStrokeCenters,...p.regionalStrokeUnits,...p.thrombolysisHospitals||[]],{destination:c}=a;c.distance=T(e,o,c.coordinates.lat,c.coordinates.lng);try{const s=await I(e,o,c.coordinates.lat,c.coordinates.lng);c.travelTime=s.duration,c.travelSource=s.source}catch(s){c.travelTime=Math.round(c.distance/.8),c.travelSource="estimated"}const L=b.filter(s=>s.id!==c.id).map(s=>({...s,distance:T(e,o,s.coordinates.lat,s.coordinates.lng)})).sort((s,k)=>s.distance-k.distance).slice(0,3);for(const s of L)try{const k=await I(e,o,s.coordinates.lat,s.coordinates.lng);s.travelTime=k.duration,s.travelSource=k.source}catch(k){s.travelTime=Math.round(s.distance/.8),s.travelSource="estimated"}n.innerHTML="";const f=document.createElement("div");f.className="space-y-6 mt-4";const v=document.createElement("div");v.className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4",v.innerHTML=`
    <div class="p-4 bg-white rounded-lg shadow-md space-y-2">
      <p class="text-gray-700">
        <strong class="font-semibold text-gray-900">Your Location:</strong> 
        ${e.toFixed(4)}, ${o.toFixed(4)}
      </p>
      <p class="text-gray-700">
        <strong class="font-semibold text-gray-900">State:</strong> 
        ${P(a.state)}
      </p>
      <div class="text-sm text-gray-600">
        ${d}
      </div>
    </div>
  `,f.appendChild(v);const u=document.createElement("div");if(u.className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm",u.innerHTML=`
      <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
        🏥 ${a.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      </div>
    `,u.querySelector("div.grid").appendChild(A(c,!0,a)),f.appendChild(u),L.length>0){const s=document.createElement("div");s.className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4",s.innerHTML=`
        <h4 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Alternative Centers
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"></div>
      `;const k=s.querySelector("div.grid");L.forEach(N=>k.appendChild(A(N,!1,a))),f.appendChild(s)}const M=document.createElement("div");M.className="text-md text-gray-600 dark:text-gray-400 italic mt-4 text-center",M.innerHTML="<small>Travel times estimated for emergency vehicles</small>",f.appendChild(M),n.appendChild(f),_(n)}catch(p){console.error("🚨 Stroke Center Display Error:",p),n.innerHTML=`
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 class="text-lg font-semibold mb-2">🏥 Recommended Center</h4>
        <p><strong>${((y=a==null?void 0:a.destination)==null?void 0:y.name)||"Unknown Hospital"}</strong></p>
        <p class="text-gray-600 dark:text-gray-400">📍 ${((i=a==null?void 0:a.destination)==null?void 0:i.address)||"Address not available"}</p>
        <p class="text-gray-600 dark:text-gray-400">📞 ${((m=a==null?void 0:a.destination)==null?void 0:m.emergency)||((h=a==null?void 0:a.destination)==null?void 0:h.phone)||"Phone not available"}</p>
        <p class="mt-2 text-gray-700 dark:text-gray-300">
          📏 Distance: ${((w=(x=a==null?void 0:a.destination)==null?void 0:x.distance)==null?void 0:w.toFixed(1))||"?"} km
        </p>
        ${(alternatives==null?void 0:alternatives.length)>0?`<p class="mt-2 text-sm text-gray-600 dark:text-gray-400"><strong>+ ${alternatives.length} alternative centers nearby</strong></p>`:""}
      </div>
    `}}function P(e){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[e]||e}function G(e,o){var a;const t=Math.round((((a=o==null?void 0:o.ich)==null?void 0:a.probability)||0)*100);let n="🏥",r="from-gray-500 to-gray-600";return e.urgency==="IMMEDIATE"?(n="🚨",r="from-red-500 to-red-700"):e.urgency==="TIME_CRITICAL"?(n="⏰",r="from-yellow-500 to-orange-600"):e.urgency==="URGENT"&&(n="⚠️",r="from-amber-500 to-yellow-600"),`
    <div class="routing-explanation ${e.category.toLowerCase()} 
      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
      rounded-lg shadow-md p-4 mt-4 transition-all duration-300 hover:shadow-xl">
      
      <div class="routing-header mb-3 flex items-center justify-between">
        <strong class="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span class="text-xl">${n}</span> 
          ${e.category.replace("_"," ")} - ${e.urgency}
        </strong>
        <span class="text-xs px-2 py-1 rounded-md text-white bg-gradient-to-r ${r} shadow-sm font-medium">
          ${e.urgency}
        </span>
      </div>

      <div class="routing-details space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p><strong>🧠 ICH Risk:</strong> <span class="font-medium">${t}%</span> ${e.threshold?`(${e.threshold})`:""}</p>
        ${e.timeWindow?`<p><strong>⏳ Time Window:</strong> <span class="font-medium">${e.timeWindow}</span></p>`:""}
        <p><strong>🧭 Routing Logic:</strong> ${e.reasoning}</p>
        <p><strong>📢 Pre-Alert:</strong> ${e.preAlert}</p>
        ${e.bypassLocal?`<p class="bypass-warning text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                ⚠️ <span>Bypassing local hospitals</span>
              </p>`:""}
      </div>
    </div>
  `}function A(e,o,t){const n=document.createElement("div");n.className=`stroke-center-card ${o?"recommended":"alternative"} enhanced 
    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
    rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 
    p-5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`;const r=[];e.neurosurgery&&r.push("🧠 Neurosurgery"),e.thrombectomy&&r.push("🩸 Thrombectomy"),e.thrombolysis&&r.push("💉 Thrombolysis");const a=e.network?`<span class="network-badge inline-block px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">${e.network}</span>`:"";return n.innerHTML=`
    <div class="center-header flex justify-between items-start mb-3">
      <h5 class="text-lg font-semibold leading-snug">${e.name}</h5>
      <div class="center-badges flex gap-1">
        ${e.neurosurgery?'<span class="capability-badge neurosurgery bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 px-2 py-0.5 text-xs rounded-md font-medium">NS</span>':""}
        ${e.thrombectomy?'<span class="capability-badge thrombectomy bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-2 py-0.5 text-xs rounded-md font-medium">TE</span>':""}
        ${a}
      </div>
    </div>

    <div class="center-metrics flex justify-between items-center mb-4">
      ${e.travelTime?`
        <div class="travel-info flex flex-col text-sm text-gray-600 dark:text-gray-400">
          <span class="travel-time font-semibold text-base text-blue-600 dark:text-blue-400">${e.travelTime} min</span>
          <span class="distance">${e.distance.toFixed(1)} km</span>
        </div>
      `:`
        <div class="distance-only text-sm text-gray-600 dark:text-gray-400">
          <span class="distance font-medium">${e.distance.toFixed(1)} km</span>
        </div>
      `}
      <div class="bed-info text-sm text-gray-700 dark:text-gray-300">
        <span class="beds bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs">${e.beds} beds</span>
      </div>
    </div>

    <div class="center-details space-y-1 mb-4">
      <p class="address text-sm">📍 ${e.address}</p>
      <p class="phone text-sm">📞 ${e.emergency||e.phone}</p>
      ${r.length>0?`<div class="capabilities text-xs text-gray-600 dark:text-gray-400 italic">${r.join(" • ")}</div>`:""}
    </div>

    <div class="center-actions flex gap-3">
      <button 
        class="call-button flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
        text-white text-sm font-semibold py-2 rounded-md shadow-md transition-transform transform hover:scale-[1.03]" 
        data-phone="${e.emergency||e.phone}">
        📞 Call
      </button>
      <button 
        class="directions-button flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
        text-white text-sm font-semibold py-2 rounded-md shadow-md transition-transform transform hover:scale-[1.03]" 
        data-lat="${e.coordinates.lat}" 
        data-lng="${e.coordinates.lng}">
        🧭 Directions
      </button>
    </div>
  `,n}function _(e){const o=e.querySelectorAll(".call-button"),t=e.querySelectorAll(".directions-button");o.forEach(n=>{n.addEventListener("click",()=>{const{phone:r}=n.dataset;r&&window.open(`tel:${r}`)})}),t.forEach(n=>{n.addEventListener("click",()=>{const{lat:r}=n.dataset,{lng:a}=n.dataset;r&&a&&window.open(`https://maps.google.com/maps?daddr=${r},${a}`,"_blank")})})}function $(e,o){try{E(o,`
      <div class="location-error">
        <p>⚠️ ${e}</p>
        <p><small>${l("tryManualEntry")}</small></p>
      </div>
    `)}catch(t){o.textContent=`Error: ${e}. ${l("tryManualEntry")||"Try manual entry"}`,console.error("Sanitization failed:",t)}}function j(e){if(!e||e<=0)return`
      <div class="volume-circle text-center" data-volume="0">
        <div class="volume-number">0<span> ml</span></div>
        <canvas class="volume-canvas" width="120" height="120"></canvas>
      </div>
    `;const o=H(e),t=`volume-canvas-${Math.random().toString(36).substr(2,9)}`;return`
    <div class="volume-circle text-center" data-volume="${e}">
      <div class="volume-number">${o}</div>
      <canvas id="${t}" class="volume-canvas" 
              data-volume="${e}" data-canvas-id="${t}"></canvas>
    </div>
  `}function K(){document.querySelectorAll(".volume-canvas").forEach(o=>{const t=o.offsetWidth||120,n=o.offsetHeight||120;o.width=t,o.height=n;const r=parseFloat(o.dataset.volume)||0;r>0&&W(o,r)})}function W(e,o){const t=e.getContext("2d"),n=e.width/2,r=e.height/2,a=e.width*.45;let d=0,g=!0;const y=document.body.classList.contains("dark-mode")||window.matchMedia("(prefers-color-scheme: dark)").matches;function i(){g&&(t.clearRect(0,0,e.width,e.height),m())}function m(){const p=Math.min(o/80,.9)*(a*1.8),b=r+a-4-p;if(o>0){t.save(),t.beginPath(),t.arc(n,r,a-4,0,Math.PI*2),t.clip(),t.fillStyle="#dc2626",t.globalAlpha=.7,t.fillRect(0,b+5,e.width,e.height),t.globalAlpha=.9,t.fillStyle="#dc2626",t.beginPath();const v=n-a+4;t.moveTo(v,b);for(let u=v;u<=n+a-4;u+=2){const S=Math.sin(u*.05+d*.08)*3,M=Math.sin(u*.08+d*.12+1)*2,s=b+S+M;t.lineTo(u,s)}t.lineTo(n+a-4,e.height),t.lineTo(v,e.height),t.closePath(),t.fill(),t.restore()}const c=getComputedStyle(document.documentElement).getPropertyValue("--text-secondary").trim()||(y?"#8899a6":"#6c757d");t.strokeStyle=c,t.lineWidth=8,t.globalAlpha=.4,t.beginPath(),t.arc(n,r,a,0,Math.PI*2),t.stroke(),t.globalAlpha=1;const L=Math.min(o/100,1),f=getComputedStyle(document.documentElement).getPropertyValue("--danger-color").trim()||"#dc2626";t.strokeStyle=f,t.lineWidth=8,t.setLineDash([]),t.lineCap="round",t.beginPath(),t.arc(n,r,a,-Math.PI/2,-Math.PI/2+L*2*Math.PI),t.stroke(),d+=1,o>0&&requestAnimationFrame(i)}i();const h=new MutationObserver(()=>{document.contains(e)||(g=!1,h.disconnect())});h.observe(document.body,{childList:!0,subtree:!0})}export{j as a,z as b,K as i,q as r};
//# sourceMappingURL=ui-components-CSDtpZid.js.map

import{t as c,R as W,C as z,c as I,d as A}from"./index-DIpsYUXh.js";import{s as f}from"./enterprise-features-BG9OW9_4.js";import{f as O}from"./prediction-models-D4Bj5_qH.js";function K(e){return`
    <div class="bg-gray-800 text-white rounded-lg shadow-lg p-6 stroke-center-section">
      <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
        🏥 ${c("nearestCentersTitle")}
      </h3>

      <div id="locationContainer" class="space-y-4">
        
        <!-- Location Controls -->
        <div class="flex flex-wrap items-center gap-3">
          <button 
            type="button" 
            id="useGpsButton" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition"
          >
            📍 ${c("useCurrentLocation")}
          </button>

          <button 
            type="button" 
            id="manualLocationButton" 
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-medium transition"
          >
            ✏️ ${c("enterManually")}
          </button>
        </div>

        <!-- Manual Location Input -->
        <div class="location-manual hidden flex gap-2">
          <input 
            type="text" 
            id="locationInput" 
            class="flex-1 px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="${c("enterLocationPlaceholder")||"e.g. München, Köln, Stuttgart, or 48.1351, 11.5820"}"
          />
          <button 
            type="button" 
            id="searchLocationButton" 
            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition"
          >
            ${c("search")}
          </button>
        </div>

        <!-- Results -->
        <div 
          id="strokeCenterResults" 
          class="stroke-center-results mt-4 space-y-3"
        ></div>
      </div>
    </div>
  `;}function X(e){console.log("[StrokeMap] Initializing stroke center map with results:",e);const a=document.getElementById("useGpsButton"),t=document.getElementById("manualLocationButton"),n=document.querySelector(".location-manual"),i=document.getElementById("locationInput"),o=document.getElementById("searchLocationButton"),r=document.getElementById("strokeCenterResults");console.log("[StrokeMap] Found elements:",{useGpsButton:!!a,manualLocationButton:!!t,locationManual:!!n,locationInput:!!i,searchLocationButton:!!o,resultsContainer:!!r}),a&&a.addEventListener("click",()=>{G(e,r);}),t&&t.addEventListener("click",()=>{n.style.display=n.style.display==="none"?"block":"none";}),o&&o.addEventListener("click",()=>{const m=i.value.trim();m&&P(m,e,r);}),i&&i.addEventListener("keypress",m=>{if(m.key==="Enter"){const u=i.value.trim();u&&P(u,e,r);}});}function G(e,a){if(!navigator.geolocation){w(c("geolocationNotSupported"),a);return;}try{f(a,`<div class="loading">${c("gettingLocation")}...</div>`);}catch(t){a.textContent="Getting location...",console.error("Sanitization failed:",t);}navigator.geolocation.getCurrentPosition(t=>{const{latitude:n,longitude:i}=t.coords;F(n,i,e,a);},t=>{let n=c("locationError");switch(t.code){case t.PERMISSION_DENIED:n=c("locationPermissionDenied");break;case t.POSITION_UNAVAILABLE:n=c("locationUnavailable");break;case t.TIMEOUT:n=c("locationTimeout");break;}w(n,a);},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5});}async function P(e,a,t){try{f(t,`<div class="loading">${c("searchingLocation")}...</div>`);}catch(o){t.textContent="Searching location...",console.error("Sanitization failed:",o);}const n=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,i=e.trim().match(n);if(i){const o=parseFloat(i[1]),r=parseFloat(i[2]);if(o>=47.2&&o<=52.5&&r>=5.9&&r<=15){try{f(t,`
          <div class="location-success">
            <p>📍 Coordinates: ${o.toFixed(4)}, ${r.toFixed(4)}</p>
          </div>
        `);}catch(m){t.textContent=`Coordinates: ${o.toFixed(4)}, ${r.toFixed(4)}`,console.error("Sanitization failed:",m);}setTimeout(()=>{F(o,r,a,t);},500);return;}w("Coordinates appear to be outside Germany. Please check the values.",t);return;}try{let o=e.trim();!o.toLowerCase().includes("deutschland")&&!o.toLowerCase().includes("germany")&&!o.toLowerCase().includes("bayern")&&!o.toLowerCase().includes("bavaria")&&!o.toLowerCase().includes("nordrhein")&&!o.toLowerCase().includes("baden")&&(o+=", Deutschland");const m=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(o)}&countrycodes=de&format=json&limit=3&addressdetails=1`,u=await fetch(m,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!u.ok)throw new Error(`Geocoding API error: ${u.status}`);const g=await u.json();if(g&&g.length>0){let y=g[0];const b=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];for(const p of g)if(p.address&&b.includes(p.address.state)){y=p;break;}const $=parseFloat(y.lat),k=parseFloat(y.lon),x=y.display_name||e;try{f(t,`
          <div class="location-success">
            <p>📍 Found: ${x}</p>
            <small style="color: #666;">Lat: ${$.toFixed(4)}, Lng: ${k.toFixed(4)}</small>
          </div>
        `);}catch(p){t.textContent=`Found: ${x} (${$.toFixed(4)}, ${k.toFixed(4)})`,console.error("Sanitization failed:",p);}setTimeout(()=>{F($,k,a,t);},1e3);}else w(`
        <strong>Location "${e}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,t);}catch(o){w(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,t);}}async function F(e,a,t,n){var m,u,g,y,b,$,k,x,p;const i={lat:e,lng:a},o=W.routePatient({location:i,ichProbability:((m=t==null?void 0:t.ich)==null?void 0:m.probability)||0,timeFromOnset:(t==null?void 0:t.timeFromOnset)||null,clinicalFactors:(t==null?void 0:t.clinicalFactors)||{}});if(!o||!o.destination){try{f(n,`
        <div class="location-error">
          <p>⚠️ No suitable stroke centers found in this area.</p>
          <p><small>Please try a different location or contact emergency services directly.</small></p>
        </div>
      `);}catch(h){n.textContent="No suitable stroke centers found in this area. Please try a different location or contact emergency services directly.",console.error("Sanitization failed:",h);}return;}const r=U(o,t);try{f(n,`
      <div class="location-info">
        <p><strong>${c("yourLocation")}:</strong> ${e.toFixed(4)}, ${a.toFixed(4)}</p>
        <p><strong>Detected State:</strong> ${C(o.state)}</p>
      </div>
      <div class="loading">${c("calculatingTravelTimes")}...</div>
    `);}catch(h){n.textContent=`Your Location: ${e.toFixed(4)}, ${a.toFixed(4)}. Calculating travel times...`,console.error("Sanitization failed:",h);}try{const h=z[o.state],L=[...h.neurosurgicalCenters,...h.comprehensiveStrokeCenters,...h.regionalStrokeUnits,...h.thrombolysisHospitals||[]],{destination:d}=o;d.distance=I(e,a,d.coordinates.lat,d.coordinates.lng);try{const s=await A(e,a,d.coordinates.lat,d.coordinates.lng);d.travelTime=s.duration,d.travelSource=s.source;}catch(s){d.travelTime=Math.round(d.distance/.8),d.travelSource="estimated";}const l=L.filter(s=>s.id!==d.id).map(s=>({...s,distance:I(e,a,s.coordinates.lat,s.coordinates.lng)})).sort((s,v)=>s.distance-v.distance).slice(0,3);console.log("🏥 Stroke Center Debug:",{primaryDestination:d.name,alternativesCount:l.length,alternativeNames:l.map(s=>s.name),allHospitalsCount:L.length,routingState:o.state});for(const s of l)try{const v=await A(e,a,s.coordinates.lat,s.coordinates.lng);s.travelTime=v.duration,s.travelSource=v.source;}catch(v){s.travelTime=Math.round(s.distance/.8),s.travelSource="estimated";}const E=`
      <div class="location-info">
        <p><strong>${c("yourLocation")}:</strong> ${e.toFixed(4)}, ${a.toFixed(4)}</p>
        <p><strong>State:</strong> ${C(o.state)}</p>
        ${r}
      </div>
      
      <div class="recommended-centers">
        <h4>🏥 ${o.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination</h4>
        ${B(d,!0,o)}
      </div>
      
      ${l.length>0?`
        <div class="alternative-centers">
          <h4>Alternative Centers</h4>
          ${l.map(s=>B(s,!1,o)).join("")}
        </div>
      `:""}
      
      <div class="travel-time-note">
        <small>${c("travelTimeNote")||"Travel times estimated for emergency vehicles"}</small>
      </div>
    `;try{n.innerHTML="";const s=document.createElement("div");s.className="stroke-center-enhanced";const v=document.createElement("div");v.className="location-info",v.innerHTML=`
        <p><strong>Your Location:</strong> ${e.toFixed(4)}, ${a.toFixed(4)}</p>
        <p><strong>State:</strong> ${C(o.state)}</p>
        ${r}
      `,s.appendChild(v);const T=document.createElement("div");T.className="recommended-centers",T.innerHTML=`<h4>🏥 ${o.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination</h4>`;const D=N(d,!0,o);if(T.appendChild(D),s.appendChild(T),l.length>0){const M=document.createElement("div");M.className="alternative-centers",M.innerHTML="<h4>Alternative Centers</h4>",l.forEach(R=>{const H=N(R,!1,o);M.appendChild(H);}),s.appendChild(M);}const S=document.createElement("div");S.className="travel-time-note",S.innerHTML="<small>Travel times estimated for emergency vehicles</small>",s.appendChild(S),n.appendChild(s),V(n);}catch(s){console.error("🚨 Stroke Center Display Error:",s),n.innerHTML=`
        <div class="stroke-center-fallback">
          <h4>🏥 Recommended Center</h4>
          <p><strong>${((u=o==null?void 0:o.destination)==null?void 0:u.name)||"Unknown Hospital"}</strong></p>
          <p>📍 ${((g=o==null?void 0:o.destination)==null?void 0:g.address)||"Address not available"}</p>
          <p>📞 ${((y=o==null?void 0:o.destination)==null?void 0:y.emergency)||((b=o==null?void 0:o.destination)==null?void 0:b.phone)||"Phone not available"}</p>
          <p>📏 Distance: ${((k=($=o==null?void 0:o.destination)==null?void 0:$.distance)==null?void 0:k.toFixed(1))||"?"} km</p>
          ${(l==null?void 0:l.length)>0?`<p><strong>+ ${l.length} alternative centers nearby</strong></p>`:""}
        </div>
      `;}}catch(h){try{f(n,`
        <div class="location-info">
          <p><strong>${c("yourLocation")}:</strong> ${e.toFixed(4)}, ${a.toFixed(4)}</p>
          ${r}
        </div>

        <div class="recommended-centers">
          <h4>Recommended Center</h4>
          <div class="stroke-center-card recommended">
            <div class="center-header">
              <h5>${o.destination.name}</h5>
              <span class="distance">${((x=o.destination.distance)==null?void 0:x.toFixed(1))||"?"} km</span>
            </div>
            <div class="center-details">
              <p class="address">📍 ${o.destination.address}</p>
              <p class="phone">📞 ${o.destination.emergency||o.destination.phone}</p>
            </div>
          </div>
        </div>

        <div class="routing-reasoning">
          <p><strong>Routing Logic:</strong> ${o.reasoning}</p>
        </div>
      `);}catch(L){n.textContent=`Your Location: ${e.toFixed(4)}, ${a.toFixed(4)}. Recommended Center: ${o.destination.name} - ${((p=o.destination.distance)==null?void 0:p.toFixed(1))||"?"} km`,console.error("Sanitization failed:",L);}}}function C(e){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[e]||e;}function U(e,a){var i;const t=Math.round((((i=a==null?void 0:a.ich)==null?void 0:i.probability)||0)*100);let n="🏥";return e.urgency==="IMMEDIATE"?n="🚨":e.urgency==="TIME_CRITICAL"?n="⏰":e.urgency==="URGENT"&&(n="⚠️"),`
    <div class="routing-explanation ${e.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${n} ${e.category.replace("_"," ")} - ${e.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${t}% ${e.threshold?`(${e.threshold})`:""}</p>
        ${e.timeWindow?`<p><strong>Time Window:</strong> ${e.timeWindow}</p>`:""}
        <p><strong>Routing Logic:</strong> ${e.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${e.preAlert}</p>
        ${e.bypassLocal?"<p class=\"bypass-warning\">⚠️ Bypassing local hospitals</p>":""}
      </div>
    </div>
  `;}function B(e,a,t){const n=[];e.neurosurgery&&n.push("🧠 Neurosurgery"),e.thrombectomy&&n.push("🩸 Thrombectomy"),e.thrombolysis&&n.push("💉 Thrombolysis");const i=e.network?`<span class="network-badge">${e.network}</span>`:"";return`
    <div class="stroke-center-card ${a?"recommended":"alternative"} enhanced">
      <div class="center-header">
        <h5>${e.name}</h5>
        <div class="center-badges">
          ${e.neurosurgery?"<span class=\"capability-badge neurosurgery\">NS</span>":""}
          ${e.thrombectomy?"<span class=\"capability-badge thrombectomy\">TE</span>":""}
          ${i}
        </div>
      </div>
      
      <div class="center-metrics">
        ${e.travelTime?`
          <div class="travel-info">
            <span class="travel-time">${e.travelTime} min</span>
            <span class="distance">${e.distance.toFixed(1)} km</span>
          </div>
        `:`
          <div class="distance-only">
            <span class="distance">${e.distance.toFixed(1)} km</span>
          </div>
        `}
        <div class="bed-info">
          <span class="beds">${e.beds} beds</span>
        </div>
      </div>
      
      <div class="center-details">
        <p class="address">📍 ${e.address}</p>
        <p class="phone">📞 ${e.emergency||e.phone}</p>
        
        ${n.length>0?`
          <div class="capabilities">
            ${n.join(" • ")}
          </div>
        `:""}
      </div>
      
      <div class="center-actions">
        <button class="call-button" data-phone="${e.emergency||e.phone}">
          📞 Call
        </button>
        <button class="directions-button" data-lat="${e.coordinates.lat}" data-lng="${e.coordinates.lng}">
          🧭 Directions
        </button>
      </div>
    </div>
  `;}function N(e,a,t){const n=document.createElement("div");n.className=`stroke-center-card ${a?"recommended":"alternative"} enhanced`;const i=[];e.neurosurgery&&i.push("🧠 Neurosurgery"),e.thrombectomy&&i.push("🩸 Thrombectomy"),e.thrombolysis&&i.push("💉 Thrombolysis");const o=e.network?`<span class="network-badge">${e.network}</span>`:"";return n.innerHTML=`
    <div class="center-header">
      <h5>${e.name}</h5>
      <div class="center-badges">
        ${e.neurosurgery?"<span class=\"capability-badge neurosurgery\">NS</span>":""}
        ${e.thrombectomy?"<span class=\"capability-badge thrombectomy\">TE</span>":""}
        ${o}
      </div>
    </div>

    <div class="center-metrics">
      ${e.travelTime?`
        <div class="travel-info">
          <span class="travel-time">${e.travelTime} min</span>
          <span class="distance">${e.distance.toFixed(1)} km</span>
        </div>
      `:`
        <div class="distance-only">
          <span class="distance">${e.distance.toFixed(1)} km</span>
        </div>
      `}
      <div class="bed-info">
        <span class="beds">${e.beds} beds</span>
      </div>
    </div>

    <div class="center-details">
      <p class="address">📍 ${e.address}</p>
      <p class="phone">📞 ${e.emergency||e.phone}</p>

      ${i.length>0?`
        <div class="capabilities">
          ${i.join(" • ")}
        </div>
      `:""}
    </div>

    <div class="center-actions">
      <button class="call-button" data-phone="${e.emergency||e.phone}">
        📞 Call
      </button>
      <button class="directions-button" data-lat="${e.coordinates.lat}" data-lng="${e.coordinates.lng}">
        🧭 Directions
      </button>
    </div>
  `,n;}function V(e){const a=e.querySelectorAll(".call-button"),t=e.querySelectorAll(".directions-button");a.forEach(n=>{n.addEventListener("click",()=>{const{phone:i}=n.dataset;i&&window.open(`tel:${i}`);});}),t.forEach(n=>{n.addEventListener("click",()=>{const{lat:i}=n.dataset,{lng:o}=n.dataset;i&&o&&window.open(`https://maps.google.com/maps?daddr=${i},${o}`,"_blank");});});}function w(e,a){try{f(a,`
      <div class="location-error">
        <p>⚠️ ${e}</p>
        <p><small>${c("tryManualEntry")}</small></p>
      </div>
    `);}catch(t){a.textContent=`Error: ${e}. ${c("tryManualEntry")||"Try manual entry"}`,console.error("Sanitization failed:",t);}}function J(e){if(!e||e<=0)return`
      <div class="volume-circle" data-volume="0">
        <div class="volume-number">0<span> ml</span></div>
        <canvas class="volume-canvas" width="120" height="120"></canvas>
      </div>
    `;const a=O(e),t=`volume-canvas-${Math.random().toString(36).substr(2,9)}`;return`
    <div class="volume-circle" data-volume="${e}">
      <div class="volume-number">${a}</div>
      <canvas id="${t}" class="volume-canvas" 
              data-volume="${e}" data-canvas-id="${t}"></canvas>
    </div>
  `;}function Q(){document.querySelectorAll(".volume-canvas").forEach(a=>{const t=a.offsetWidth||120,n=a.offsetHeight||120;a.width=t,a.height=n;const i=parseFloat(a.dataset.volume)||0;i>0&&_(a,i);});}function _(e,a){const t=e.getContext("2d"),n=e.width/2,i=e.height/2,o=e.width*.45;let r=0,m=!0;const u=document.body.classList.contains("dark-mode")||window.matchMedia("(prefers-color-scheme: dark)").matches;function g(){m&&(t.clearRect(0,0,e.width,e.height),y());}function y(){const x=Math.min(a/80,.9)*(o*1.8),p=i+o-4-x;if(a>0){t.save(),t.beginPath(),t.arc(n,i,o-4,0,Math.PI*2),t.clip(),t.fillStyle="#dc2626",t.globalAlpha=.7,t.fillRect(0,p+5,e.width,e.height),t.globalAlpha=.9,t.fillStyle="#dc2626",t.beginPath();const l=n-o+4;t.moveTo(l,p);for(let E=l;E<=n+o-4;E+=2){const s=Math.sin(E*.05+r*.08)*3,v=Math.sin(E*.08+r*.12+1)*2,T=p+s+v;t.lineTo(E,T);}t.lineTo(n+o-4,e.height),t.lineTo(l,e.height),t.closePath(),t.fill(),t.restore();}const h=getComputedStyle(document.documentElement).getPropertyValue("--text-secondary").trim()||(u?"#8899a6":"#6c757d");t.strokeStyle=h,t.lineWidth=8,t.globalAlpha=.4,t.beginPath(),t.arc(n,i,o,0,Math.PI*2),t.stroke(),t.globalAlpha=1;const L=Math.min(a/100,1),d=getComputedStyle(document.documentElement).getPropertyValue("--danger-color").trim()||"#dc2626";t.strokeStyle=d,t.lineWidth=8,t.setLineDash([]),t.lineCap="round",t.beginPath(),t.arc(n,i,o,-Math.PI/2,-Math.PI/2+L*2*Math.PI),t.stroke(),r+=1,a>0&&requestAnimationFrame(g);}g();const b=new MutationObserver(()=>{document.contains(e)||(m=!1,b.disconnect());});b.observe(document.body,{childList:!0,subtree:!0});}export{J as a,X as b,Q as i,K as r};
//# sourceMappingURL=ui-components-BtD-M0jc.js.map

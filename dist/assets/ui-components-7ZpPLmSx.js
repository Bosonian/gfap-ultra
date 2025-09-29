import{t as c,R as W,C as z,c as I,d as A}from"./index-Bit76uuZ.js";import{s as $}from"./enterprise-features-ncLtjavc.js";import{f as O}from"./prediction-models-D2ZFDgZw.js";function K(e){return`
    <div class="stroke-center-section">
      <h3>🏥 ${c("nearestCentersTitle")}</h3>
      <div id="locationContainer">
        <div class="location-controls">
          <button type="button" id="useGpsButton" class="secondary">
            📍 ${c("useCurrentLocation")}
          </button>
          <div class="location-manual" style="display: none;">
            <input type="text" id="locationInput" placeholder="${c("enterLocationPlaceholder")||"e.g. München, Köln, Stuttgart, or 48.1351, 11.5820"}" />
            <button type="button" id="searchLocationButton" class="secondary">${c("search")}</button>
          </div>
          <button type="button" id="manualLocationButton" class="secondary">
            ✏️ ${c("enterManually")}
          </button>
        </div>
        <div id="strokeCenterResults" class="stroke-center-results"></div>
      </div>
    </div>
  `}function X(e){console.log("[StrokeMap] Initializing stroke center map with results:",e);const n=document.getElementById("useGpsButton"),t=document.getElementById("manualLocationButton"),a=document.querySelector(".location-manual"),i=document.getElementById("locationInput"),o=document.getElementById("searchLocationButton"),r=document.getElementById("strokeCenterResults");console.log("[StrokeMap] Found elements:",{useGpsButton:!!n,manualLocationButton:!!t,locationManual:!!a,locationInput:!!i,searchLocationButton:!!o,resultsContainer:!!r}),n&&n.addEventListener("click",()=>{G(e,r)}),t&&t.addEventListener("click",()=>{a.style.display=a.style.display==="none"?"block":"none"}),o&&o.addEventListener("click",()=>{const m=i.value.trim();m&&P(m,e,r)}),i&&i.addEventListener("keypress",m=>{if(m.key==="Enter"){const h=i.value.trim();h&&P(h,e,r)}})}function G(e,n){if(!navigator.geolocation){M(c("geolocationNotSupported"),n);return}try{$(n,`<div class="loading">${c("gettingLocation")}...</div>`)}catch(t){n.textContent="Getting location...",console.error("Sanitization failed:",t)}navigator.geolocation.getCurrentPosition(t=>{const{latitude:a,longitude:i}=t.coords;F(a,i,e,n)},t=>{let a=c("locationError");switch(t.code){case t.PERMISSION_DENIED:a=c("locationPermissionDenied");break;case t.POSITION_UNAVAILABLE:a=c("locationUnavailable");break;case t.TIMEOUT:a=c("locationTimeout");break}M(a,n)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})}async function P(e,n,t){try{$(t,`<div class="loading">${c("searchingLocation")}...</div>`)}catch(o){t.textContent="Searching location...",console.error("Sanitization failed:",o)}const a=/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,i=e.trim().match(a);if(i){const o=parseFloat(i[1]),r=parseFloat(i[2]);if(o>=47.2&&o<=52.5&&r>=5.9&&r<=15){try{$(t,`
          <div class="location-success">
            <p>📍 Coordinates: ${o.toFixed(4)}, ${r.toFixed(4)}</p>
          </div>
        `)}catch(m){t.textContent=`Coordinates: ${o.toFixed(4)}, ${r.toFixed(4)}`,console.error("Sanitization failed:",m)}setTimeout(()=>{F(o,r,n,t)},500);return}M("Coordinates appear to be outside Germany. Please check the values.",t);return}try{let o=e.trim();!o.toLowerCase().includes("deutschland")&&!o.toLowerCase().includes("germany")&&!o.toLowerCase().includes("bayern")&&!o.toLowerCase().includes("bavaria")&&!o.toLowerCase().includes("nordrhein")&&!o.toLowerCase().includes("baden")&&(o+=", Deutschland");const m=`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(o)}&countrycodes=de&format=json&limit=3&addressdetails=1`,h=await fetch(m,{method:"GET",headers:{Accept:"application/json","User-Agent":"iGFAP-StrokeTriage/2.1.0"}});if(!h.ok)throw new Error(`Geocoding API error: ${h.status}`);const g=await h.json();if(g&&g.length>0){let y=g[0];const f=["Bayern","Baden-Württemberg","Nordrhein-Westfalen"];for(const p of g)if(p.address&&f.includes(p.address.state)){y=p;break}const b=parseFloat(y.lat),k=parseFloat(y.lon),L=y.display_name||e;try{$(t,`
          <div class="location-success">
            <p>📍 Found: ${L}</p>
            <small style="color: #666;">Lat: ${b.toFixed(4)}, Lng: ${k.toFixed(4)}</small>
          </div>
        `)}catch(p){t.textContent=`Found: ${L} (${b.toFixed(4)}, ${k.toFixed(4)})`,console.error("Sanitization failed:",p)}setTimeout(()=>{F(b,k,n,t)},1e3)}else M(`
        <strong>Location "${e}" not found.</strong><br>
        <small>Try:</small>
        <ul style="text-align: left; font-size: 0.9em; margin: 10px 0;">
          <li>City name: "München", "Köln", "Stuttgart"</li>
          <li>Address: "Marienplatz 1, München"</li>
          <li>Coordinates: "48.1351, 11.5820"</li>
        </ul>
      `,t)}catch(o){M(`
      <strong>Unable to search location.</strong><br>
      <small>Please try entering coordinates directly (e.g., "48.1351, 11.5820")</small>
    `,t)}}async function F(e,n,t,a){var m,h,g,y,f,b,k,L,p;const i={lat:e,lng:n},o=W.routePatient({location:i,ichProbability:((m=t==null?void 0:t.ich)==null?void 0:m.probability)||0,timeFromOnset:(t==null?void 0:t.timeFromOnset)||null,clinicalFactors:(t==null?void 0:t.clinicalFactors)||{}});if(!o||!o.destination){try{$(a,`
        <div class="location-error">
          <p>⚠️ No suitable stroke centers found in this area.</p>
          <p><small>Please try a different location or contact emergency services directly.</small></p>
        </div>
      `)}catch(u){a.textContent="No suitable stroke centers found in this area. Please try a different location or contact emergency services directly.",console.error("Sanitization failed:",u)}return}const r=U(o,t);try{$(a,`
      <div class="location-info">
        <p><strong>${c("yourLocation")}:</strong> ${e.toFixed(4)}, ${n.toFixed(4)}</p>
        <p><strong>Detected State:</strong> ${C(o.state)}</p>
      </div>
      <div class="loading">${c("calculatingTravelTimes")}...</div>
    `)}catch(u){a.textContent=`Your Location: ${e.toFixed(4)}, ${n.toFixed(4)}. Calculating travel times...`,console.error("Sanitization failed:",u)}try{const u=z[o.state],E=[...u.neurosurgicalCenters,...u.comprehensiveStrokeCenters,...u.regionalStrokeUnits,...u.thrombolysisHospitals||[]],{destination:d}=o;d.distance=I(e,n,d.coordinates.lat,d.coordinates.lng);try{const s=await A(e,n,d.coordinates.lat,d.coordinates.lng);d.travelTime=s.duration,d.travelSource=s.source}catch(s){d.travelTime=Math.round(d.distance/.8),d.travelSource="estimated"}const l=E.filter(s=>s.id!==d.id).map(s=>({...s,distance:I(e,n,s.coordinates.lat,s.coordinates.lng)})).sort((s,v)=>s.distance-v.distance).slice(0,3);console.log("🏥 Stroke Center Debug:",{primaryDestination:d.name,alternativesCount:l.length,alternativeNames:l.map(s=>s.name),allHospitalsCount:E.length,routingState:o.state});for(const s of l)try{const v=await A(e,n,s.coordinates.lat,s.coordinates.lng);s.travelTime=v.duration,s.travelSource=v.source}catch(v){s.travelTime=Math.round(s.distance/.8),s.travelSource="estimated"}const T=`
      <div class="location-info">
        <p><strong>${c("yourLocation")}:</strong> ${e.toFixed(4)}, ${n.toFixed(4)}</p>
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
    `;try{a.innerHTML="";const s=document.createElement("div");s.className="stroke-center-enhanced";const v=document.createElement("div");v.className="location-info",v.innerHTML=`
        <p><strong>Your Location:</strong> ${e.toFixed(4)}, ${n.toFixed(4)}</p>
        <p><strong>State:</strong> ${C(o.state)}</p>
        ${r}
      `,s.appendChild(v);const S=document.createElement("div");S.className="recommended-centers",S.innerHTML=`<h4>🏥 ${o.urgency==="IMMEDIATE"?"Emergency":"Recommended"} Destination</h4>`;const D=N(d,!0,o);if(S.appendChild(D),s.appendChild(S),l.length>0){const x=document.createElement("div");x.className="alternative-centers",x.innerHTML="<h4>Alternative Centers</h4>",l.forEach(R=>{const H=N(R,!1,o);x.appendChild(H)}),s.appendChild(x)}const w=document.createElement("div");w.className="travel-time-note",w.innerHTML="<small>Travel times estimated for emergency vehicles</small>",s.appendChild(w),a.appendChild(s),V(a)}catch(s){console.error("🚨 Stroke Center Display Error:",s),a.innerHTML=`
        <div class="stroke-center-fallback">
          <h4>🏥 Recommended Center</h4>
          <p><strong>${((h=o==null?void 0:o.destination)==null?void 0:h.name)||"Unknown Hospital"}</strong></p>
          <p>📍 ${((g=o==null?void 0:o.destination)==null?void 0:g.address)||"Address not available"}</p>
          <p>📞 ${((y=o==null?void 0:o.destination)==null?void 0:y.emergency)||((f=o==null?void 0:o.destination)==null?void 0:f.phone)||"Phone not available"}</p>
          <p>📏 Distance: ${((k=(b=o==null?void 0:o.destination)==null?void 0:b.distance)==null?void 0:k.toFixed(1))||"?"} km</p>
          ${(l==null?void 0:l.length)>0?`<p><strong>+ ${l.length} alternative centers nearby</strong></p>`:""}
        </div>
      `}}catch(u){try{$(a,`
        <div class="location-info">
          <p><strong>${c("yourLocation")}:</strong> ${e.toFixed(4)}, ${n.toFixed(4)}</p>
          ${r}
        </div>

        <div class="recommended-centers">
          <h4>Recommended Center</h4>
          <div class="stroke-center-card recommended">
            <div class="center-header">
              <h5>${o.destination.name}</h5>
              <span class="distance">${((L=o.destination.distance)==null?void 0:L.toFixed(1))||"?"} km</span>
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
      `)}catch(E){a.textContent=`Your Location: ${e.toFixed(4)}, ${n.toFixed(4)}. Recommended Center: ${o.destination.name} - ${((p=o.destination.distance)==null?void 0:p.toFixed(1))||"?"} km`,console.error("Sanitization failed:",E)}}}function C(e){return{bayern:"Bayern (Bavaria)",badenWuerttemberg:"Baden-Württemberg",nordrheinWestfalen:"Nordrhein-Westfalen (NRW)"}[e]||e}function U(e,n){var i;const t=Math.round((((i=n==null?void 0:n.ich)==null?void 0:i.probability)||0)*100);let a="🏥";return e.urgency==="IMMEDIATE"?a="🚨":e.urgency==="TIME_CRITICAL"?a="⏰":e.urgency==="URGENT"&&(a="⚠️"),`
    <div class="routing-explanation ${e.category.toLowerCase()}">
      <div class="routing-header">
        <strong>${a} ${e.category.replace("_"," ")} - ${e.urgency}</strong>
      </div>
      <div class="routing-details">
        <p><strong>ICH Risk:</strong> ${t}% ${e.threshold?`(${e.threshold})`:""}</p>
        ${e.timeWindow?`<p><strong>Time Window:</strong> ${e.timeWindow}</p>`:""}
        <p><strong>Routing Logic:</strong> ${e.reasoning}</p>
        <p><strong>Pre-Alert:</strong> ${e.preAlert}</p>
        ${e.bypassLocal?'<p class="bypass-warning">⚠️ Bypassing local hospitals</p>':""}
      </div>
    </div>
  `}function B(e,n,t){const a=[];e.neurosurgery&&a.push("🧠 Neurosurgery"),e.thrombectomy&&a.push("🩸 Thrombectomy"),e.thrombolysis&&a.push("💉 Thrombolysis");const i=e.network?`<span class="network-badge">${e.network}</span>`:"";return`
    <div class="stroke-center-card ${n?"recommended":"alternative"} enhanced">
      <div class="center-header">
        <h5>${e.name}</h5>
        <div class="center-badges">
          ${e.neurosurgery?'<span class="capability-badge neurosurgery">NS</span>':""}
          ${e.thrombectomy?'<span class="capability-badge thrombectomy">TE</span>':""}
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
        
        ${a.length>0?`
          <div class="capabilities">
            ${a.join(" • ")}
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
  `}function N(e,n,t){const a=document.createElement("div");a.className=`stroke-center-card ${n?"recommended":"alternative"} enhanced`;const i=[];e.neurosurgery&&i.push("🧠 Neurosurgery"),e.thrombectomy&&i.push("🩸 Thrombectomy"),e.thrombolysis&&i.push("💉 Thrombolysis");const o=e.network?`<span class="network-badge">${e.network}</span>`:"";return a.innerHTML=`
    <div class="center-header">
      <h5>${e.name}</h5>
      <div class="center-badges">
        ${e.neurosurgery?'<span class="capability-badge neurosurgery">NS</span>':""}
        ${e.thrombectomy?'<span class="capability-badge thrombectomy">TE</span>':""}
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
  `,a}function V(e){const n=e.querySelectorAll(".call-button"),t=e.querySelectorAll(".directions-button");n.forEach(a=>{a.addEventListener("click",()=>{const{phone:i}=a.dataset;i&&window.open(`tel:${i}`)})}),t.forEach(a=>{a.addEventListener("click",()=>{const{lat:i}=a.dataset,{lng:o}=a.dataset;i&&o&&window.open(`https://maps.google.com/maps?daddr=${i},${o}`,"_blank")})})}function M(e,n){try{$(n,`
      <div class="location-error">
        <p>⚠️ ${e}</p>
        <p><small>${c("tryManualEntry")}</small></p>
      </div>
    `)}catch(t){n.textContent=`Error: ${e}. ${c("tryManualEntry")||"Try manual entry"}`,console.error("Sanitization failed:",t)}}function J(e){if(!e||e<=0)return`
      <div class="volume-circle" data-volume="0">
        <div class="volume-number">0<span> ml</span></div>
        <canvas class="volume-canvas" width="120" height="120"></canvas>
      </div>
    `;const n=O(e),t=`volume-canvas-${Math.random().toString(36).substr(2,9)}`;return`
    <div class="volume-circle" data-volume="${e}">
      <div class="volume-number">${n}</div>
      <canvas id="${t}" class="volume-canvas" 
              data-volume="${e}" data-canvas-id="${t}"></canvas>
    </div>
  `}function Q(){document.querySelectorAll(".volume-canvas").forEach(n=>{const t=n.offsetWidth||120,a=n.offsetHeight||120;n.width=t,n.height=a;const i=parseFloat(n.dataset.volume)||0;i>0&&_(n,i)})}function _(e,n){const t=e.getContext("2d"),a=e.width/2,i=e.height/2,o=e.width*.45;let r=0,m=!0;const h=document.body.classList.contains("dark-mode")||window.matchMedia("(prefers-color-scheme: dark)").matches;function g(){m&&(t.clearRect(0,0,e.width,e.height),y())}function y(){const L=Math.min(n/80,.9)*(o*1.8),p=i+o-4-L;if(n>0){t.save(),t.beginPath(),t.arc(a,i,o-4,0,Math.PI*2),t.clip(),t.fillStyle="#dc2626",t.globalAlpha=.7,t.fillRect(0,p+5,e.width,e.height),t.globalAlpha=.9,t.fillStyle="#dc2626",t.beginPath();const l=a-o+4;t.moveTo(l,p);for(let T=l;T<=a+o-4;T+=2){const s=Math.sin(T*.05+r*.08)*3,v=Math.sin(T*.08+r*.12+1)*2,S=p+s+v;t.lineTo(T,S)}t.lineTo(a+o-4,e.height),t.lineTo(l,e.height),t.closePath(),t.fill(),t.restore()}const u=getComputedStyle(document.documentElement).getPropertyValue("--text-secondary").trim()||(h?"#8899a6":"#6c757d");t.strokeStyle=u,t.lineWidth=8,t.globalAlpha=.4,t.beginPath(),t.arc(a,i,o,0,Math.PI*2),t.stroke(),t.globalAlpha=1;const E=Math.min(n/100,1),d=getComputedStyle(document.documentElement).getPropertyValue("--danger-color").trim()||"#dc2626";t.strokeStyle=d,t.lineWidth=8,t.setLineDash([]),t.lineCap="round",t.beginPath(),t.arc(a,i,o,-Math.PI/2,-Math.PI/2+E*2*Math.PI),t.stroke(),r+=1,n>0&&requestAnimationFrame(g)}g();const f=new MutationObserver(()=>{document.contains(e)||(m=!1,f.disconnect())});f.observe(document.body,{childList:!0,subtree:!0})}export{J as a,X as b,Q as i,K as r};
//# sourceMappingURL=ui-components-7ZpPLmSx.js.map

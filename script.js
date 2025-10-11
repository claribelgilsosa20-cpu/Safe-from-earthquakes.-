// Create map
const map = L.map('map').setView([0,0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const alarm = document.getElementById('alarm');

// Fetch recent earthquakes (last 24h)
async function fetchEarthquakes() {
  const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      data.features.forEach(eq => {
        const [lon, lat] = eq.geometry.coordinates;
        const place = eq.properties.place;
        const magnitude = eq.properties.mag;

        // Color by magnitude
        let color = 'green';
        if (magnitude >= 3 && magnitude < 4) color = 'yellow';
        if (magnitude >= 4) color = 'red';

        // Marker icon
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background:${color};width:20px;height:20px;border-radius:50%;border:2px solid #fff;"></div>`,
          iconSize: [20,20]
        });

        const marker = L.marker([lat, lon], {icon: icon}).addTo(map);
        marker.bindPopup(`<b>Earthquake</b><br>${place}<br>Magnitude: ${magnitude}`);

        // Alarm and animation for strong earthquakes
        if (magnitude >= 4) {
          alarm.play();
          const markerDiv = marker._icon;
          if(markerDiv) markerDiv.classList.add('strong');
        }
      });

      // Center map on most recent earthquake
      const recent = data.features[0];
      const [lonR, latR] = recent.geometry.coordinates;
      map.setView([latR, lonR], 4);
    } else {
      alert("No recent earthquakes found.");
    }
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
  }
}

fetchEarthquakes();

// Buttons
document.getElementById("emergency").addEventListener("click", () => {
  alert("🚨 Calling emergency number... Stay calm and find a safe spot.");
});

document.getElementById("fireDept").addEventListener("click", () => {
  alert("🔥 Contacting nearest fire department...");
});// ======================
// Tsunami Alert Function
// ======================
function tsunamiAlert(lat, lon, location) {
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:blue;width:20px;height:20px;border-radius:50%;border:2px solid #fff;"></div>`,
    iconSize: [20,20]
  });
  const marker = L.marker([lat, lon], {icon: icon}).addTo(map);
  marker.bindPopup(`<b>Tsunami Alert</b><br>${location}`);
  tsunamiAlarm.play();
}

// Example tsunami alert (you can add more dynamically)
tsunamiAlert(35.6895, 139.6917, "Tokyo Coastal Area"); <<iframe
  src="https://huggingface.co/spaces/Claribelgilsosa23/Safe-from-earthquake-ai?iframe=true"
  width="100%"
  height="600"
  frameborder="0"
  title="Disaster AI Chatbot"
></iframe>
// Crear mapa
const map = L.map('map').setView([0,0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const alarma = document.getElementById('alarma');

// Función para obtener sismos recientes (últimas 24h)
async function obtenerSismos() {
  const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      data.features.forEach(sismo => {
        const [lon, lat] = sismo.geometry.coordinates;
        const lugar = sismo.properties.place;
        const magnitud = sismo.properties.mag;

        // Determinar color según magnitud
        let color = 'green';
        if (magnitud >= 3 && magnitud < 4) color = 'yellow';
        if (magnitud >= 4) color = 'red';

        // Crear icono circular de color
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background:${color};width:20px;height:20px;border-radius:50%;border:2px solid #fff;"></div>`,
          iconSize: [20,20]
        });

        // Agregar marcador
        const marker = L.marker([lat, lon], {icon: icon}).addTo(map);
        marker.bindPopup(`<b>Sismo</b><br>${lugar}<br>Magnitud: ${magnitud}`);

        // Si magnitud >= 4, sonar alarma y animar marcador
        if (magnitud >= 4) {
          alarma.play();
          const markerDiv = marker._icon;
          if(markerDiv) markerDiv.classList.add('fuerte');
        }
      });

      // Centrar mapa en el sismo más reciente
      const sismoReciente = data.features[0];
      const [lonR, latR] = sismoReciente.geometry.coordinates;
      map.setView([latR, lonR], 4);
    } else {
      alert("No se encontraron sismos recientes.");
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
}

obtenerSismos();

// Botones de alerta
document.getElementById("emergencia").addEventListener("click", () => {
  alert("🚨 Llamando al número de emergencia... Mantén la calma y busca un lugar seguro.");
});

document.getElementById("bomberos").addEventListener("click", () => {
  alert("🔥 Contactando con los bomberos más cercanos...");
});
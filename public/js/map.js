// map.js

  mapboxgl.accessToken = mapToken; 
  const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: coordinates, // Use the passed coordinates for centering
  zoom: 11,
});

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(coordinates)
.setPopup(new mapboxgl.Popup({offset:25}).setHTML("<hl>Exact location provided after booking</h1>"))

.addTo(map);



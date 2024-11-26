// Create the map
let map = L.map("map", {
    center: [44.97, -103.77],
    zoom: 5
});

// Create the title layer that will be the background of the map
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Load the Earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Get the data with d3
d3.json(url).then(function(data){
    console.log(data)

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  function circleMarker(feature, latlng){
    return L.circleMarker(latlng);
  }

  function style(feature){
    console.log(feature)
    return{
        color: "black",
        weight: 1,
        radius: feature.properties.mag*5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5
    };
  }

  let earthquakes = L.geoJSON(data.features, {
    onEachFeature: onEachFeature,
    pointToLayer: circleMarker,
    style: style 
  });

    earthquakes.addTo(map)

    // Set up legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function(){
        let div = L.DomUtil.create('div', 'info legend');
        const depths = [-10, 10, 30, 50, 70, 90];
 
        // Loop through depth ranges and create a label for each
        for (let i = 0; i < depths.length; i++){
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i]) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');               
        }
        return div;
    };
    legend.addTo(map)
});

// Color for depth ranges
function getColor(depth){
    return depth >= 90 ? "#033466":
           depth >= 70 ? "#0E5585" :
           depth >= 50 ? "#20699C" :
           depth >= 30 ? "#428BBA" :
           depth >= 10  ? "#5A9AC6" :
           "#7AB9DD";
}


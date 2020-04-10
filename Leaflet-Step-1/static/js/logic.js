var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

d3.json(queryURL, function(data) {
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) +"</p><hr><p>Magnitude: "+ feature.properties.mag+"</p>");
      }
    function radiusSize(magnitude) {
        return magnitude * 15000;
      }
      function circleColor(magnitude) {
        if (magnitude < 1) {
          return "#2ECC71"
        }
        else if (magnitude < 2) {
          return "#F1C40F"
        }
        else if (magnitude < 3) {
          return "#F39C12"
        }
        else if (magnitude < 4) {
          return "#E67E22"
        }
        else if (magnitude < 5) {
          return "#D35400"
        }
        else {
          return "##FF3C33"
        }
      }
      var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(earthquakeData, latlng) {
          return L.circle(latlng, {
            radius: radiusSize(earthquakeData.properties.mag),
            color: circleColor(earthquakeData.properties.mag),
            fillOpacity: 1
          });
        },
        onEachFeature: onEachFeature
      });
      createMap(earthquakes);
    }    

function createMap(earthquakes) {

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});


  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

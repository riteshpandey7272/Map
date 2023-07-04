var map = L.map('map').setView([20.5937, 78.9629], 4.5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

map.zoomControl.remove(); // remove the default zoom control
L.control.zoom({
  position: 'topright'
}).addTo(map);

var searchControl;
var originalMapHeight;

// Add a search box button
document.addEventListener('DOMContentLoaded', function () {
  searchControl = L.control({ position: 'topright' });
  searchControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'search-button-container');
    div.innerHTML = '<input type="text" id="searchInput" placeholder="Enter a location" style="height: 25px; width: 120px; border-radius: 5px 5px 5px 5px; border: 1px solid #000000;"> <button id="searchButton" style="height: 25px; border-radius: 5px 5px 5px 5px; border: 1px solid #000000; margin-right: 2px;">Search</button>';
    return div;
  }
  searchControl.addTo(map);

  originalMapHeight = document.getElementById('map').clientHeight;

  document.getElementById('searchButton').addEventListener('click', function () {
    performSearch();
  });

  document.getElementById('searchInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      performSearch();
    }
  });

  function performSearch() {
    var searchInput = document.getElementById('searchInput');
    var searchTerm = searchInput.value;
    if (searchTerm) {
      var matchedFeatures = locationLayer.getLayers().filter(function (layer) {
        return layer.feature.properties.name.toLowerCase() === searchTerm.toLowerCase();
      });
      if (matchedFeatures.length > 0) {
        map.flyTo(matchedFeatures[0].getLatLng(), 8);
        document.getElementById('main').style.display = 'block';
        map.getContainer().style.height = originalMapHeight / 1.35 + 'px';
        
        // Update "About" section for the searched location
        updateAboutSection(matchedFeatures[0].getLatLng());
      } else {
        alert('Location not found.');
        document.getElementById('main').style.display = 'none';
        map.getContainer().style.height = originalMapHeight + 'px';
      }
    }
  }

  function updateAboutSection(coordinates) {
    const lat = coordinates.lat;
    const lon = coordinates.lng;
    const apiKey = "7d3a8f1edb50267eca4ccdadb3d22f10";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const locationElement = document.getElementById("location");
        locationElement.textContent = `Current location: ${data.name}, ${data.sys.country}`;

        const sunriseElement = document.createElement("p");
        const sunriseTimestamp = data.sys.sunrise * 1000;
        const sunriseDate = new Date(sunriseTimestamp);
        sunriseElement.textContent = `Sunrise: ${sunriseDate.toLocaleTimeString()}`;
        locationElement.insertAdjacentElement("afterend", sunriseElement);

        const sunsetElement = document.createElement("p");
        const sunsetTimestamp = data.sys.sunset * 1000;
        const sunsetDate = new Date(sunsetTimestamp);
        sunsetElement.textContent = `Sunset: ${sunsetDate.toLocaleTimeString()}`;
        locationElement.insertAdjacentElement("afterend", sunsetElement);

        const duskElement = document.createElement("p");
        const duskTimestamp = data.sys.sunset * 1000 + 1800000;
        const duskDate = new Date(duskTimestamp);
        duskElement.textContent = `Dusk: ${duskDate.toLocaleTimeString()}`;
        locationElement.insertAdjacentElement("afterend", duskElement);

        const elevationElement = document.createElement("p");
        elevationElement.textContent = `Elevation: ${data.main.sea_level || data.main.grnd_level} m`;
        locationElement.insertAdjacentElement("afterend", elevationElement);
      })
      .catch(error => {
        console.error(error);
        const locationElement = document.getElementById("location");
        locationElement.textContent = "Failed to find location.";
      });
  }
});







// Temperature layer
var temperatureLayer = L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid={APIKEY}', {
  APIKEY: '7d3a8f1edb50267eca4ccdadb3d22f10',
  maxZoom: 19,
  opacity: 0.7
}).addTo(map);

// Pressure layer
var pressureLayer = L.tileLayer('https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid={APIKEY}', {
  APIKEY: '7d3a8f1edb50267eca4ccdadb3d22f10',
  maxZoom: 19,
  opacity: 0.7
});

// Create layer control
var baseLayers = {
  'Temperature': temperatureLayer,
  'Pressure': pressureLayer
};

L.control.layers(baseLayers).addTo(map);


// GeoJSON location data
var locationLayer = L.geoJSON([
  {
    "type": "Feature",
    "properties": {
      "name": "London"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        -0.1276,
        51.5074
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "New York"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        -74.0060,
        40.7128
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Andhra Pradesh"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        79.73999,
        15.9129
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Arunachal Pradesh"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        94.7278,
        28.2180
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Assam"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        92.9376,
        26.2006
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Bihar"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        85.3131,
        25.0961
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Goa"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        74.1240,
        15.2993
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Gujarat"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        71.1924,
        22.2587
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Haryana"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.0856,
        29.0588
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Himanchal Pradesh"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.1734,
        31.1048
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Jharkhand"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        85.2799,
        23.6102
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Chattishghar"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        81.8661,
        21.2787
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Karnataka"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        75.7139,
        15.3173
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Kerala"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.2711,
        10.8505
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Madhya Pradesh"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        78.6569,
        22.9734
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Maharashtra"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        75.7139,
        19.7515
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Manipur"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        93.9063,
        24.6637
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Meghalaya"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        91.3662,
        25.4670
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Mizoram"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        92.9376,
        23.1645
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Nagaland"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        94.5624,
        26.1584
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Odisha"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        85.0985,
        20.9517
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Panjab"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        75.3412,
        31.1471
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Rajasthan"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        74.2179,
        27.0238
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Sikkim"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        88.5122,
        27.5330
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Tamil Nadu"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        78.6569,
        11.1271
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Telangana"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        79.01193,
        18.1124
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Tripura"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        91.9882,
        23.9408
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Uttar Pradesh"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        80.9462,
        26.8467
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Uttarakhand"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        79.0193,
        30.0668
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "West Bengal"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        87.8550,
        22.9868
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Andaman & NIkobar Island"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        92.5000,
        10.7449
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Chandighar"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        76.7794,
        30.7333
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Dadar NAgar Hweli, Daman & diu"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.0169,
        20.1809
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Delhi"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.1025,
        28.7041
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Jammu & Kashmir"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        75.3412,
        33.2778
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Ladakh"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.5619,
        34.2268
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Lakshadweep Island"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        72.288333,
        10.288333
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Puducherry"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        79.8083,
        11.9416
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Noida"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        77.3910,
        28.5355
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Barodih"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        83.3402,
        25.7812
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Prayagraj"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        81.8463,
        25.4358
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Nepal"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        84.1240,
        28.3949
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Sri Lanka"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        80.7718,
        7.8731
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Bangladesh"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        90.3563,
        23.6850
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Pakistan"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        69.3451,
        30.3753
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Afganishtan"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        67.7100,
        33.9391
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "China"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        104.1954,
        35.8617
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Tibbat"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        91.1174,
        29.6472
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "maldivs"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        73.2207,
        3.2028
      ]
    }
  }

]).addTo(map);


locationLayer.addTo(map);


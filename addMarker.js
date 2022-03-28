let map;
let marker;
let geocoder;
let responseDiv;
let response;

function initMap() {
    const hall9 = { lat: 1.353, lng: 103.685 };
    const school = { lat: 1.346, lng: 103.681 };
    const middleSG = { lat: 1.352, lng: 103.813 };
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 11,
      center: middleSG,
      mapTypeControl: false,
    });
    geocoder = new google.maps.Geocoder();

    let addressToGeocode = "Blk 272A Punggol Walk";

    const image = {
        url: "https://www.clipartmax.com/png/full/95-954602_google-maps-marker-blue.png",
        scaledSize: new google.maps.Size(20,32),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0,32),
    };
    
    response = document.createElement("pre");
    response.id = "response";
    response.innerText = "";
    responseDiv = document.createElement("div");
    responseDiv.id = "response-container";
    responseDiv.appendChild(response);

    marker = new google.maps.Marker({
    	map,
    });
    
    new google.maps.Marker({
      position: hall9,
      map,
      title: "Hall 9",
    });

    new google.maps.Marker({
        position: school,
        map,
        icon: image,
        title: "SCSE",
    });
    
    geocode({ address: addressToGeocode });
    clear();
}

function clear() {
    marker.setMap(null);
    responseDiv.style.display = "none";
}

function geocode(request) {
    clear();
    geocoder
        .geocode(request)
        .then((result) => {
            const { results } = result;

			console.log(results[0]);
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            marker.setMap(map);
            responseDiv.style.display = "block";
            response.innerText = JSON.stringify(result, null, 2);
            return results;
        })
        .catch((e) => {
            alert("Geocode was not successful for the following reason: " + e);
        });
}

/*let map;
let marker;
let geocoder;
let responseDiv;
let response;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11.5,
    center: { lat: 1.352, lng: 103.813 },
    mapTypeControl: false,
  });
  geocoder = new google.maps.Geocoder();
  
  new google.maps.Marker({
      position: { lat: 1.353, lng: 103.685 },
      map,
      title: "Hall 9",
    });

  //const inputText = document.createElement("input");

  //inputText.type = "text";
  //inputText.placeholder = "Enter a location";

  //const submitButton = document.createElement("input");

  //submitButton.type = "button";
  //submitButton.value = "Geocode";
  //submitButton.classList.add("button", "button-primary");

  //const clearButton = document.createElement("input");

  //clearButton.type = "button";
  //clearButton.value = "Clear";
  //clearButton.classList.add("button", "button-secondary");
  response = document.createElement("pre");
  response.id = "response";
  response.innerText = "";
  responseDiv = document.createElement("div");
  responseDiv.id = "response-container";
  responseDiv.appendChild(response);

  //const instructionsElement = document.createElement("p");

  //instructionsElement.id = "instructions";
  /*instructionsElement.innerHTML =
    "<strong>Instructions</strong>: Enter an address in the textbox to geocode or click on the map to reverse geocode.";
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);*/
  /*marker = new google.maps.Marker({
    map,
  });
  //map.addListener("click", (e) => {
    //geocode({ location: e.latLng });
  //});
  //submitButton.addEventListener("click", () =>
  geocode({ address: "Blk 272A Punggol Walk" });
  //);
  //clearButton.addEventListener("click", () => {
    //clear();
  //});
  clear();
}

function clear() {
  marker.setMap(null);
  responseDiv.style.display = "none";
}

function geocode(request) {
  clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;
        console.log(results[0]);
      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      responseDiv.style.display = "block";
      response.innerText = JSON.stringify(result, null, 2);
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}*/
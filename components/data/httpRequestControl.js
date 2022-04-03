const SERVER_IP_PORT = "http://localhost:5000";

export function loadData(endpoint, data) {
  let address = SERVER_IP_PORT + endpoint + "?";
  Object.entries(data).forEach((entry, value) => {
    if (value !== 0) {
      address += "&";
    }
    address += entry[0];
    address += "=";
    address += encodeURIComponent(entry[1]);
  });

  return fetch(address);
}

// fetch("http://localhost:5000/api/v1/lookup?block=1&street_name=beach rd&flatType=3-room")
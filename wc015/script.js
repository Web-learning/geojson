const map = L.map("map").setView([-33.4, 18.5], 9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);

// Load the external JSON file
fetch("wc015.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Could not load locations.json: ${response.status}`);
    }
    return response.json();
  })
  .then(locations => {
    const markers = locations.map(place => {
      const marker = L.marker(place.coords).addTo(map);

      // Popup content
      const popup = document.createElement("div");
      popup.className = "place-popup";

      const title = document.createElement("h3");
      title.textContent = place.name;
      popup.appendChild(title);

      const divider = document.createElement("hr");
      popup.appendChild(divider);

      const address = document.createElement("p");
      const addressLabel = document.createElement("strong");
      addressLabel.textContent = "Coordinates: ";
      address.append(addressLabel, document.createTextNode(place.address));
      popup.appendChild(address);

      const linkParagraph = document.createElement("p");
      const link = document.createElement("a");
      link.href = place.wikipedia;
      link.textContent = "Read on Wikipedia";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      linkParagraph.appendChild(link);
      popup.appendChild(linkParagraph);

      marker.bindPopup(popup);

      // Permanent location label
      marker.bindTooltip(place.name, {
        permanent: true,
        direction: "top",
        offset: [0, -10]
      });

      return marker;
    });

    if (markers.length) {
      map.fitBounds(L.featureGroup(markers).getBounds(), {
        padding: [40, 40],
        maxZoom: 12
      });
    }
  })
  .catch(error => {
    console.error("Error loading map locations:", error);
    document.getElementById("map").insertAdjacentHTML(
      "afterend",
      '<p class="map-error">Unable to load locations. Check the JSON URL and hosting settings.</p>'
    );
  });

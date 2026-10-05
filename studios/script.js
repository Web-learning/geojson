// ========================================
// ARCHITECTURE PORTFOLIO MAP
// ========================================


// ----------------------------------------
// Map configuration
// ----------------------------------------
7
const MAP_CENTER = [-26.145278, 28.040556];

const map = L.map("map", {
  center: MAP_CENTER,
  zoom: 16,
  zoomControl: false,
  scrollWheelZoom: true
});


// ----------------------------------------
// Tile layer
// ----------------------------------------

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19
  }
).addTo(map);


// ----------------------------------------
// Zoom control
// ----------------------------------------

L.control.zoom({
  position: "bottomright"
}).addTo(map);


// ========================================
// PROJECT DATA
// ========================================

const projects = [

  {
    id: "baker-street",
    title: "Daffonchio Architects ",
    studio: "Studio Name",
    architect: "Principal Architect",
    year: "2024",
    category: "13",
    location: "Rosebank, Johannesburg",
    coordinates: [-26.14851, 28.03741],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Rosebank_Baker_St_Tree.jpg",
    description:
      "Enrico has an growing interest in an open-source approach to architecture. Moving from straight to cureved with parametric designs",

    link: "https://www.daffonchio.co.za/"
  },


  {
    id: "cradock-avenue",
    title: "Gass Architects",
    studio: "Gass Architects",
    architect: "Principal Architect",
    year: "Cradock Avenue",

    category: "21",

    location: "21 Cradock Avenue, Rosebank",

    coordinates: [
      -26.14537022797607,
      28.042095040615
    ],

    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/ae/Rosebank_Trees_in_Cradock_st.jpg",

    description:
      "Urban regeneration, Architecture and Interior architecture. Chat to Georg about the 2026 SAPOA Property Development Awards",

    link: "https://www.gass.co.za/"
  }

];


// ========================================
// ICONS
// ========================================

const iconStyles = {

  residential: {
    className: "map-pin map-pin--residential"
  },

  commercial: {
    className: "map-pin map-pin--commercial"
  },

  cultural: {
    className: "map-pin map-pin--cultural"
  },

  hospitality: {
    className: "map-pin map-pin--hospitality"
  }

};


function createIcon(category) {

  const style =
    iconStyles[category] ||
    iconStyles.residential;

  return L.divIcon({

    className: "",

    html: `
      <div
        class="${style.className}"
        aria-hidden="true"
      >
        <span></span>
      </div>
    `,

    iconSize: [32, 42],

    iconAnchor: [16, 42],

    popupAnchor: [0, -38]

  });

}


// ========================================
// POPUP
// ========================================

function createPopup(project) {

  return `
    <article class="project-popup">

      <div class="project-popup__image">
        <img
          src="${project.image}"
          alt="${project.title}"
          loading="lazy"
        >
      </div>

      <div class="project-popup__content">

        <div class="project-popup__meta">

          <span>
            ${project.category}
          </span>

          ${project.year
            ? `<span>${project.year}</span>`
            : ""
          }

        </div>

        <h2>
          ${project.title}
        </h2>

        <p class="project-popup__location">
          ${project.location}
        </p>

        ${
          project.description
            ? `<p class="project-popup__description">
                ${project.description}
              </p>`
            : ""
        }

        ${
          project.link
            ? `<a
                class="project-popup__link"
                href="${project.link}"
              >
                View website
                <span aria-hidden="true">↗</span>
              </a>`
            : ""
        }

      </div>

    </article>
  `;
}


// ========================================
// MARKERS
// ========================================

const markerLayer = L.layerGroup().addTo(map);

const markerRegistry = new Map();


function createMarker(project) {

  const marker = L.marker(
    project.coordinates,
    {
      icon: createIcon(project.category),

      title: project.title,

      keyboard: true
    }
  );

  marker.bindPopup(
    createPopup(project),
    {
      maxWidth: 420,
      minWidth: 280,
      className: "portfolio-popup",
      closeButton: true,
      autoPan: true,
      autoPanPadding: [30, 30]
    }
  );

  marker.bindTooltip(
    project.title,
    {
      direction: "top",
      offset: [0, -36],
      opacity: 0.95
    }
  );

  marker.project = project;

  markerRegistry.set(project.id, marker);

  return marker;
}


// ========================================
// INITIALISE MARKERS
// ========================================

projects.forEach((project) => {

  const marker = createMarker(project);

  markerLayer.addLayer(marker);

});


// ========================================
// FILTERING
// ========================================

const filterButtons =
  document.querySelectorAll(".filter");

const projectCount =
  document.getElementById("projectCount");


function filterProjects(category) {

  markerLayer.clearLayers();

  const visibleProjects =
    category === "all"

      ? projects

      : projects.filter(
          project =>
            project.category === category
        );


  visibleProjects.forEach((project) => {

    const marker =
      markerRegistry.get(project.id);

    if (marker) {
      markerLayer.addLayer(marker);
    }

  });


  updateProjectCount(
    visibleProjects.length
  );


  // Fit map to filtered projects

  if (visibleProjects.length > 0) {

    const bounds =
      L.featureGroup(
        visibleProjects.map(
          project =>
            markerRegistry.get(project.id)
        )
      ).getBounds();

    map.fitBounds(bounds, {
      padding: getMapPadding(),
      maxZoom: 16
    });

  }

}


// ----------------------------------------
// Filter button interaction
// ----------------------------------------

filterButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      filterButtons.forEach(
        btn =>
          btn.classList.remove("active")
      );

      button.classList.add("active");

      filterProjects(
        button.dataset.filter
      );

    }
  );

});


// ========================================
// PROJECT COUNT
// ========================================

function updateProjectCount(count) {

  projectCount.textContent = count;

}


// ========================================
// RESPONSIVE MAP PADDING
// ========================================

function getMapPadding() {

  const isMobile =
    window.innerWidth < 768;

  return isMobile
    ? [30, 30]
    : [80, 80];

}


// ========================================
// MOBILE FILTER DRAWER
// ========================================

const mapToggle =
  document.querySelector(".map-toggle");

const mapFilters =
  document.querySelector(".map-filters");


mapToggle.addEventListener(
  "click",
  () => {

    const isOpen =
      mapFilters.classList.toggle("is-open");

    mapToggle.setAttribute(
      "aria-expanded",
      isOpen
    );

  }
);


// Close mobile filters after selection

filterButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      if (
        window.innerWidth < 768
      ) {

        mapFilters.classList.remove(
          "is-open"
        );

        mapToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }
  );

});


// ========================================
// MOBILE MAP BEHAVIOUR
// ========================================

function updateMapForViewport() {

  if (window.innerWidth < 768) {

    map.scrollWheelZoom.disable();

    map.touchZoom.enable();

    map.doubleClickZoom.enable();

  } else {

    map.scrollWheelZoom.enable();

  }

}


window.addEventListener(
  "resize",
  updateMapForViewport
);

updateMapForViewport();


// ========================================
// INITIAL STATE
// ========================================

updateProjectCount(
  projects.length
);


// Fit all projects

const initialBounds =
  L.featureGroup(
    projects.map(
      project =>
        markerRegistry.get(project.id)
    )
  ).getBounds();


map.fitBounds(
  initialBounds,
  {
    padding: getMapPadding(),
    maxZoom: 15
  }
);

<template>
  <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css" />
  <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.css" type="text/css">
  <div id="map"></div>

  <div class="mapview-container-style">
    <button class="measure-btn" @click="enableMeasure">Measure Distance</button>
    <button class="toggle-markers-btn" @click="toggleMarkers">{{ markersVisible ? 'Hide' : 'Show' }} Markers</button>
    <button class="undo-marker-btn" @click="undoMarker">Remove Marker</button>
    <button class="redo-marker-btn" @click="redoMarker">Reapply Change</button>
    <button class="save-btn" @click="saveChanges">Save Changes</button> 
    <button class="delete-data-btn save-btn" @click="clearData">Delete Data</button> 
  </div>

  <div v-if="showpopup" class="custom-popup">
    <div class="popup-inner">
      <div>
        <h5>Distance Measurement</h5>
        <span class="close-button">
          <img src="../../src/assets/images/remove.png" alt="Close" class="close-icon" @click="closePopup" />
        </span>
      </div>
      <div class="line"></div>
      <p class="distance-value">Kilometers: <span>{{ kilometer }} km</span></p>
      <p class="distance-value">Miles: <span>{{ miles }} mi</span></p>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { getDistance } from "geolib";
import mapboxGlDraw from "@mapbox/mapbox-gl-draw";

export default {
  data() {
    return {
      map: null,
      geoData: null,
      showpopup: false,
      marker1: null,
      marker2: null,
      point1: null,
      point2: null,
      kilometer: 0,
      miles: 0,
      measureActive: false,
      markers: [], 
      removedMarkers: [], 
      markersVisible: true,
      draw: null, 
      uploadedDataId: null
    };
  },
  mounted() {
    mapboxgl.accessToken = "pk.eyJ1IjoiYXNoaXNocmFqbGlmZSIsImEiOiJjbTJtZDN6amgwanp6MmlyMnlkbThoNXpoIn0.sv_-eIgiFlVfJYsmWHWImQ";
    this.initializeMap();
    this.fetchGeoData();
  },
  methods: {
    initializeMap() {
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v11",
        center: [78.9629, 20.5937],
        zoom: 4,
      });

      this.map.addControl(new mapboxgl.NavigationControl());

      this.map.once("load", () => {
        this.map.on("click", this.mapClickMarks);
      });

      //DRAW initialized after map is initalized as we need Mao First

       this.draw = new mapboxGlDraw({
        displayControlsDefault: true,
        controls: {
            polygon: true,
            trash: true
        },
        // defaultMode: 'draw_polygon'
    });
    this.map.addControl(this.draw);
      
    },
    async fetchGeoData() {
      try {
        const response = await axios.get("http://localhost:3000/geodata");
       this.uploadedDataId = response.data[0].id
        console.log('response ---- ',response.data[0].geoData.features.length)
        if(response.data[0].geoData.features.length == 0){
          toast.error("No Data Exist!");
        }
        const geoData = response.data[0].geoData;

        if (!geoData || geoData.type !== "FeatureCollection" || !geoData.features) {
          console.error("Invalid GeoJSON data structure:", response.data);
          alert("Invalid GeoJSON data received from server.");
          return;
        }
        this.geoData = geoData;
        
        this.addMarkersForExistingData();
      } catch (error) {
        console.log("ERROR in fetching db data--- ", error);
      }
    },
    addMarkersForExistingData() {
      if (!this.geoData || !this.geoData.features) {
        console.log("No valid GeoJSON data for markers.");
        return;
      }

      this.geoData.features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates;
        const marker = new mapboxgl.Marker({draggable:true}).setLngLat(coordinates).addTo(this.map);
        this.markers.push(marker); // Store marker in array

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
          <div style="font-family: Arial, sans-serif; background-color: #000; padding: 10px; border-radius: 8px; width: 200px; box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1); border: 1px solid #fff;">
            <span style="margin: 0; font-size: 16px; color: #ff0;">Location Details</span><br>
            <span style="font-size: 14px; color: white;">Latitude: <strong>${coordinates[1].toFixed(5)}</strong></span><br>
            <span style="font-size: 14px; color: white;">Longitude: <strong>${coordinates[0].toFixed(5)}</strong></span>
          </div>

          `);

        marker.setPopup(popup);
        marker.getElement().addEventListener("mouseenter", () => popup.addTo(this.map));
        marker.getElement().addEventListener("mouseleave", () => popup.remove());
      });
    },
    mapClickMarks(event) {
      if (this.measureActive) {
        if (this.point1 && this.point2) return;

        const clickedPoint = event.lngLat;
        const marker = new mapboxgl.Marker().setLngLat(clickedPoint).addTo(this.map);

        if (!this.point1) {
          this.point1 = clickedPoint;
          this.marker1 = marker;
          toast.info("Click on the end point!");
        } else {
          this.point2 = clickedPoint;
          this.marker2 = marker;
          this.calculateDistance();
        }
      } else {
        const clickedPoint = event.lngLat;

        const marker = new mapboxgl.Marker({ draggable: true })
          .setLngLat(clickedPoint)
          .addTo(this.map);

        this.markers.push(marker); 

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`

             <div style="font-family: Arial, sans-serif; background-color: #000; padding: 10px; border-radius: 8px; width: 200px; box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1); border: 1px solid #fff;">
              <span style="margin: 0; font-size: 16px; color: #ff0;">Location Details</span><br>
              <span style="font-size: 14px; color: white;">Latitude: <strong>${clickedPoint.lat.toFixed(5)}</strong></span><br>
              <span style="font-size: 14px; color: white;">Longitude: <strong>${clickedPoint.lng.toFixed(5)}</strong></span>
            </div>
          `);

        marker.setPopup(popup);
        marker.getElement().addEventListener("mouseenter", () => popup.addTo(this.map));
        marker.getElement().addEventListener("mouseleave", () => popup.remove());
      }
    },
    calculateDistance() {
      console.log('points',this.point1,this.point2)
      if (this.point1 && this.point2) {
        const distanceInMeters = getDistance(this.point1, this.point2);
        this.kilometer = (distanceInMeters / 1000).toFixed(2);
        this.miles = (distanceInMeters / 1609.34).toFixed(2);
        this.showpopup = true;
      }
    },
    enableMeasure() {
      this.measureActive = true;
      this.showpopup = false;
      this.point1 = null;
      this.point2 = null;
      this.marker1?.remove();
      this.marker2?.remove();
      toast.info("Click on Start point!");
    },
    undoMarker() {
      if (this.markers.length) {
        const lastMarker = this.markers.pop(); 
        this.removedMarkers.push(lastMarker); 
        lastMarker.remove();
      } else {
        toast.info("No markers to undo!");
      }
    },
    redoMarker() {
      if (this.removedMarkers.length) {
        const lastRemovedMarker = this.removedMarkers.pop(); 
        this.markers.push(lastRemovedMarker); 
        lastRemovedMarker.addTo(this.map); 
      } else {
        toast.info("No markers to redo!");
      }
    },

      closePopup() {
      this.showpopup = false;
      this.measureActive = false;
      this.point1 = null;
      this.point2 = null;
      this.marker1?.remove();
      this.marker2?.remove();
    },
    toggleMarkers() {
      this.markersVisible = !this.markersVisible;
      this.markers.forEach((marker) => {
        if (this.markersVisible) {
          marker.addTo(this.map);
        } else {
          marker.remove();
        }
      });
    },
  async saveChanges() {
  const updatedGeoData = {
    type: "FeatureCollection",
    features: this.markers.map(marker => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [marker.getLngLat().lng, marker.getLngLat().lat],
      },
    })),
  };

  try {
    // Fetch existing data to check if there's already an entry
    const response = await axios.get("http://localhost:3000/geodata");
    const geoDataItem = response.data[0]; 

    if (geoDataItem) {
      // Update existing data
      const id = geoDataItem.id;
      await axios.put(`http://localhost:3000/geodata/${id}`, {
        geoData: updatedGeoData,
      });
      toast.success("Changes saved successfully!");
    } else {
      // Create a new entry if the database is empty
      await axios.post("http://localhost:3000/geodata", {
        geoData: updatedGeoData,
      });
      toast.success("New data saved successfully!");
    }
  } catch (error) {
    console.error("Error saving changes:", error);
    toast.error("Failed to save changes!");
  }
},

async clearData() {
  console.log('u ',this.uploadedDataId)
      if (this.uploadedDataId) {
        console.log('id-- ',this.uploadedDataId)
        try {
          await axios.delete(`http://localhost:3000/geodata/${this.uploadedDataId}`);
          this.uploadedDataId = null;
          toast.error('Deleted Successfully !',{ autoClose:3500});
        } catch (error) {
          console.error('Error deleting data from server:', error);
        }
      }
    }

  },
};
</script>
<style scoped>
.custom-popup {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  color: white;
  padding: 20px;
  border-radius: 10px;
  font-size: 16px;
  z-index: 1001;
}

.popup-inner {
  text-align: center;
  margin-top: 25px;
}

.close-icon {
  width: 25px;
  height: 25px;
  position: absolute;
  cursor: pointer;
  top: 10px;
  right: 10px;
}

.line {
  height: 2px;
  background-color: yellow;
  margin: 10px 0;
  width: 100%;
}

.distance-value{
  font-size: large;
  color: yellow;
}
</style>
<template>
  <div class="user-add-data-styles">
    <header class="header">
      <Header/>
    </header>
    <div class="content">
      <div class="upload-container">
        <p>Please upload your GeoJSON file below for processing.</p>
        <input
          type="file"
          class="add-btn"
          @change="uploadFile"
          accept=".geojson,application/geo+json"
          ref="fileInput"
        />
      </div>
    </div>
    <footer class="footer">
     <Footer/>
    </footer>
  </div>
</template>


<script>
import Header from './Header.vue';
import Footer from './Footer.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from 'axios';

export default {
  name: 'homeView',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      location: null,
      view: false,
    };
  },
  methods: {
    async uploadFile(event) {
      const file = event.target.files[0];
      if (file) {
        this.view = true;
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const geoJsonData = JSON.parse(e.target.result);
            this.location = geoJsonData;

            const payload = { geoData: geoJsonData };
            try {
              const response = await axios.post('http://localhost:3000/geodata', payload);
              console.log('saved : ',response.status);
              toast.success('Processing Please Wait !',{ autoClose:3500 });
              if(response.status == 201){
                setTimeout(() => {
                this.$router.push({ name: "Home" });
              }, 2000);
              }
            } catch (error) {
              console.error('Error saving data ---- ', error);
            }
          } catch (error) {
            console.error('Invalid---', error);
            this.location = null;
            this.view = false;
            this.$refs.fileInput.value = null;
            toast.error('Please upload a valid file !',{ autoClose:2500 });
          }
        };
        reader.readAsText(file);
      }
    }
  }
};
</script>

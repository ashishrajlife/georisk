<template>
  <div class="home-container">
    <header class="header">
      <span class="app-name">Geo-Lock</span>
      <Header />
    </header>
    <div v-if="view" id="map"><mapView/></div>
    <footer class="footer">
      <Footer />
    </footer>
  </div>
</template>

<script>
import Header from './Header.vue';
import Footer from './Footer.vue';
import mapView from './mapView.vue';

export default {
  name: 'homeView',
  components: {
    Header,
    Footer,
    mapView
  },
  data() {
    return {
      view: true,
      showpopup: false,
      kilometer: '',
      miles: '',
      showMarkers: true, 
    };
  },
  methods: {}
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}
#map {
  flex-grow: 1;
  height: 0;
  overflow: hidden;
}
</style>

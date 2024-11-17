<template>
    <header class="app-header">
      <nav class="nav-links">
        <router-link to="/Home" class="nav-link">Home</router-link>
        <router-link to="/adddata" class="nav-link">+ Geo Data</router-link>
        <button @click="logout" class="nav-link">Logout</button>
      </nav>
    </header>
  </template>
  
  <script>
    import { toast } from 'vue3-toastify';
    import 'vue3-toastify/dist/index.css';
  export default {
    name: "AppHeader",
    methods: {
      logout() {
        localStorage.removeItem("user-info");
        toast.error('logging out !',{ autoClose:2000});
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 1000);

      }
    }
  };
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  
  
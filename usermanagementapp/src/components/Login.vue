<template>
    <div class="login-page">
      <div class="login-card">
        <h2>Login</h2>
        <form>
          <div class="input-group">
            <label for="email">Email</label>
            <input type="text" id="email" v-model="email"  />
          </div>
          <div class="input-group"> <label for="password">Password</label>
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" />
          <img v-if="showPassword" src="../../src/assets/images/eye_closed.png" @click="togglePasswordVisibility" alt="">
          <img v-else src="../../src/assets/images/eye_open.png" @click="togglePasswordVisibility" alt="">
         </div>
          <button @click="login">Login</button>
        </form>
        <p class="login-link"> No Account ? <router-link to="/">Signup</router-link></p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';

  export default {
    name: 'LoginView',
    data() {
      return {
        email: '',
        password: '',
        showPassword: false,
      };
    },
    methods: {
     async login() {
      if(this.email == ''){
        toast.error('username cannot be empty',{ autoClose:3500});
        return;
      }
      if(this.password == ''){
        toast.error('password cannot be empty',{ autoClose:3500});
        return;
      }
       console.log(this.email,this.password)
        let result = await axios.get(`http://localhost:3000/user?email=${this.email}&password=${this.password}`)
        console.log(result)
        if (result.status == 200 && result.data.length>0) {
          toast.success('logging in',{ autoClose:2000});
          setTimeout(() => {
          this.$router.push({ name: "Home" });
        }, 1000);
        } else {
          toast.error('Username/Password is Wrong !',{ autoClose:2000});
        }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
}
  };
  </script>
<template>
  <div class="sign-up">
    <div class="sign-up-container">
      <div class="header">
        <h2>Sign Up</h2>
      </div>

      <div class="sign-up-form">
        <div class="form-group">
          <input type="text" v-model="name" id="name" placeholder="Name" required />
        </div>

        <div class="form-group">
          <input type="email" v-model="email" id="email" placeholder="Email" required />
        </div>

        <div class="form-group">
          <input type="password" v-model="password" id="password" placeholder="Password" required />
        </div>

        <button type="submit" @click="submitForm" class="sign-up-button">Sign Up</button>
      </div>
      <p class="login-link">
        Already have an account? <router-link to="/login">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
  name: 'signUp',
  setup(){
      toast('welcome',{
        autoClose:3500
      });
    },
  data() {
    return {
      name: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async submitForm() {
    if(this.name ==''){
      toast.error('username cannot be empty',{ autoClose:3500});
      return;  
    }
    if(this.email ==''){
      toast.error('email cannot be empty',{ autoClose:3500});
      return;  
    }
    if(this.password ==''){
      toast.error('password cannot be empty',{ autoClose:3500});
      return;  
    }
      let payload = {
        name: this.name,
        email: this.email,
        password: this.password
      };
      try {
        let result = await axios.post('http://localhost:3000/user', payload);
        if (result.status == 201) {
          toast.success('Signed up',{ autoClose:3500});
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.$router.push({ name: 'Login' });
        } else {
          console.log('Error');
        }
      } catch (error) {
        console.error("error", error);
      }
    }
  }
};
</script>

<style scoped>
.sign-up-container {
  width: 450px;
  padding: 40px;
  background: rgb(48, 46, 46);
  border: 2px solid yellow;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

.header {
  padding-bottom: 30px;
}
.sign-up{
  background-image: url('../../src/assets/images/space.png');
   min-height: 100vh;
  display: flex; 
  justify-content: center; 
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

h2 {
  font-size: 1.8rem;
  color:white;
  font-weight: 500;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.sign-up-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  position: relative;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  background-color: #fff;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.sign-up-button {
  padding: 12px 0;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sign-up-button:hover {
  background-color: #0056b3;
}

.login-link {
  margin-top: 20px;
  font-size: 0.9rem;
  color: white;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
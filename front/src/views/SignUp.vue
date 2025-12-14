<template>
  <div class="form">
    <h3>SignUp</h3>
    <label for="email">Email</label>
    <input type="email" name="email"  required v-model="email">
    <label for="password">Password</label>
    <input type="password" name="password" required v-model="password">
    <button @click="SignUp" class="SignUp">SignUp</button>
     <p v-if="errorMessage" class="error">
    {{ errorMessage }}
  </p>
  </div>
</template>

<script>
export default {
name: "SignUp",
data: function() {
    return {
   email: '',
   password: '',
   errorMessage:''
  }
  },
  methods: {
async SignUp() {
  try{
      var data = {
        email: this.email,
        password: this.password
      };

      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          credentials: 'include', 
          body: JSON.stringify(data),
      });
      const result = await response.json();
      if(!response.ok){
        console.log(result.error);
        this.errorMessage = result.error;
        return;
      }
      
      this.errorMessage = "";
      console.log(data);
      this.$router.push("/login");
      //location.assign("/");
      
    }catch (err) {
      console.log(err.message);
    }}
  }, 
}
</script>

<style scoped>
.form {
  max-width: 420px;
  margin: 30px auto;
  background: rgb(167, 154, 154);
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
h3 {
  text-align: center;
  color: rgb(8, 110, 110);
}
label {
  color: rgb(8, 110, 110);
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid white;
  color: blue;
}
button {
  background: rgb(8, 110, 110);
  border: 0;
  padding: 10px 20px;
  margin-top: 20px;
  color: white;
  border-radius: 20px;
  align-items: center;
  text-align: center;
}
</style>
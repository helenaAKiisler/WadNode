<template>
  <div class="form">
    <h3>LogIn</h3>
    <label for="email">Email</label>
    <input type="email" name="email" required v-model="email">
    <label for="password">Password</label>
    <input type="password" name="password" required v-model="password">
    <div class="container">
      <button @click="LogIn" class="center">LogIn</button>
      <button @click='this.$router.push("/signup")' class="center">Signup</button>
    </div><p v-if="errorMessage" class="error">
    {{ errorMessage }}
  </p>
  </div>
</template>
<script>
export default {
  name: "LogIn",

  data: function () {
    return {
      email: '',
      password: '',
     errorMessage:''
  }
  },
  methods: {


  async LogIn() {
    try{
      var data = {
        email: this.email,
        password: this.password
      };
      
      // using Fetch - post method - send an HTTP post request to the specified URI with the defined body
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          credentials: 'include', //  Don't forget to specify this if you need cookies
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
      this.$router.push("/");
      //location.assign("/");
      
    }catch (err) {
      console.log(err.message);
    }
  }, 
}
}

</script>

<style scoped>
.form {
  max-width: 420px;
  margin: 30px auto;
  background: rgb(162, 205, 160);
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}

h3 {
  text-align: center;
  color: rgb(7, 93, 37);
}

label {
  color: rgb(4, 71, 41);
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
  color: rgb(4, 69, 32);
}

button {
  background: rgb(2, 64, 25);
  border: 0;
  padding: 10px 20px;
  margin: 20px 20px 20px 20px;
  color: white;
  border-radius: 20px;
  align-items: center;
  text-align: center;
}

button:hover {
  background-color: rgba(94, 176, 102, 0.699);
}

.center {
  margin: auto;
  border: 0;
  padding: 10px 20px;
  margin-top: 20px;
  width: 30%;
}

.container {
  display: flex;
  justify-content: center;
}
</style>
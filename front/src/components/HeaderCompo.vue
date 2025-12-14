<template>
    <header class="header">
        <nav class="nav">
            <router-link to="/">Home</router-link>
            <router-link to="/signup">SignUp</router-link>
            <router-link to="/login">LogIn</router-link>
            <router-link to="/about">About</router-link>
        </nav>
    </header>
</template>

<script>
export default {
    name: "HeaderCompo"

}
</script>
<style>
* {
    font-family: 'Courier New', Courier, monospace;
    box-sizing: border-box;
}

.nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.nav a {
    padding: 10px 15px;

    font-size: large;
    font-weight: bold;
    text-decoration: none;
    
}

.nav a:hover {
    background-color: #dc6379;
    color: #092747;
}

.header {
    top: 0;
    display: flex;
    position: sticky;
    background-color: rgb(77, 139, 86);
    border-color: rgb(12, 129, 232);
    flex-direction: row;
    justify-content: space-between;
    border-radius: 15px;
    box-shadow: 15%;
}

div header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;


}

nav a.router-link-exact-active {
    color: #0a61a8;
}

.router-link-active {
    font-weight: bold;
}
</style>
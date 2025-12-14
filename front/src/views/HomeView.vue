<template>
  <div class="homeview">
    <div class="content">
      <div class="sidebar"></div>

      <div class="grid">
        <button class="logout-btn" @click="logout">Logout</button>
        <!-- Posts feed -->
        <ul class="feed">
          <PostCompo
            v-for="post in posts"
            :key="post.id"
            :post="post"
          />
        </ul>

        <div class="buttongrid">
          <button class="addpost-btn" @click="addpost">Add post</button>
          <button class="deleteall-btn" @click="deleteall">Delete all</button>
        </div>
      </div>

      <div class="sidebar"></div>
    </div>
  </div>
</template>

<script>
import PostCompo from '@/components/PostCompo.vue';

export default {
  name: "HomeView",
  components: { PostCompo },
  data() {
    return {
      posts: []
    };
  },
  async mounted() {
    try {
      const res = await fetch('http://localhost:3000/api/posts');
      if (!res.ok) throw new Error('Network response was not ok');
      this.posts = await res.json();
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  },
  methods: {
    logout() {
      //placeholder
      console.log("Logout clicked");
    },
    addpost() {
      //placeholder
      console.log("Add post clicked");
    },
    deleteall() {
      //placeholder
      console.log("Delete all clicked");
    }
  }
};
</script>

<style scoped>
.homeview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  margin:20px;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.grid {
  display: flex;
  flex-direction: column;
  width: 60%;
}

.feed {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar {
  width: 15%;
  min-height: 50px;
  background-color: rgb(77, 139, 86);
  border-radius: 15px;
}

.logout-btn{
  width: 140px;
  align-self: center;
  margin-bottom: 20px;
}

.buttongrid {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
}

button {
  background: rgb(8, 110, 110);
  border: none;
  padding: 10px 20px;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}

button:hover {
  background-color: rgb(6, 90, 90);
}
</style>

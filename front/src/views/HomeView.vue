<template>
  <div class="homeview">
    <h1>Feed</h1>
    
    <div class="sidebar"></div>

    <div class="grid">
      <!-- Posts feed -->
      <ul class="feed">
        <PostCompo
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </ul>
    </div>

    <div class="sidebar"></div>
    
  </div>
</template>

<script>
import PostCompo from '@/components/PostCompo.vue';

export default {
  name: "HomeView",
  components: {
    PostCompo
  },
  data() {
    return {
      posts: []
    };
  },
  async mounted() {
    try {
      // Fetch posts from backend using fetch
      const res = await fetch('http://localhost:3000/api/posts');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      this.posts = data;
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  }
};
</script>

<style scoped>
.homeview {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.grid {
  display: flex;
  flex-direction: column;
  width: 60%;
}

.feed {
  list-style-type: none;
  padding: 0;
}

.sidebar {
  width: 15%;
  min-height: 50px;
}

h1 {
  margin-bottom: 20px;
  text-align: center;
}
</style>

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
            @click-post="viewPost"
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
import auth from "../auth";

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
     fetch("http://localhost:3000/auth/logout", {
          credentials: 'include', //  Don't forget to specify this if you need cookies
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log('jwt removed');
        console.log('jwt removed:' + auth.authenticated());
        this.$router.push("/login");
        location.assign("/");
      })
      .catch((e) => {
        console.log(e);
        console.log("error logout");
      });
    },
    
    addpost() {
      this.$router.push('/add-post');
    },

    async deleteall() {
    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete posts');

      // Clear posts from local state so UI updates immediately
      this.posts = [];
      console.log('All posts deleted');
    } catch (err) {
      console.error(err);
    }
  },
  viewPost(postId) {
    // Navigate to /posts/:id
    this.$router.push(`/posts/${postId}`);
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

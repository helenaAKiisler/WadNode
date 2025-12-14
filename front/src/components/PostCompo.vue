<template>
  <li class="post" @click="goToPost">
    <div class="postHeader">
      <span>{{ formattedDate }}</span>
    </div>
    <div class="postBody">
      <span>{{ post.body }}</span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'PostCompo',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      // Converts time timestamp to a readable format
      return new Date(this.post.time).toLocaleString();
    }
  },
   methods: {
    goToPost() {
      // Emit the post id to the parent
      this.$emit('click-post', this.post.id);
    }
  }
};
</script>

<style scoped>
.post:hover{
  background-color: #8fc1e4;
}
.feed {
    list-style: none;
    padding-bottom: 1%;
    padding-top: 1%;
    grid-template-columns: 18% 60% 18%;
    gap: 2%;
}
.post{
    display:flex;
    flex-direction: column;
    border-radius: 15px;
    background-color: #e48f9f;
    padding-top: 2%;
    padding-left: 3%;
    padding-right: 3%;
    padding-bottom: 2%;
    margin-bottom: 5%;
}
.postHeader{
    padding:2%;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
}
.postFooter{
    padding:2%;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
}
.like{
    width: 20px;
    height: 20px;
    object-fit: contain;
}
</style>

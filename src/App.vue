<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  .lines {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
  .line1{
    -webkit-line-clamp: 1;
  }
  .line2{
    -webkit-line-clamp: 2;
  }
  .line3{
    -webkit-line-clamp: 3;
  }
</style>

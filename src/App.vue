<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$store.commit('app/SET_PREVIEW', this.$refs.preview);
  }
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

  .hot{
    width: 30px;
    height: 30px;
  }
  .bold{
    font-weight: bold;
  }
  .light {
    color: #d40f33;
  }
  .success{
    color: #67C23A;
  }
  .pointer{
    cursor: pointer;
  }

  ul{
    margin: 0;
    padding: 0;
  }
  ul>li{
    padding: 10px;
  }

  .container{
    padding: 0 20px;
  }

  .tox-tinymce-aux{
    z-index: 2010!important;
  }
  .tox-tinymce{
    height: 100%!important;
  }
</style>

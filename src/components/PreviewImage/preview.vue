<template>
  <transition name="preview">
    <div v-show="visible" class="preview-wrap" @click="handleClose">
      <div class="preview">
        <span class="close" @click="handleClose"></span>
        <img width="100%" @click.stop :src="previewImg" alt="">
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "PreviewImage",
    data() {
      return {
        visible: false,
        previewImg: ''
      }
    },
    props: {
      title: String
    },

    methods: {
      preview(url) {
        this.visible = true;
        this.previewImg = url;
      },
      handleClose () {
        this.visible = false;
      }

    }
  }
</script>

<style scoped>
  .preview-enter-active,.preview-leave-active{
    opacity: 1;
    transition: all 0.2s ease-in-out;
  }
  .preview-enter,.preview-leave-to{
    opacity: 0;
  }
  .preview-wrap {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5000;
    position: fixed;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .preview-wrap > .preview {
    width: 40%;
    padding: 20px;
    margin: 15.5vh auto 10px;
    min-width: 600px;
    position: relative;
    box-shadow: 0 0 15px rgba(0,0,0,0.5);
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #fff;
  }

  .preview-wrap > .preview > img {
    width: 100%;
    display: block;
  }

  .preview-wrap > .preview > .close{
    top: -8px;
    width: 30px;
    right: -40px;
    height: 30px;
    cursor: pointer;
    display: block;
    position: absolute;
    background: url('./close.png')no-repeat center center;
    background-size: 50%;
  }

</style>

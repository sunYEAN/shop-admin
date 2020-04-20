<template>
    <div class="empty">
      <img src="./empty.png" alt="">
      <p>空空的</p>
    </div>
</template>

<script>
    export default {
        name: "empty"
    }
</script>

<style scoped lang="less">
  .empty{
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    img{
      width: 80px;
      height: 80px;
    }
    p{
      color: #aaa;
      font-size: 12px;
    }
  }
</style>

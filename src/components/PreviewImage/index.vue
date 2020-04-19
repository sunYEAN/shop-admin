<template>
    <el-dialog title="查看图片" :visible.sync="visible">
      <img width="100%" :src="previewImg" alt="">
    </el-dialog>
</template>

<script>
    export default {
        name: "PreviewImage",
        data () {
            return {
                visible: false,
                previewImg: ''
            }
        },
        methods: {
            preview (url) {
                this.visible = true;
                this.previewImg = url;
            }
        }
    }
</script>

<style scoped>

</style>

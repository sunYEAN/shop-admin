<template>
    <tiny-editor class="good-detail" @upload="handleUpload" v-model="value"></tiny-editor>
</template>

<script>
  import TinyEditor from "../../../components/TinyEditor";
    export default {
        name: "GoodsEditor",
        components: {TinyEditor},
        props: {
            initialValue: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                value: this.initialValue || ''
            }
        },
        methods: {
            handleUpload () {
                this.$emit('success', this.value);
            }
        }
    }
</script>

<style scoped lang="less">
  .good-detail{
    width: 60%;
    margin: 5vh auto;
  }
</style>

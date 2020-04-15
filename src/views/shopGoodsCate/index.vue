<template>
  <div class="container">
    <ul>
      <li v-for="i in cateLogs">{{i}}</li>
    </ul>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  computed: {
    ...mapState('goods', {
      cateLogs: state => state.catelogs
    })
  },
  methods: {
    ...mapActions('goods', [
      'getGoodsCateLogs'
    ])
  },
  mounted() {
    this.getGoodsCateLogs();
  }
}
</script>

<style scoped>
  .line{
    text-align: center;
  }
</style>


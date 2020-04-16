<template>
  <div class="container">
    <ul>
      <li v-for="i in calculateCatalogs" :key="i.id">{{i}}</li>
    </ul>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
export default {
  data() {
    return {
      form: {
      }
    }
  },
  computed: {
    ...mapState('goods', {
      catalogs: state => state.catalogs
    }),
    calculateCatalogs () {
      const catalogs = this.catalogs
      const temp = {};

      catalogs.forEach(item => {
        if (!item.parent_id) {
          temp[item.parent_id] = item;
        } else {
          if (!temp[item.parent_id]) {
            temp[item.parent_id] = {
              children: []
            }
          };
        }
      })
    }
  },
  methods: {
    ...mapActions('goods', [
      'getGoodsCatalogs'
    ])
  },
  mounted() {
    this.getGoodsCatalogs();
  }
}
</script>

<style scoped>
  .line{
    text-align: center;
  }
</style>


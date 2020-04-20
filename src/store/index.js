import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

const stores = require.context('./modules', false, /\.js$/);

const modules = {};

stores.keys().forEach(key => {
  const name = key.replace(/(\.\/|\.js)/g, '');
  modules[name] = stores(key).default;
  modules[name].namespaced = true;
});


Vue.use(Vuex);

const store = new Vuex.Store({
  modules,
  getters
});

export default store

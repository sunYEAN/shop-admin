import preview from './preview.vue';
let component = null;

function install(Vue) {
  if (!component) {
    let Constructor = Vue.extend(preview);
    let body = document.getElementsByTagName('body')[0];
    let instance = new Constructor().$mount();
    component = instance;
    body.appendChild(instance.$el);

    Vue.prototype.$preview = instance.preview;
  }
}

export default install;

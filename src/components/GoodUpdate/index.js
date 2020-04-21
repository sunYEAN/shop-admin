import GoodsAlbum from './GoodsAlbum';
import GoodsAttribute from './GoodsAttribute';
import './update.css';

function WithBaseCard(Component) {
  return {
    props: Component.props,
    mounted () {
      console.log(this.$props)
    },
    methods: {
      handleClose () {
        this.$emit('update:visible', false);
      }
    },

    render (h) {
      const slots = Object.keys(this.$slots).reduce((arr, key) => arr.concat(this.$slots[key]), []).map(vnode => ({...vnode, context: this._self}));
      return h('transition', {
        props: {
          name: 'base'
        },
      }, this.visible ? [
        h('div', {
          on: {
            click: this.handleClose
          },
          class: 'base-card'
        }, [
          h(Component, {
            on: this.$listeners,
            props: {
              ...this.$props,
              handleClose: this.handleClose
            },
            attrs: this.attrs,
            slots,
          })
        ])
      ] : null )
    }
  }
}

const GoodAlbum = WithBaseCard(GoodsAlbum);
const GoodAttr = WithBaseCard(GoodsAttribute);

export {
  GoodAlbum,
  GoodAttr
};

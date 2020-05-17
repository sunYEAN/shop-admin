import GoodsSpec from './GoodsSkus';
import GoodsAlbum from './GoodsAlbum';
import GoodsAttribute from './GoodsAttribute';
import GoodsEditor from './GoodsEditor';
import '../../../assets/update.css';

function WithBaseCard(Component) {
  return {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      ...Component.props
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
const GoodDetailEditor = WithBaseCard(GoodsEditor);
const GoodSkus = WithBaseCard(GoodsSpec);


export {
  GoodAlbum,
  GoodAttr,
  GoodSkus,
  GoodDetailEditor
};

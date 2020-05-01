import Category from './category';

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

const VCategory = WithBaseCard(Category);


export {
  VCategory,
};

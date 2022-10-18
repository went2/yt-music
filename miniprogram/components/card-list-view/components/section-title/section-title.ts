Component({
  properties: {
    isShowMore: { type: Boolean, value: false },
    isShowDesc: { type: Boolean, value: false },
    titleText: { type: String, value: '这是标题' },
    titleDesc: { type: String, value: '这是描述' },
  },
  methods: {
    onClickMore() {
      this.triggerEvent('click-more')
    }
  }
})

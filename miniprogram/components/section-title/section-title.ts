Component({
  properties: {
    isShowMore: { type: Boolean, value: false },
    isShowDesc: { type: Boolean, value: false },
    titleText: { type: String, value: '默认标题' },
    titleDesc: { type: String, value: '' },
  },
  observers: {
    "isShowDesc": function(newValue) {
      this.setData({showDesc: newValue});
    },
    "titleDesc": function(newValue) {
      if(newValue) {
        this.setData({showDesc: true});
      }
    }
  },
  data: {
    showDesc: false
  },
  methods: {
    onClickMore() {
      this.triggerEvent('click-more')
    }
  }
})

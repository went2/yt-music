const app = getApp();
Component({
  properties: {
    isShowMore: { type: Boolean, value: false },
    isShowDesc: { type: Boolean, value: false },
    titleText: { type: String, value: '这是标题' },
    titleDesc: { type: String, value: '这是描述' },
    listData: { type: Array, value: [] }
  },
  data: {
    screenWidth: 375
  },
  methods: {
    onClickMore() {
      this.triggerEvent('click-more');
    }
  },
  lifetimes: {
    attached() {
      this.setData({ screenWidth: app.globalData.screenWidth })
    }
  }
})

export {}

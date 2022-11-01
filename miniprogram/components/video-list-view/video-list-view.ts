const app = getApp();
Component({
  properties: {
    isShowMore: { type: Boolean, value: false },
    isShowDesc: { type: Boolean, value: false },
    titleText: { type: String, value: '默认标题' },
    titleDesc: { type: String, value: '' },
    listData: { type: Array, value: [] }
  },
  data: {
    screenWidth: 375
  },  
  methods: {
    onClickMore() {
      this.triggerEvent('click-more');
    },
    onClickItem(event: WechatMiniprogram.BaseEvent) {
      this.triggerEvent('click-item', event.currentTarget.dataset.id);
    }
  },
  lifetimes: {
    attached() {
      this.setData({ screenWidth: app.globalData.screenWidth })
    }
  }
});

export {}

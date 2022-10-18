const app = getApp();
Component({
  properties: {
    listData: {
      type: Array,
      value: []
    }
  },
  data: {
    isActive: -1,
    screenWidth: 375
  },
  methods: {
    setActive(event: WechatMiniprogram.BaseEvent) {
      const key = event.currentTarget.dataset.key;
      this.setData({ isActive: key });
      this.triggerEvent('click-cat', key);
    }
  },
  lifetimes: {
    attached() {
      this.setData({ screenWidth: app.globalData.screenWidth })
    }
  }
});

// 为了让ts认为是个模块，避免共用作用域的问题 
export {}

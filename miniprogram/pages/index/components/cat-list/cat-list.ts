const app = getApp();
Component({
  properties: {
    listData: {
      type: Array,
      value: []
    },
    isSticky: {
      type: Boolean,
      value: false
    },
    stickyWidth: {
      type: Number,
      value: 0
    }
  },
  data: {
    isActive: -1,
    screenWidth: 375,
    width: 0,
    top: 0,
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
      // console.log(app.globalData.navBarInfo.menuTop);
      this.setData({ 
        screenWidth: app.globalData.screenWidth, 
        top: app.globalData.navBarInfo.menuTop - 9
      });
    }
  },
  observers: {
    "stickyWidth": function(newValue) {
        this.setData({
          width: newValue > 0 ? newValue : this.data.screenWidth
        })
    }
  }
});

// 为了让ts认为是个模块，避免共用作用域的问题 
export {}

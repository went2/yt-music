const app = getApp();
Component({
  properties: {
    isShowMore: { type: Boolean, value: false },
    isShowDesc: { type: Boolean, value: false },
    titleText: { type: String, value: '这是标题' },
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
    onTapSong(event: WechatMiniprogram.CustomEvent) {
      wx.navigateTo({
        url: `/pages/player/player?id=${event.detail}`
      });
    },
    onClickItem(event: WechatMiniprogram.BaseEvent) {      
      this.triggerEvent('click-item', event.currentTarget.dataset.id);
    },
    onAttached() {
      // console.log('song-column attaehed=>');

      setTimeout(()=>{
        const query = wx.createSelectorQuery();
        query.select('.song-column').boundingClientRect();
        query.exec(res => {
          console.log(res);
        })
      }, 0)
      
    }
  },
  lifetimes: {
    attached() {
      this.setData({ screenWidth: app.globalData.screenWidth })
    }
  }
});

export {}

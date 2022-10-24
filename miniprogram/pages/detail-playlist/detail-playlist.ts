import recommendStore from '../../store/recommendStore';
Page({
  data: {
    listData: []
  },
  onLoad() {
    this.setData({ listData: recommendStore.state.personalizedList });
  },
  onClickItem(event: WechatMiniprogram.CustomEvent) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail-playlist-item/detail-playlist-item?id=${id}`
    })
  },
  onPullDownRefresh() {

  },
  setPersonalizedList(value: any) {
    this.setData({ personalizedList: value });
  },
  onUnload() {
    recommendStore.offState('personalizedList', this.setPersonalizedList);
  }
})
import detailStore from '../../store/detailStore';
Page({
  data: {
    id: '',
    detail: {}
  },
  onLoad(options: any) {
    const id = options.id;
    this.setData({ id });
    detailStore.onState('playlistDetail', this.setPlaylistDetail);
    if(id !== detailStore.state.id) {
      this.setData({ detail: {} });
      detailStore.dispatch('fetchPlaylistDetail', this.data.id);
    }
  },
  onTapLeft(){
    wx.navigateBack();
  },
  onTapSong(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/player/player?id=${id}`
    })
  },
  setPlaylistDetail(value: any) {
    this.setData({
      detail: value
    });
  },
  onUnload() {
    detailStore.offState('playlistDetail', this.setPlaylistDetail);
  }
})
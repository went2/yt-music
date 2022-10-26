import detailStore from '../../store/detailStore';

Page({
  data: {
    id: '',
    detail: {}
  },
  onLoad(options) {
    this.setData({ id: options.id });

    detailStore.onState('playlistDetail', this.setPlaylistDetail);

    detailStore.dispatch('fetchPlaylistDetail', this.data.id);
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
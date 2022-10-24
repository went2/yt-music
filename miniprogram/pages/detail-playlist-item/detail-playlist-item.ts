// pages/detail-playlist-item/detail-playlist-item.ts
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
  setPlaylistDetail(value: any) {
    this.setData({
      detail: value
    });
  },
  onUnload() {
    detailStore.offState('playlistDetail', this.setPlaylistDetail);
  }
})
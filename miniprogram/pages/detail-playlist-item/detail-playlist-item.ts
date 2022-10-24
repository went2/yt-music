// pages/detail-playlist-item/detail-playlist-item.ts
Page({
  data: {
    id: ''
  },
  onLoad(options) {
    this.setData({ id: options.id })
  }
})
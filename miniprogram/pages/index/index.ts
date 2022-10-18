import { getMetaCat, getPersonalizedList } from '../../service/modules/playlist';

Page({
  data: {
    catList: [],
    personalizedList: [],
    personalizedListSliced: []
  },
  onSeachTap() {
    console.log('home: click search');
  },
  onClickCat(event: WechatMiniprogram.CustomEvent) {
    // detail 是catList中的index
    console.log(event.detail)
  },

  onLoad() {
    this.setMetaCat();
    this.setPersonalizedList();
  },

  async setMetaCat() {
    const res = await getMetaCat();
    this.setData({ catList: res as [] });
  },
  async setPersonalizedList() {
    const res:any = await getPersonalizedList();
    this.setData({ personalizedList: res.result });
    this.setData({ personalizedListSliced: res.result.slice(0,10) });
    console.log(this.data.personalizedList)
  },

  onPullDownRefresh() {

  },
  onShareAppMessage() {

  }
});
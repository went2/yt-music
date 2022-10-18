import { getMetaCat } from '../../service/modules/playlist';
import recommendStore from '../../store/recommendStore';
import { group } from '../../utils/arrayhelper';

Page({
  data: {
    catList: [],
    personalizedList: [],
    videoList: [],
    songList: []
  },
  onLoad() {
    this.setMetaCat();
    recommendStore.onState('personalizedList', this.setPersonalizedList);
    recommendStore.dispatch('fetchPersonalizedList');
    recommendStore.onState('recommendMv', this.setRecommendMv);
    recommendStore.dispatch('fetchRecommendMv');
    recommendStore.onState('recommendSongs', this.setRecommendSongs);
    recommendStore.dispatch('fetchRecommendSongs');
  },
  onUnload() {
    recommendStore.offState('personalizedList', this.setPersonalizedList);
    recommendStore.offState('recommendMv', this.setRecommendMv);
    recommendStore.offState('recommendSongs', this.setRecommendSongs);
  },

  onSeachTap() {
    console.log('home: click search');
  },
  onClickCat(event: WechatMiniprogram.CustomEvent) {
    // detail 是catList中的index
    console.log(event.detail)
  },
  onClickItem(event: WechatMiniprogram.CustomEvent) {
    // detail 是歌单id
    console.log(event.detail)
  },

  async setMetaCat() {
    const res = await getMetaCat();
    this.setData({ catList: res as [] });
  },
  setPersonalizedList(value: any) {
    this.setData({ personalizedList: value.slice(0,10) });
  },
  setRecommendMv(value: any) {
    // console.log('video list', value)
    this.setData({ videoList: value });
  },
  setRecommendSongs(value: any) {
    const list = value.slice(0,16);
    this.setData({ songList: group(list, 4) as never[] });
    console.log(this.data.songList);
  },
});
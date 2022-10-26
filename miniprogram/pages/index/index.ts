import { getMetaCat } from '../../service/modules/playlist';
import recommendStore from '../../store/recommendStore';
import { group } from '../../utils/arrayhelper';
import { throttle } from 'underscore';

const app = getApp();

const setStickyWidthThrottled = throttle((scrollTop: number, func: (isSet: number) => void, top:number) => {
  if(scrollTop > top) {
    func(1);
  } else {
    func(0);
  }
}, 200)

Page({
  data: {
    catList: [],
    personalizedList: [],
    videoList: [],
    songList: [],
    newReleaseList: [],
    officialRecommentList:[],
    exploreData: [
      { iconUrl: "../../assets/images/icons/home-explore/new-release.png", title: "新发专辑" },
      { iconUrl: "../../assets/images/icons/home-explore/charts.png", title: "排行榜" },
      { iconUrl: "../../assets/images/icons/home-explore/moods.png", title: "分类听歌" }
    ],
    stickyWidth: 0,
    cateTop: 0
  },
  onLoad() {
    this.setMetaCat();
    recommendStore.onState('personalizedList', this.setPersonalizedList);
    recommendStore.onState('recommendMv', this.setRecommendMv);
    recommendStore.onState('recommendSongs', this.setRecommendSongs);
    recommendStore.onState('newRelease', this.setNewRelease);
    recommendStore.onState('officialRecommend', this.setOfficialRecommend)

    recommendStore.dispatch('fetchPersonalizedList');
    recommendStore.dispatch('fetchRecommendMv');
    recommendStore.dispatch('fetchRecommendSongs');
    recommendStore.dispatch('fetchNewRelease');
    recommendStore.dispatch('fetchOfficialRecommend');
  },
  onReady() {
    const query = wx.createSelectorQuery().in(this);
    query.select('.cate-list').boundingClientRect(res => {
      this.setData({
        cateTop: res.top
      })
    }).exec();
  },

  onPageScroll(option) {
    // 监测cat-list滚动到顶部：自身top - 状态栏高度
    const top = this.data.cateTop - app.globalData.statusBarHeight;
    setStickyWidthThrottled(option.scrollTop, this.setStickyWidth, top);
  },

  setStickyWidth(isSet: number) {
    if(isSet) {
      this.setData({
        stickyWidth: app.globalData.screenWidth - 97
      })
    } else {
      this.setData({
        stickyWidth: 0
      })
    }
  },

  onSeachTap() {
    console.log('home: click search');
  },
  onClickCat(event: WechatMiniprogram.CustomEvent) {
    // detail 是catList中的index
    console.log(event.detail)
  },
  onClickPlaylistItem(event: WechatMiniprogram.CustomEvent) {
    // detail 是歌单id
    const id = event.detail;
    wx.navigateTo({
      url: `/pages/detail-playlist-item/detail-playlist-item?id=${id}`
    })
  },
  onClickPlayListMore() {
    wx.navigateTo({
      url: '/pages/detail-playlist/detail-playlist'
    })
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
  },
  setNewRelease(value: any) {
    this.setData({ newReleaseList: value.slice(0,10) });
  },
  setOfficialRecommend(value: any) {
    this.setData({ officialRecommentList: value.slice(0,10) });
  },
  onUnload() {
    recommendStore.offState('personalizedList', this.setPersonalizedList);
    recommendStore.offState('recommendMv', this.setRecommendMv);
    recommendStore.offState('recommendSongs', this.setRecommendSongs);
    recommendStore.offState('newRelease', this.setNewRelease);
    recommendStore.offState('officialRecommend', this.setOfficialRecommend)
  },
});

export {};
import detailStore from '../../store/detailStore';
import { throttle } from 'underscore';
import playStore from '../../store/playStore';

const app = getApp();
const audioCtx = wx.createInnerAudioContext();

Page({
  data: {
    id: -1,
    songDetail: {},
    navItems: ['歌曲','歌词'],
    activeNav: 0,
    swiperHeight: 0,
    currentTime: 0,
    duration: 0,
    currentProgress: 0,
    isPlaying: false,
    isSliding: false,
    lyric: [] as Array<{ text: string, time: number }>,
    currentLyric: '',
    currentLyricIndex: -1,
    lyricScrollTop: 0,
    playSongList: [] as any[],
    playSongIndex: -1
  },

  onLoad(options) {
    const id = Number(options.id);
    const appData =  app.globalData;
    this.setData({
      swiperHeight: appData.screenHeight - appData.statusBarHeight - appData.MENU_BAR_HEIGHT
    })
    playStore.onStates(['playSongList', 'playSongIndex'], this.setPlaySongInfo)
    detailStore.onState('songDetail', this.setSongDetail);
    detailStore.onState('lyric', this.setLyric);

    // 播放进度监听
    audioCtx.onTimeUpdate(throttle(() => {
      if(!this.data.isSliding) {
        const currentTime = audioCtx.currentTime * 1000;
        this.setData({
          currentTime,
          currentProgress: currentTime / this.data.duration * 100,
          lyricScrollTop: this.data.currentLyricIndex * 35
        });
        this.setCurrentLyric();
      }
    }, 200, { leading: false, trailing: false }));

    audioCtx.onWaiting(() => {
      audioCtx.pause();
    });
    audioCtx.onCanplay(() => {
      audioCtx.play();
    })

    // 开始播放
    this.setupPlayer(id);
  },

  setupPlayer(id: number) {
    this.setData({ id });
    audioCtx.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioCtx.autoplay = true;

    detailStore.dispatch('fetchSongDetail', this.data.id);
    detailStore.dispatch('fetchLyric', this.data.id);
  },

  setPlaySongInfo({ playSongList, playSongIndex }: any) {
    if(playSongList) {
      this.setData({ playSongList })
    }
    if(playSongIndex !== undefined) {
      this.setData({ playSongIndex })
    }
  },
  changeSong(isNext: boolean) {
    let songId = -1;
    let songIndex = -1;
    if(isNext) { // next song
      songIndex = this.data.playSongIndex + 1;
      songIndex = songIndex >= this.data.playSongList.length - 1 ? 0 : songIndex;
    } else { // prev song
      songIndex = this.data.playSongIndex - 1;
      songIndex = songIndex < 0 ? this.data.playSongList.length - 1 : songIndex;
    }
    playStore.setState('playSongIndex', songIndex);
    songId = this.data.playSongList[songIndex].id;
    this.setupPlayer(songId);
  },

  // handlers
  onTapNav(event: WechatMiniprogram.BaseEvent){
    this.setActiveNav(event.currentTarget.dataset.index);
  },
  onTapNavBack() {
    wx.navigateBack();
  },

  onTapPre() {
    this.changeSong(false);
  },
  
  onTapNext() {
    this.changeSong(true);
  },

  onSwiperChange(event: WechatMiniprogram.SwiperChange) {
    this.setActiveNav(event.detail.current);
  },
  onTapPlay() {
    if(audioCtx.paused) {
      this.setData({ isPlaying: false });
      audioCtx.play();
    } else {
      this.setData({ isPlaying: true });
      audioCtx.pause();
    }
  },
  onSliderChange(event: WechatMiniprogram.SliderChange) {
    const value = event.detail.value;
    const currentTime = (value/100)*this.data.duration;
    this.setData({ currentTime, currentProgress: value });
    audioCtx.seek(currentTime/1000);
    this.data.isSliding = false;
  },
  onSliderChanging(event: WechatMiniprogram.SliderChange) {
    const value = event.detail.value;
    const currentTime = value/100 * this.data.duration;
    this.setData({
      currentTime
    })
    this.data.isSliding = true;
  },
  setCurrentLyric(){
    let index = this.data.lyric.length - 1;
    for(let i=0; i<this.data.lyric.length; i++) {
      const lyric = this.data.lyric[i];
      if(lyric.time >= this.data.currentTime) {
        index = i - 1;
        this.setData({
          currentLyric: this.data.lyric[index].text,
          currentLyricIndex: index
        })
        break;
      }
    }
  },
  setActiveNav(activeIndex:number) {
    this.setData({activeNav: activeIndex});
  },
  setSongDetail(value: any) {
    this.setData({ songDetail: value, duration: value.dt || 0 })
  },
  setLyric(value: Array<{ text: string, time: number }>) {
    this.setData({ lyric: value || '' });
  },
  onUnload() {
    detailStore.offState('songDetail', this.setSongDetail);
    detailStore.offState('lyric', this.setLyric);
    playStore.offStates(['playSongList', 'playSongIndex'], this.setPlaySongInfo)
  }
});

export {};
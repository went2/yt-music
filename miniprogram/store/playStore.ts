import EventStore from './event-store/event-store';
import { 
  getSongDetail, getLyric
} from '../service/modules/playlist';
import { parseLyric } from '../utils/objhelper';

export const audioCtx = wx.createInnerAudioContext();

const playStore = new EventStore({
  state: {
    id: 0,
    songDetail: {},
    duration: 0,
    playSongList: [],
    playSongIndex: -1,
    lyric: [] as Array<{ text: string, time: number }>,
    currentLyric: '',
    currentLyricIndex: -1,
    mode: 0, // 0 列表循环 1 单曲循环 2 随机
    currentTime: 0,
    isPlaying: false,
    isFirstPlay: true
  },
  actions: {
    playNewSongWithId(ctx: any, id: number) {
      ctx.id = id;
      if(ctx.songDetail.id !== id) {
        // clear current song info
        ctx.songDetail = {};
        ctx.lyric = [];
        ctx.currentLyric = '';
        ctx.currentLyricIndex = -1;
        ctx.currentTime = 0;
        ctx.duration = 0;
      }
      getSongDetail(id).then((res: any) => {
        ctx.songDetail = res.songs[0];
        ctx.duration = res.songs[0].dt;
      }).catch(e => console.log('获取歌曲详情失败', e));
      getLyric(id).then((res: any)=> {
        ctx.lyric = parseLyric(res.lrc.lyric);
      }).catch(e => console.log('获取歌词失败', e) );

      if(ctx.isFirstPlay) {
        ctx.isFirstPlay = false;
        ctx.isPlaying = true;
        // @ts-ignore
        this.dispatch('setupAudioContextListener');
      }

      // play new song
      audioCtx.stop();
      audioCtx.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      if(ctx.isPlaying) audioCtx.autoplay = true;
    },
    setupAudioContextListener(ctx: any){
      audioCtx.onTimeUpdate(() => {
          const currentTime = audioCtx.currentTime * 1000;
          ctx.currentTime = currentTime;
          ctx.currentProgress = currentTime / ctx.duration * 100,
          // @ts-ignore
          this.dispatch('setCurrentLyricAction');
      });

      audioCtx.onEnded(() => {
        // @ts-ignore
        this.dispatch('changeNewSongAction');
      });
      audioCtx.onWaiting(() => { audioCtx.pause() });
      audioCtx.onCanplay(() => { audioCtx.play() });
    },

    changeNewSongAction(ctx: any, isNext=true){
      let index = ctx.playSongIndex;
      let length = ctx.playSongList.length;
      switch(ctx.mode) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index -1;
          if(index === -1) index = length -1;
          if(index === length) index = 0;
          break;
        case 1: // 单曲循环
          break;
        case 2: // 随机播放
          index = Math.floor(Math.random() * length);
          break;
      }
      ctx.playSongIndex = index;
      const id = ctx.playSongList[index].id
      //@ts-ignore
      this.dispatch('playNewSongWithId', id);
    },
    changePlayStatusAction(ctx: any){
      if(audioCtx.paused) {
        ctx.isPlaying = true;
        audioCtx.play();
      } else {
        ctx.isPlaying = false;
        audioCtx.pause();
      }
    },

    setCurrentLyricAction(ctx: any) {
      if(!ctx.lyric.length) return;
      let index = ctx.lyric.length - 1;
      const length = ctx.lyric.length;
      for(let i=0; i<length; i++) {
        const lyric = ctx.lyric[i];
        if(lyric.time >= ctx.currentTime) {
          index = i - 1;
          break;
        }
      }
      if(index === ctx.currentLyricIndex || index === -1) return;
      ctx.currentLyric = ctx.lyric[index].text;
      ctx.currentLyricIndex = index;
    },
  },
});

export default playStore;

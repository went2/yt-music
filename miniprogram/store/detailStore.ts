import EventStore from './event-store/event-store';
import { 
  getPlaylistDetail, getSongDetail
} from '../service/modules/playlist';

const detailStore = new EventStore({
  state: {
    playlistDetail: {},
    songDetail: {}
  },
  actions: {
    fetchPlaylistDetail(ctx: any, id: string) {
      const paramId = Number(id);
      getPlaylistDetail(paramId).then((res: any) => {
        ctx.playlistDetail = res.playlist;
      }).catch(e => {
        console.log('获取歌单详情失败', e);
      })
    },
    // 单首歌曲详情
    fetchSongDetail(ctx: any, ids: string) {
      getSongDetail(ids).then((res: any) =>　{
        ctx.songDetail = res.songs[0];
      }).catch(e => {
        console.log('获取歌曲详情', e);
      })
    }
  }
});
export default detailStore;
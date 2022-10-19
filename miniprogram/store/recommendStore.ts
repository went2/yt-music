import EventStore from './event-store/event-store';
import { 
  getPersonalizedList, getRecommentMv, getPlaylistDetail, getNewRelease
} from '../service/modules/playlist';

const recommendStore = new EventStore({
  state: {
    personalizedList: [],
    recommendMv: [],
    recommendSongs: [],
    newRelease: []
  },
  actions: {
    fetchPersonalizedList(ctx: any) {
      getPersonalizedList().then((res:any) => {
        ctx.personalizedList = res.result;
      })
    },
    fetchRecommendMv(ctx: any) {
      getRecommentMv().then((res: any) => {
        ctx.recommendMv = res.data;
      })
    },
    fetchRecommendSongs(ctx:any) {
      // 热门歌曲榜单详情
      getPlaylistDetail(3778678).then((res:any) => {
        ctx.recommendSongs = res.playlist.tracks;
      })
    },
    fetchNewRelease(ctx: any) {
      getNewRelease().then((res: any) => {
        ctx.newRelease = res.albums;
      })
    }
  }
});

// module.exports = recommendStore;
export default recommendStore;

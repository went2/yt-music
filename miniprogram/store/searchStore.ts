import EventStore from './event-store/event-store';
import { getHotSearch } from '../service/modules/search';

const searchStore = new EventStore({
  state: {
    hotSearch: []
  },
  actions: {
    fetchHotSearchList(ctx: any) {
      getHotSearch().then((res: any) => {
        ctx.hotSearch = res.result.hots;
      }).catch(err => {
        console.log('获取热门搜索失败', err);
      })
    }
  }
});

export default searchStore;
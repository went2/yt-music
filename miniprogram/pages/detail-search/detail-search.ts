import searchStore from '../../store/searchStore';
import { getSuggestList } from '../../service/modules/search';

Page({
  data: {
    hotSearch: [],
    isSearching: false,
    suggestList: [],
    resultList: [],
    keyword: ''
  },
  onLoad() {
    // 订阅store
    searchStore.onState('hotSearch', this.setHotSearch);
    searchStore.dispatch('fetchHotSearchList');
  },
  // event handlers
  onSearchChange(event: WechatMiniprogram.CustomEvent) {
    const keywords = event.detail as any;
    if(keywords !== '') {
      this.setData({ isSearching: true });
      getSuggestList(keywords).then((res: any) => {
        const result = res.result.allMatch
        console.log(result);
        
        this.setData({ 
          suggestList: result || []
         });
      });
    } else {
      this.setData({ suggestList: [], isSearching: false})
    }

  },

  // utils
  flatSuggestList(obj: any): Array<{name: string, type: string}> {
    const keys = obj.order as string[];
    const result = [] as Array<{name: string, type: string}>;
    keys.forEach((key) => {
      let item = { name: obj[key] as string, type: key };
      result.push(item);
    });
    return result;
  },


  // callbacks
  setHotSearch(hotSearch: any) {
    this.setData({ hotSearch });
  },

  onUnload() {
    searchStore.offState('hotSearch', this.setHotSearch);
  }
})
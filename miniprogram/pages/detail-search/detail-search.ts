import searchStore from '../../store/searchStore';
import { getSuggestList } from '../../service/modules/search';
import { debounce } from 'underscore';

Page({
  behaviors: [ Behavior({
    observers: {
      searchValue(newValue) {
        if(newValue) {
          this.setData({ isSearching: true });
          //@ts-ignore
          this.fetchSuggestList();
        } else {
          this.setData({ suggestList: [], isSearching: false })
        }
      }
    }
  }) ],
  data: {
    hotSearch: [],
    isSearching: false,
    suggestList: [],
    resultList: [],
    searchValue: ''
  },
  onLoad() {
    // 订阅store
    searchStore.onState('hotSearch', this.setHotSearch);
    searchStore.dispatch('fetchHotSearchList');
  },
  // event handlers
  onSearchChange: debounce(function(event: WechatMiniprogram.CustomEvent) {
    const keywords = event.detail as any;
    //@ts-ignore
    this.setData({ searchValue: keywords });
  }, 200),

  fetchSuggestList() {
    getSuggestList(this.data.searchValue).then((res: any) => {
      const result = res.result.allMatch
      console.log(result);
      this.setData({ 
        suggestList: result || []
       });
    });
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
import req from '../request/index';

export function getHotSearch() {
  return req.get({
    url: '/search/hot'
  });
}

export function getSuggestList(keywords: string) {
  return req.get({
    url: '/search/suggest',
    data: { keywords, type: 'mobile' }
  });
}

export function getSearchedSongs(keywords: string) {
  return req.get({
    url: '/cloudsearch',
    data: { keywords }
  })
}
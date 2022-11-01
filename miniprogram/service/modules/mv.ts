import req from '../request/index';

export function getMvInfo(mvid: number) {
  return req.get({
    url: '/mv/detail',
    data: { mvid }
  })
}

export function getMvUrl(id: number) {
  return req.get({
    url: '/mv/url',
    data: { id }
  })
}

export function getRelativeMv(id: number) {
  return req.get({
    url: '/related/allvideo',
    data: { id }
  })
}
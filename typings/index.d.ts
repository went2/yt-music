/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    // userInfo?: WechatMiniprogram.UserInfo,
    navBarInfo: {
      navBarHeight: number, // 导航栏高度
      menuRight: number, // 胶囊距右方间距
      menuTop: number, // 胶囊距顶部间距
      menuHeight: number, // 胶囊高度
      menuWidth: number,
    }
  } | any
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}
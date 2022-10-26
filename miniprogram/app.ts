// app.ts
App<IAppOption>({
  globalData: {
    navBarInfo: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距
      menuTop: 0,
      menuHeight: 0,
      menuWidth: 0
    },
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    MENU_BAR_HEIGHT: 44
  },
  onLaunch() {
    // init navbar data
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    this.globalData.screenWidth = systemInfo.screenWidth;
    this.globalData.screenHeight = systemInfo.screenHeight;
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    // navBarHeight = statusBarHeight + 44
    this.globalData.navBarInfo!.navBarHeight =  systemInfo.statusBarHeight + 44;
    this.globalData.navBarInfo.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.navBarInfo.menuTop = menuButtonInfo.top;
    this.globalData.navBarInfo.menuHeight = menuButtonInfo.height;
    this.globalData.navBarInfo.menuWidth = menuButtonInfo.width;

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})
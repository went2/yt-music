// app.ts
App<IAppOption>({
  globalData: {
    navBarInfo: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距
      menuTop: 0,
      menuHeight: 0,
      menuWidth: 0
    }

  },
  onLaunch() {
    // init navbar data
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // navBarHeight = statusBarHeight + 44
    this.globalData.navBarInfo!.navBarHeight =  systemInfo.statusBarHeight + 44;
    this.globalData.navBarInfo.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.navBarInfo.menuTop = menuButtonInfo.top;
    this.globalData.navBarInfo.menuHeight = menuButtonInfo.height;
    this.globalData.navBarInfo.menuWidth = menuButtonInfo.width;

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})
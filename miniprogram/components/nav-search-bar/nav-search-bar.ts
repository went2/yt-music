// components/navigation-bar/navigation-bar.ts
const app = getApp();
Component({
  properties: {

  },

  data: {
    navBarHeight: app.globalData.navBarInfo.navBarHeight,
    menuRight: app.globalData.navBarInfo.menuRight,
    menuTop: app.globalData.navBarInfo.menuTop,
    menuHeight: app.globalData.navBarInfo.menuHeight,
    menuWidth: app.globalData.navBarInfo.menuWidth,
  },

  methods: {

  }
})

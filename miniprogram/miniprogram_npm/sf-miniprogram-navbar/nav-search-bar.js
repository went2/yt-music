Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    logoImg: {
      type: String,
      value: ''
    },
    searchImg: {
      type: String,
      value: ''
    }
  },
  observers: {
    "title": function(newValue) {
      if(newValue) {
        this.setData({ customizedTitle: newValue, isShowTitle: true });
      }
    },
    "logoImg": function(newSrc) {
      if(newSrc) {
        this.setData({ customizedLogoImage: newSrc, isShowLogo: true, isShowTitle: true })
      }
    },
    "searchImg": function(newSrc) {
      if(newSrc) {
        this.setData({ customizedLogoImage: newSrc });
      }
    }
  },
  data: {
    customizedTitle: '',
    customizedLogoImage: '',
    isShowLogo: false,
    isShowTitle: false,
    navBarHeight: 0,
    menuRight: 0,
    menuTop: 0,
    menuHeight: 0,
    menuWidth: 0,
    customizedSearchImage: "data:image/png;base64,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"
  },
  methods: {
    onSearchTab() {
      this.triggerEvent('tap-search');
    },
    // util function
    getNavBarInfo() {
      const sysInfo = wx.getSystemInfoSync();
      const menuInfo = wx.getMenuButtonBoundingClientRect();
      const navBarInfo = {
        navBarHeight: sysInfo.statusBarHeight + 44,
        menuRight: sysInfo.screenWidth - menuInfo.right,
        menuTop: menuInfo.top,
        menuHeight: menuInfo.height,
        menuWidth: menuInfo.width
      }
      this.setNavBarInfo(navBarInfo);
      // store in localstorage
      wx.setStorage({
        key: 'navBarInfo',
        data: navBarInfo
      });
    },
    setNavBarInfo(navBarInfo) {
      this.setData({ 
        navBarHeight: navBarInfo.navBarHeight,
        menuRight: navBarInfo.menuRight,
        menuTop: navBarInfo.menuTop,
        menuHeight: navBarInfo.menuHeight,
        menuWidth: navBarInfo.menuWidth
       });
    }
  },
  lifetimes: {
    attached() {
      wx.getStorage({ key: 'navBarInfo' })
      .then((res) => {
        console.log(res);
        if(res.data) { this.setNavBarInfo(res.data) }
      })
      .catch(() => {
        this.getNavBarInfo();
      })
    }
  }
})

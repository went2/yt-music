
Component({
  properties: {
    songGroup: {
      type: Array,
      value: []
    }
  },
  lifetimes: {
  },
  methods: {
    onTapItem(event: WechatMiniprogram.BaseEvent) {      
      this.triggerEvent('tap-item', event.currentTarget.dataset.id);
    }
  }

})

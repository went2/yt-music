import EventStore from './event-store/event-store';

const playStore = new EventStore({
  state: {
    playSongList: [],
    playSongIndex: -1
  }
});

export default playStore;

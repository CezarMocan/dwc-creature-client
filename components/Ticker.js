class Ticker {
    constructor(fps) {
      this.fps = fps
      this.id = -1
      this.tick = this.tick.bind(this)
      this.listeners = {}
      this.listenersCount = 0
    }
    startTicker() {
      this.id = setInterval(this.tick, 1000 / this.fps)
    }
    stopTicker() {
      clearInterval(this.id)
    }
    registerListener(l) {
      const key = ++this.listenersCount
      this.listeners[key] = l
      return key
    }
    unregisterListener(key) {
      if (!this.listeners[key]) return
      delete this.listeners[key]
    }
    tick() {
      Object.values(this.listeners).forEach(l => l())
    }
  }

  export const GlobalTicker = new Ticker(12)
  GlobalTicker.startTicker()
require('./main.scss')
const Vue = require('vue').default
const midiParser = require('midi-file-parser')
const Track = require('./Track')
const Stage = require('@createjs/easeljs').Stage
const Shape = require('@createjs/easeljs').Shape


var app = new Vue({
  el: '#app',
  data: {
    ticksPerBeat: null,
    tracks: [],
    barsPerPage: 8,
    beatsPerBar: 4,
    trackIndex: null,
    marginTop: 20,
    height: 5,
    pageWidth: 500
  },
  computed: {
    beatsPerPage() {
      return this.beatsPerBar * this.barsPerPage
    },
    ticksPerPage() {
      return this.ticksPerBeat * this.beatsPerPage
    },
    notes() {
      if (this.tracks.length == 0) { return [] }
      let track = this.tracks[this.trackIndex]
      return new Track(track).notes
    },
    plots() {
      // ページ割TODO アートボードサイズ指定TODO インターバル指定TODO
      return this.notes.map(note => {
        return {
          x: (this.pageWidth / this.ticksPerPage) * note.tick,
          y: note.noteNumber,
          h: this.height,
          w: (this.pageWidth / this.ticksPerPage) * note.duration
        }
      })
    },
    pagedPlots() {
      let pages = []
      this.notes.forEach(note => {
        let page = note.tick / this.ticksPerPage
        let overflow = note.tick + note.duration - this.ticksPerPage
        // 3ページまたぐことはないとし、はみ出たブロックを次のページに配置する
        if (overflow > 0) {
          const overflowPlot = {
            x: 0, y: note.noteNumber, h: this.height,
            w: (this.pageWidth / this.ticksPerPage) * overflow
          }
          pages[page + 1] = pages[page + 1] || []
          pages[page + 1].push(overflowPlot)
        }
        const plot = {
          x: (this.pageWidth / this.ticksPerPage) * note.tick,
          y: note.noteNumber, h: this.height,
          w: (this.pageWidth / this.ticksPerPage) * note.duration
        }
        pages[page] = pages[page] || []
        pages[page].push(plot)
      })
      return pages
    }
  },
  methods: {
    fileChanged(e) {
      let reader = new FileReader()
      reader.onloadend = () => {
        let bin = reader.result
        let data = midiParser(bin)
        this.ticksPerBeat = data.header.ticksPerBeat
        this.tracks = data.tracks
      }
      reader.readAsBinaryString(e.target.files[0])
    },
    preview() {
      let stage = new Stage('preview')
      this.pagedPlots.forEach(plots => {
        // こっちで。枠増やす
      })
      this.plots.forEach(plot => {
        let shape = new Shape()
        shape.graphics.beginFill("black").drawRect(plot.x, plot.y, plot.w, plot.h)
        stage.addChild(shape)
      })
      stage.update()
    }
  }
})

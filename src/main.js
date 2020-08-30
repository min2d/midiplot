require('./main.scss')
const Vue = require('vue').default
const Vuex = require('vuex').default
const midiParser = require('midi-file-parser')
const Track = require('./Track')
const Page = require('./components/page.vue').default
const KeyFilterForm = require('./components/keyFilterForm.vue').default

const exscript = require('raw-loader!./templates/exscript.js').default
const exscriptLayer = require('raw-loader!./templates/exscriptLayer.js').default

Vue.use(Vuex)
const store = require('./store').default


new Vue({
  store: store,
  el: '#app',
  components: {
    Page,
    KeyFilterForm
  },
  data: {
    ticksPerBeat: null,
    tracks: [],
    barsPerPage: 8,
    beatsPerBar: 4,
    trackIndex: null,
    marginTopOrBottom: 4.5,
    isMarginTopActive: 0, //true-falseを使用すると文字列になるので0-1を使用
    blockHeight: 3,
    blockInterval: 2.5,
    pageWidth: 960,
    pageHeight: 154,
  },
  computed: {
    beatsPerPage() {
      return this.beatsPerBar * this.barsPerPage
    },
    ticksPerPage() {
      return this.ticksPerBeat * this.beatsPerPage
    },
    tickWidth() {
      return (this.pageWidth / this.ticksPerPage).toFixed(8)
    },
    marginTop(){
      if(this.isMarginTopActive){
        return this.marginTopOrBottom
      }else{
        const bodyHeight = (this.$store.state.keyList.length-1) * (this.blockHeight + this.blockInterval) + this.blockHeight
        return this.pageHeight-this.marginTopOrBottom - bodyHeight
      }
    },
    notes() {
      if (this.tracks.length == 0) { return [] }
      let track = this.tracks[this.trackIndex]
      return new Track(track).notes
    },
    keyList() {
      return this.$store.state.keyList
    },
    pagedPlots() {
      let pages = []
      this.notes.forEach(note => {
        const keyIndex = this.keyList.indexOf(note.noteNumber)
        if (keyIndex == -1) return
        let page = Math.floor(note.tick / this.ticksPerPage)
        let tick = note.tick - this.ticksPerPage * page
        let overflow = tick + note.duration - this.ticksPerPage

        let plot = {}
        if (overflow > 0) {
          const overflowPlot = {
            x: 0,
            y: (this.blockHeight + this.blockInterval) * keyIndex + this.marginTop,
            h: this.blockHeight,
            w: this.tickWidth * overflow
          }
          pages[page + 1] = pages[page + 1] || []
          pages[page + 1].push(overflowPlot)
          plot = {
            x: (this.tickWidth * tick),
            y: (this.blockHeight + this.blockInterval) * keyIndex + this.marginTop,
            h: this.blockHeight,
            w: (this.tickWidth * (note.duration- overflow))
          }
        }else{
          plot = {
            x: (this.tickWidth * tick),
            y: (this.blockHeight + this.blockInterval) * keyIndex + this.marginTop,
            h: this.blockHeight,
            w: (this.tickWidth * note.duration)
          }
        }
        pages[page] = pages[page] || []
        pages[page].push(plot)
      })
      return pages
    },
    outputScript() {
      let text = `var w=${this.pageWidth};var h=${this.pageHeight};`
      text += 'var pagedPlots='
      text += JSON.stringify(this.pagedPlots)
      return text
    },
  },
  methods: {
    fileChanged(e) {
      if (!e.target) return;
      let reader = new FileReader()
      reader.onloadend = () => {
        let bin = reader.result
        let data = midiParser(bin)
        this.ticksPerBeat = data.header.ticksPerBeat
        this.tracks = data.tracks
      }
      reader.readAsBinaryString(e.target.files[0])
    },
    downloadMainScript() {
      this.download(exscript, 'main.jsx')
    },
    downloadMainScriptLayer() {
      this.download(exscriptLayer, 'main.jsx')
    },
    downloadDataScript() {
      if (this.pagedPlots.length < 1) return;
      this.download(this.outputScript, 'data.jsx')
    },
    download(text, name) {
      let blob = new Blob([text])
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = name
      link.click()
      link.remove()
    }
  }
})

module.exports = class Track {

  // midi-file-parser のtrackを引数に取ります。
  constructor(smfTrack) {
    this._notes = []
    if (!Array.isArray(smfTrack)) return
    let tick = 0
    let noteOnTicks = {} // noteOnTicks[number] = tick
    smfTrack.forEach(event => {
      tick += event.deltaTime
      if (event.subtype == 'noteOn') {
        noteOnTicks[event.noteNumber] = tick
      } else if (event.subtype == 'noteOff') {
        let noteOnTick = noteOnTicks[event.noteNumber]
        if (noteOnTick) {
          const duration = tick - noteOnTick
          const note = {
            duration,
            tick: noteOnTick,
            noteNumber: event.noteNumber
          }
          this._notes.push(note)
        }
      }
    })
  }
  get notes() {
    return this._notes
  }
}
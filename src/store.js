const createPersistedState = require("vuex-persistedstate").default
const Vuex = require('vuex').default

export default new Vuex.Store({
  state: {
    keyList: []
  },
  mutations: {
    changeKeyList(state, num) {
      // 対象の番号がなければ追加、あれば外す
      let index = state.keyList.indexOf(num)
      if (index >= 0) {
        state.keyList.splice(index, 1)
      } else {
        state.keyList.push(num)
        state.keyList.sort((a, b) => { return b - a })
      }
    },
    setKeyList(state, list) {
      state.keyList = list
    }
  },
  plugins: [createPersistedState()],
})

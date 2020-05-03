<template>
  <div class="keys">
    <div>
      音域設定
      <button
        v-for="item in presets"
        :key="item.name"
        class="button"
        @click="setKeyList(item.keys)"
      >
        {{ item.name }}
      </button>
    </div>
    <div>{{ keyList }}</div>

    <div style="overflow-x:scroll;display:flex;">
      <div
        v-for="i in [1,2,3,4,5,6,7]"
        :key="i"
        style="border:1px solid gray;"
      >
        <div style="text-align:center;">
          {{ i }}
        </div>
        <div style="display:flex;width:224px;height:78px;position:relative;">
          <div
            v-for="j in [0,1,2,3,4,5,6,7,8,9,10,11]"
            :key="j"
            class="tile"
            :class="{active: keyFilter[(i+1)*12+j]}"
            :style="style[j]"
            @click="tileClicked(i,j)"
          >
            {{ keyNames[j] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const keyPreset = require("../data.json").keyPreset;
const mapMutations = require("vuex").mapMutations;
module.exports = {
  data() {
    return {
      keyNames: "C,C#,D,D#,E,F,F#,G,G#,A,A#,B".split(","),
      style: [],
      presets: keyPreset
    };
  },
  props: {},
  computed: {
    keyList() {
      return this.$store.state.keyList;
    },
    keyFilter() {
      let arr = new Array(100).fill(false);
      this.keyList.forEach(num => {
        arr[num] = true;
      });
      return arr;
    }
  },
  methods: {
    ...mapMutations(["setKeyList"]),
    tileClicked(i, j) {
      const keynum = (i + 1) * 12 + j;
      this.$store.commit("changeKeyList", keynum);
    }
  },
  mounted() {},
  created() {
    // vv 共通スタイル vv
    const tileWidth = 30;
    const tileHeight = 30;
    const tileBoader = 2;
    let arr = [];
    for (let i = 0; i < 12; i++) {
      let left = (i * (tileWidth + tileBoader)) / 2;
      if (i > 4) {
        left += tileWidth / 2 + tileBoader;
      }
      let top = 0;
      let bg = "#ddd";
      if ([1, 3, 6, 8, 10].indexOf(i) == -1) {
        top = tileHeight + tileBoader;
        bg = "#fff";
      }
      arr.push({ marginLeft: left, marginTop: top, backgroundColor: bg });
    }
    this.style = arr;
    // ^^ 共通スタイル ^^
  }
};
</script>

<style lang="scss">
.tile {
  width: 30px;
  height: 30px;
  border-radius: 3px;
  border: 1px solid #aaa;
  position: absolute;
  text-align: center;
  box-sizing: border-box;
  user-select: none;
}
.active {
  border: 2px solid red;
}
</style>
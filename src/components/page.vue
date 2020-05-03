<template>
  <div
    class="preview"
    style="overflow-x:scroll;"
  >
    <canvas
      :id="'canvas-' +num"
      :width="w"
      :height="h"
      :style="{width:w+'px',height:h+'px'}"
    />
  </div>
</template>

<script>
const Stage = require("@createjs/easeljs").Stage;
const Shape = require("@createjs/easeljs").Shape;
module.exports = {
  data() {
    return {};
  },
  props: {
    plots: Array,
    num: Number,
    w: Number,
    h: Number
  },
  computed: {},
  methods: {
    draw() {
      if (!this.plots) return;
      let stage = new Stage("canvas-" + this.num);
      this.plots.forEach(plot => {
        let shape = new Shape();
        shape.graphics
          .beginStroke("black")
          .drawRect(plot.x, plot.y, plot.w, plot.h);
        stage.addChild(shape);
      });
      stage.update();
    }
  },
  watch: {
    plots() {
      this.draw();
    }
  },
  mounted() {
    this.draw();
  }
};
</script>

<style lang="scss">
.preview {
  border: 1px solid #aaaaaa;
}
</style>
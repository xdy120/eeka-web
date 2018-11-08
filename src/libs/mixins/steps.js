const Steps = {
  data() {
    return {
      step: 0,
      steps: 0,
      stepTitle: null,
      stepsRef: 'dataSteps',
    };
  },
  watch: {
    step(val) {
      if (this.$refs[this.stepsRef]) {
        this.stepTitle = this.$refs[this.stepsRef].$data.steps[val].title;
      }
    }
  },
  updated() {
    if (this.$refs[this.stepsRef]) {
      this.steps = this.$refs[this.stepsRef].$data.steps.length;
    }
  },
  computed: {
    prevDisabled() {
      return this.step <= 0;
    },
    prevText() {
      return '上一步';
    },
    nextText() {
      if (this.step >= this.steps - 1) {
        return '确认';
      } else {
        return '下一步';
      }
    }
  },
  methods: {
    prev() {
      if (this.step > 0) {
        this.step--;
      }
    },
    next(finish) {
      if (this.step === this.steps - 1) {
        if (finish) {
          finish();
        } else {
          if (this.save) {
            this.save();
          }
        }
        if(!this.isRequestSend){
          this.isRequestSend = true;
        }
        return;
      }
      this.step++;
    },
  }
};
export default Steps;
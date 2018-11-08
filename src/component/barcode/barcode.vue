<template>
  <svg class="barcode"
       :jsbarcode-format="format"
       :jsbarcode-value="content"
       :jsbarcode-height="lineHeight"
       :jsbarcode-width="lineWidth">
  </svg>
</template>

<script>
  import JsBarcode from 'jsbarcode';
  import {Edit} from '@/libs/mixins';

  export default {
    name: 'barcode',
    mixin: [Edit],
    props: {
      content: String,
      format: {
        default: 'CODE128'
      },
      lineHeight: {
        default: 50
      },
      lineWidth: {
        default: 2
      }
    },
    mounted() {
      JsBarcode('.barcode').init();
    },
    watch: {
      content() {
        this.$nextTick(() => {
          JsBarcode('.barcode').init();
        });
      }
    }
  };
</script>

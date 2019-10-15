<template>
  <div>
    <a style="color: green" @click="showOrderTrack">{{orderNumTrack}}</a>
  </div>

</template>

<script>
export default {
  name: 'orderNumTrack',
  props: {
    orderNumTrack: String
  },
  methods: {
    showOrderTrack () {

    }
  }
}
</script>

<style scoped>

</style>

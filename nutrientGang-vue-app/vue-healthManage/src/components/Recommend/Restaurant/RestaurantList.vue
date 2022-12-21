<template>
  <v-container fluid>
    <RestaurantMap :menu="menu"/>
  </v-container>
</template>

<script>
const RestaurantMap = () => import("@/components/Recommend/Restaurant/RestaurantMap.vue")

export default {
  name : 'RestaurantList',
  props : {
    menu : Object
  },
  components : {
    "RestaurantMap" : RestaurantMap
  }
}
</script>

<style>

</style>
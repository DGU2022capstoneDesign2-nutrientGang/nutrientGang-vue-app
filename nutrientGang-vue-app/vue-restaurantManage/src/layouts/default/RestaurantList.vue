<template>
  
  <v-container fluid>
    <RestaurantMap v-bind:restaurants="restaurants"/>
  </v-container>
</template>

<script>
const RestaurantMap = () => import("@/layouts/default/RestaurantMap.vue")

import {api} from "@/api.js"  //axios로 변경
import axios from 'axios'

export default {
  name : 'RestaurantList',
  data(){
    return {
      restaurants : []
    }
  },

  mounted(){
        
    axios.get('/api/rtr')
    .then((res)=>{
      console.log(res.data.success, res.data.restaurants);
      if (res.data.success === true){
        this.restaurants = res.data.restaurants;                            
      }else{
        api.restaurant.restaurantAll(res => {
          
          // 음식점state 할당
          this.restaurants = res.restaurants;
        });
      }
    })
    .catch(err =>{
        console.log(err.message)
        api.restaurant.restaurantAll(res => {
          
          // 음식점state 할당
          this.restaurants = res.restaurants;
        });
    });
  },

  components : {
    "RestaurantMap" : RestaurantMap
  }
}
</script>

<style>

</style>
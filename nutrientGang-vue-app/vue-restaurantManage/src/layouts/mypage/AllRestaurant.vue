<template>
  <v-container fluid>
        <!--등록한 음식점 제목-->
        <div class="text-center">
            <h1 class="text--primary font-weight-black">내가 등록한 음식점들</h1>
        </div>

        <!--등록한 음식점 정보-->
        <v-card>
            <v-row class="ma-3">
                <v-col v-for="rtr,i in this.restaurants" :key="i" cols="12" sm="6" md="4" lg="3"
                class="restaurant">
                    <v-card>
                      <v-card-title class="justify-center">
                        <v-btn color="blue" class="white--text" @click="updatePage(rtr)">
                          수정하기(클릭)<v-icon right dark>mdi-alert-circle-outline</v-icon>
                        </v-btn>
                      </v-card-title>
                    </v-card>
                    <v-card>
                    <RestaurantVue v-bind:rtr="rtr" ></RestaurantVue>
                    </v-card>

                </v-col>
            </v-row>
        </v-card>
  </v-container>
</template>

<script>
const RestaurantVue = () => import("@/layouts/default/Restaurant.vue")

import {api} from "@/api.js"  //axios로 변경
import axios from 'axios'

export default {
  name : 'AllRestaurant',
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
    "RestaurantVue" : RestaurantVue
  },

  methods : {
    updatePage(rtr){
      
      console.log(rtr)
      this.$router.push({
        name : 'UpdateRestaurant', 
        params : {
            rtr: rtr
        }
        
      });

    }
  },

}
</script>

<style>

</style>
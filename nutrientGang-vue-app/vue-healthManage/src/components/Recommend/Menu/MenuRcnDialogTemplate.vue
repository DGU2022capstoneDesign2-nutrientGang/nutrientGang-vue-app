<template>
  
  <div class="fill-height mt-10" v-if="isError">
      <v-row justify="center">
          <v-col cols="auto">
              <ServerErrorComponent/>
          </v-col>
      </v-row>
  </div>
  <div class="fill-height mt-10" v-else-if="isNotMenuError">
      <v-row justify="center">
          <v-col cols="auto">
              <NotMenuInfoComponent/>
          </v-col>
      </v-row>
  </div>
  <v-container fluid v-else>
    <v-data-iterator :items="rcnItems"
      :sort-by="sortByModel" :sort-desc="sortDescModel"
      hide-default-footer>

      <!--1. 정렬 창, 정렬 방법 버튼-->
      <template v-slot:header>
        <v-row align="center" justify="center">

          <!--정렬 창-->
          <v-col cols="8">
            <v-select v-model="sortByModel" :items="sortKeys" label="정렬 기준"
            outlined hide-details
            append-icon="mdi-sort" 
            ></v-select>
          </v-col>
        
          <v-spacer></v-spacer>
        
          <!--정렬 방법 버튼-->
          <v-col cols="4">
            <v-btn-toggle v-model="sortDescModel" mandatory dense>
              <v-btn small text color="#03C04A" elevation="14"
              :value="false" dark>
                <v-icon>mdi-arrow-up-bold-box</v-icon>
              </v-btn>
              <v-btn small text color="#03C04A" elevation="14"
              :value="true" dark>
                <v-icon>mdi-arrow-down-bold-box</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </template>


      <!--본문-->
      <template v-slot:default="props">
        <v-row class="borderColor">
          
          <!--1개 정보 반복-->
          <v-col v-for="item in props.items" :key="item.이름" 
          cols="12" sm="6" md="4" lg="3">  
            <!--1개 정보-->
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                <v-row justify="center" align="center">
                  <v-col cols="auto">
                    <div>{{ item.이름 }}</div>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn color="#03C04A" small outlined
                    @click="goRestaurantRcn(item)">
                      <v-icon left>mdi-home-variant</v-icon> 음식점
                      </v-btn>                    
                  </v-col>
                </v-row>
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  
                  <v-list-item-content :class="{ 'blue--text': sortByModel === key }">
                    {{ key }}:
                  </v-list-item-content>
                  <v-list-item-content class="align-end" :class="{ 'blue--text': sortByModel === key }">
                    {{ item[key] }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

        </v-row>
      </template>


    </v-data-iterator>
  </v-container>
</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
const NotMenuInfoComponent = () => import("@/components/ErrorComponent/NotMenuInfoComponent.vue");
  export default {
    name : 'MenuRcnDialogTemplate',
    props : {
      rcnItems : {
        type : Array
      },

      isError : {
        type : Boolean
      },

      isNotMenuError : {
        type : Boolean
      }
    },
    components : {
      "ServerErrorComponent" : ServerErrorComponent,
      "NotMenuInfoComponent" : NotMenuInfoComponent,
    },

    data () {
      return {
        
        sortDescModel: false,
        sortByModel: '이름',
        sortKeys: ['이름','칼로리','탄수화물','단백질','지방'],
        
      }
    },

    computed: {
      filteredKeys () {
        return this.sortKeys.filter(key => key !== '이름')
      },
    },

    methods : {
      goRestaurantRcn(item){
        const menu = {
          name : item.이름,
          kcal : item.칼로리,
          carbo : item.탄수화물,
          protein : item.단백질,
          fat : item.지방
        }

        this.$router.push({
          name : "RestaurantRcn",
          params : {
            initMenu : menu
          }
        })
      }
    }

  }
</script>

<style>

</style>
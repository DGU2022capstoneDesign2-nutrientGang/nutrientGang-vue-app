<template>
 
  <div class="fill-height" v-if="isError">
      <v-row justify="center">
          <v-col cols="auto" class="mt-5">
              <ServerErrorComponent/>
          </v-col>
      </v-row>
  </div>
  <div v-else>
    <!--탄수화물 제목 / 초과 시 Chip / 그래프 --> 
    <div>
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          <div>탄수화물 <strong class="black--text">{{dateCarbo}}g</strong> / <strong class="grey--text">{{recommendCarbo}}g</strong></div>
        </v-col>
        <v-col cols="auto">
          <v-chip v-if="isCarboExcess" class="ma-2" color="red" text-color="white" small>
            초과
          </v-chip>
        </v-col>
      </v-row>
      <div>
        <v-progress-linear :value="leftPercentCarbo" color="blue" height="25">
          <strong>{{ Math.ceil(leftPercentCarbo) }}%</strong>
        </v-progress-linear>
      </div>
    </div>

    <br>

    <!--단백질 제목 / 초과 시 Chip / 그래프 --> 
    <div>
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          <div>단백질 <strong class="black--text">{{dateProtein}}g</strong> / <strong class="grey--text">{{recommendProtein}}g</strong></div>
        </v-col>
        <v-col cols="auto">
          <v-chip v-if="isProteinExcess" class="ma-2" color="red" text-color="white" small>
            초과
          </v-chip>
        </v-col>
      </v-row>
      <div>
        <v-progress-linear :value="leftPercentProtein" color="blue" height="25">
          <strong>{{ Math.ceil(leftPercentProtein) }}%</strong>
        </v-progress-linear>
      </div>
    </div>

    <br>

    <!--지방 제목 / 초과 시 Chip / 그래프 --> 
    <div>
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          <div>지방 <strong class="black--text">{{dateFat}}g</strong> / <strong class="grey--text">{{recommendFat}}g</strong></div>
        </v-col>
        <v-col cols="auto">
          <v-chip v-if="isFatExcess" class="ma-2" color="red" text-color="white" small>
            초과
          </v-chip>
        </v-col>
      </v-row>
      <div>
        <v-progress-linear :value="leftPercentFat" color="blue" height="25">
          <strong>{{ Math.ceil(leftPercentFat) }}%</strong>
        </v-progress-linear>
      </div>
    </div>

  </div>
</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
import Diary from '@/api/Diary';
export default {
    name : 'DiaryNutrient',
    props: {
        date : {
            type : String,
            default : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
        },
    },
    components : {
      "ServerErrorComponent" : ServerErrorComponent
    },

    watch : {
      date : {
        immediate : true,
        handler(date){

          Diary.getNutrient(date)
          .then((res) => {
            this.isError = false;
            console.log(res.data.message);
            if(res.data.isSuccess === true && res.data.code === 1000){
                //중요) 요청에 성공하였습니다.
                this.recommendCarbo = res.data.result.needNutrient.carbohydrate;
                this.dateCarbo = res.data.result.haveNutrient.carbohydrate;
                this.recommendProtein = res.data.result.needNutrient.protein;
                this.dateProtein = res.data.result.haveNutrient.protein;
                this.recommendFat = res.data.result.needNutrient.fat;
                this.dateFat = res.data.result.haveNutrient.fat;
            }else if (res.data.isSuccess === false && res.data.code === 2014){
                //중요) 건강정보를 찾을 수 없습니다.
                this.recommendCarbo = 0;
                this.dateCarbo = 0;
                this.recommendProtein = 0;
                this.dateProtein = 0;
                this.recommendFat = 0;
                this.dateFat = 0;
            }else if (res.data.isSuccess === false && res.data.code === "NO_AUTHORIZATION"){
                //중요) 인증 정보 없으니까 로그아웃 후 리다이렉션
                //돌리기 -> 하지만 이미 레이아웃이 그려지기 전에 이미 재발행 받아서 로그인 페이지로 돌려지지 않음
                this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push({
                        name : "sign-in",
                    });
                });
            }
          })
          .catch((err)=>{
              //중요) 서버 오류입니다.
              //뜨기 -> alert메시지 뜨기
              console.log(err);
              this.isError = true;
          })
        }
      }
    },

    data(){
        return {

            //에러 판단
            isError : false,

            recommendCarbo: 0,    //일일 권장 탄수화물
            dateCarbo : 0,         //사용자의 날짜별 탄수화물

            recommendProtein : 0, //일일 권장 단백질
            dateProtein: 0,        //사용자의 날짜별 단백질

            recommendFat: 0,      //일일 권장 지방
            dateFat: 0,           //사용자의 날짜별 지방
        }
    },

    computed: {

        isCarboExcess(){
            return this.recommendCarbo < this.dateCarbo
        },

        leftPercentCarbo(){
            if(this.recommendCarbo < this.dateCarbo){
              return 100
            }else if(this.recommendCarbo === 0 && this.dateCarbo === 0){
              return 0
            }
            
            return (this.dateCarbo / this.recommendCarbo) * 100
            
        },

        isProteinExcess(){
            return this.recommendProtein < this.dateProtein
        },

        leftPercentProtein(){
            if(this.recommendProtein < this.dateProtein){
              return 100
            }else if(this.recommendProtein === 0 && this.dateProtein === 0){
              return 0
            }

            return (this.dateProtein / this.recommendProtein) * 100
            
        },

        isFatExcess(){
            return this.recommendFat < this.dateFat
        },

        leftPercentFat(){
            if(this.recommendFat < this.dateFat){
              return 100
            }else if(this.recommendFat === 0 && this.dateFat === 0){
              return 0
            }
            
            return (this.dateFat / this.recommendFat) * 100
            
        }
    }
    
}
</script>

<style>

</style>
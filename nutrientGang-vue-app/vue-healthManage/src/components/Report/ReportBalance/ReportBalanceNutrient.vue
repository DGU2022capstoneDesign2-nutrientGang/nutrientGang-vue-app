<template>
 
  <div class="fill-height" v-if="isError">
      <v-row justify="center">
          <v-col cols="auto" class="mt-5">
              <ServerErrorComponent/>
          </v-col>
      </v-row>
  </div>
  <div v-else>
    <!--탄수화물 섭취비율 / 1주 섭취 평균양 / 권장량 --> 
    <v-row>
      <v-col cols="auto">
        <v-icon x-small color="rgb(255, 99, 132)" left>mdi-checkbox-blank</v-icon>
        탄수화물(섭취평균) <span class="grey--text">{{recommendCarboPercent}}%</span>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="auto">
        {{weekCarbo}}/{{recommendCarbo}}g
      </v-col>
    </v-row>

    <!--단백질 섭취비율 / 1주 섭취 평균양 / 권장량 --> 
    <v-row>
      <v-col cols="auto">
        <v-icon x-small color="rgb(54, 162, 235)" left>mdi-checkbox-blank</v-icon>
        단백질(섭취평균) <span class="grey--text">{{recommendProteinPercent}}%</span>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="auto">
        {{weekProtein}}/{{recommendProtein}}g
      </v-col>
    </v-row>
    
    <!--지방 섭취비율 / 1주 섭취 평균양 / 권장량 --> 
    <v-row>
      <v-col cols="auto">
        <v-icon x-small color="rgb(255, 205, 86)" left>mdi-checkbox-blank</v-icon>
        지방(섭취평균) <span class="grey--text">{{recommendFatPercent}}%</span>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="auto">
        {{weekFat}}/{{recommendFat}}g
      </v-col>
    </v-row>

  </div>
    
</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
import Report from '@/api/Report';
export default {
    name : 'ReportBalanceNutrient',
    props: {
        "dates" : Array,
    },
    components : {
      "ServerErrorComponent" : ServerErrorComponent,
    },

    watch : {
      dates : {
        immediate : true,
        handler(dates){
          const begin = dates[0]
          const end = dates[1]

          //일주일간 섭취비율
          //중요) 필요한 데이터 요청
          Report.getBalanceDetail(begin,end)
          .then((res) =>{
            this.isError = false;
            console.log(res.data.message);
            if(res.data.isSuccess === true && res.data.code === 1000){
                //중요) 요청에 성공하였습니다.
                this.weekCarbo = res.data.result.haveNutrient.carbohydrate;
                this.recommendCarbo = res.data.result.needNutrient.carbohydrate;
                this.recommendCarboPercent = (res.data.result.nutrientPortion.carbohydratePortion * 100).toFixed(2);
                this.weekProtein = res.data.result.haveNutrient.protein;
                this.recommendProtein = res.data.result.needNutrient.protein;
                this.recommendProteinPercent = (res.data.result.nutrientPortion.proteinPortion * 100).toFixed(2);
                this.weekFat = res.data.result.haveNutrient.fat;
                this.recommendFat = res.data.result.needNutrient.fat;
                this.recommendFatPercent = (res.data.result.nutrientPortion.fatPortion * 100).toFixed(2);
            }else if (res.data.isSuccess === false && res.data.code === "NO_AUTHORIZATION"){
                //중요) 인증 정보 없으니까 로그아웃 후 리다이렉션
                //돌리기 -> 하지만 이미 레이아웃이 그려지기 전에 이미 재발행 받아서 로그인 페이지로 돌려지지 않음
                this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push({
                        name : "sign-in",
                    });
                });
            }else{
                //중요) 건강정보를 찾을 수 없습니다.
                this.weekCarbo = 0;
                this.recommendCarbo = 0;
                this.recommendCarboPercent = 0;
                this.weekProtein = 0;
                this.recommendProtein = 0;
                this.recommendProteinPercent = 0;
                this.weekFat = 0;
                this.recommendFat = 0;
                this.recommendFatPercent = 0;
            }
          })
          .catch((err)=>{
            //중요) 서버 오류입니다.
            //뜨기 -> alert메시지 뜨기
            console.log(err);
            this.isError = true;
          });
        }
      }
    },

    data(){
        return {
            
            //에러 판단
            isError : false,

            recommendCarboPercent: 0,     //일주일 동안 섭취 탄수화물 평균 양 / 일일 권장 탄수화물 양
            recommendCarbo : 0,           //일일 권장 탄수화물 양,
            weekCarbo : 0,                //일주일 동안 섭취 탄수화물 평균 양

            recommendProteinPercent : 0,  //일주일 동안 섭취 단백질 평균 양 / 일일 권장 단백질 양
            recommendProtein: 0,          //일일 권장 단백질 양
            weekProtein : 0,              //일주일 동안 섭취 단백질 평균 양

            recommendFatPercent: 0,       //일주일 동안 섭취 지방 평균 양 / 일일 권장 지방 양
            recommendFat: 0,              //일일 권장 지방 양
            weekFat : 0,                  //일주일 동안 섭취 지방 평균 양
        }
    },

    
}
</script>

<style>

</style>
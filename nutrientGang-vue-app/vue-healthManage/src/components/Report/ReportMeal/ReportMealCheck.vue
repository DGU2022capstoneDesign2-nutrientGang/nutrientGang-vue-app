<template>
    <div class="fill-height mt-10" v-if="isError">
        <v-row justify="center">
            <v-col cols="auto" class="mt-5">
                <ServerErrorComponent/>
            </v-col>
        </v-row>
    </div>
    <div v-else class="text-center mt-10">
        
        <!--날짜 정보-->
        <v-row align="center">
            <v-col>
                <div class="border">
                    <strong>{{dates[0]}} ~ {{dates[1]}}</strong>
                </div>
            </v-col>
        </v-row>

        <!--아침-->
        <v-row align="center">
            <v-col cols="auto">
                <div>아침</div>
            </v-col>
            <v-col cols="auto" v-for="(food,index) in this.breakFastArray" :key="`food-${index}`">

                <!--등록 O-->
                <v-btn v-if="food.eaten" icon color="red" x-small>
                  <v-icon>mdi-checkbox-marked</v-icon>
                </v-btn>
                
                <!--등록 X-->
                <v-menu v-else bottom origin="center center" transition="scale-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon color="blue" x-small v-bind="attrs" v-on="on">
                            <v-icon>mdi-plus-box-outline</v-icon>
                      </v-btn>
                    </template>
                    
                    <v-list>
                      <v-list-item v-for="(menuItem) in menuItems" :key="menuItem.menuIdx" @click="goImageRegister(menuItem.component, food.date, '아침')">
                        <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>            
        </v-row>

        <!--점심-->
        <v-row align="center">
            <v-col cols="auto">
                <div>점심</div>
            </v-col>
            <v-col cols="auto" v-for="(food,index) in this.lunchArray" :key="`food-${index}`">
                
                <!--등록 O-->
                <v-btn v-if="food.eaten" icon color="red" x-small>
                  <v-icon>mdi-checkbox-marked</v-icon>
                </v-btn>
                
                <!--등록 X-->
                <v-menu v-else bottom origin="center center" transition="scale-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon color="blue" x-small v-bind="attrs" v-on="on">
                            <v-icon>mdi-plus-box-outline</v-icon>
                      </v-btn>
                    </template>
                    
                    <v-list>
                      <v-list-item v-for="(menuItem) in menuItems" :key="menuItem.menuIdx" @click="goImageRegister(menuItem.component, food.date, '점심')">
                        <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>            
        </v-row>

        <!--저녁-->
        <v-row align="center">
            <v-col cols="auto">
                <div>저녁</div>
            </v-col>
            <v-col cols="auto" v-for="(food,index) in this.dinnerArray" :key="`food-${index}`">
                
                <!--등록 O-->
                <v-btn v-if="food.eaten" icon color="red" x-small>
                  <v-icon>mdi-checkbox-marked</v-icon>
                </v-btn>
                
                <!--등록 X-->
                <v-menu v-else bottom origin="center center" transition="scale-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon color="blue" x-small v-bind="attrs" v-on="on">
                            <v-icon>mdi-plus-box-outline</v-icon>
                      </v-btn>
                    </template>
                    
                    <v-list>
                      <v-list-item v-for="(menuItem) in menuItems" :key="menuItem.menuIdx" @click="goImageRegister(menuItem.component, food.date, '저녁')">
                        <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>            
        </v-row>
    </div>

</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
import Report from '@/api/Report';
export default {
    name : "ReportMealCheck",
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
          const begin = dates[0];
          const end = dates[1];

          //일주일간 삼시세끼
          //중요) 필요한 데이터 요청
          Report.getMealList(begin,end)
          .then((res) =>{
            this.isError = false;
            console.log(res.data.message);
            if(res.data.isSuccess === true && res.data.code === 1000){
                //중요) 요청에 성공하였습니다.
                this.breakFastArray = res.data.result.breakfastList;
                this.lunchArray = res.data.result.lunchList;
                this.dinnerArray = res.data.result.dinnerList;
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
                //중요) 식사정보를 찾을 수 없습니다.
                const begin = this.dates[0];
                let datesArray = []
                for (let i=0; i<7; i++){
                  let temp_date = new Date(begin);
                  temp_date.setDate(temp_date.getDate() + i);
                  datesArray.push(temp_date.toISOString().substr(0,10))
                }

                this.breakFastArray = [
                    {"id": 1,"date": datesArray[0],"eaten": false},
                    {"id": 2,"date": datesArray[1],"eaten": false},
                    {"id": 3,"date": datesArray[2],"eaten": false},
                    {"id": 4,"date": datesArray[3],"eaten": false},
                    {"id": 5,"date": datesArray[4],"eaten": false},
                    {"id": 6,"date": datesArray[5],"eaten": false},
                    {"id": 7,"date": datesArray[6],"eaten": false},
                ];
                this.lunchArray = [
                    {"id": 1,"date": datesArray[0],"eaten": false},
                    {"id": 2,"date": datesArray[1],"eaten": false},
                    {"id": 3,"date": datesArray[2],"eaten": false},
                    {"id": 4,"date": datesArray[3],"eaten": false},
                    {"id": 5,"date": datesArray[4],"eaten": false},
                    {"id": 6,"date": datesArray[5],"eaten": false},
                    {"id": 7,"date": datesArray[6],"eaten": false},
                ]
                this.dinnerArray = [
                    {"id": 1,"date": datesArray[0],"eaten": false},
                    {"id": 2,"date": datesArray[1],"eaten": false},
                    {"id": 3,"date": datesArray[2],"eaten": false},
                    {"id": 4,"date": datesArray[3],"eaten": false},
                    {"id": 5,"date": datesArray[4],"eaten": false},
                    {"id": 6,"date": datesArray[5],"eaten": false},
                    {"id": 7,"date": datesArray[6],"eaten": false},
                ]
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

            breakFastArray : [
              {"id": 1,"date": null,"eaten": false},
              {"id": 2,"date": null,"eaten": false},
              {"id": 3,"date": null,"eaten": false},
              {"id": 4,"date": null,"eaten": false},
              {"id": 5,"date": null,"eaten": false},
              {"id": 6,"date": null,"eaten": false},
              {"id": 7,"date": null,"eaten": false},
            ],
            lunchArray : [
              {"id": 1,"date": null,"eaten": false},
              {"id": 2,"date": null,"eaten": false},
              {"id": 3,"date": null,"eaten": false},
              {"id": 4,"date": null,"eaten": false},
              {"id": 5,"date": null,"eaten": false},
              {"id": 6,"date": null,"eaten": false},
              {"id": 7,"date": null,"eaten": false},
            ],
            dinnerArray : [
              {"id": 1,"date": null,"eaten": false},
              {"id": 2,"date": null,"eaten": false},
              {"id": 3,"date": null,"eaten": false},
              {"id": 4,"date": null,"eaten": false},
              {"id": 5,"date": null,"eaten": false},
              {"id": 6,"date": null,"eaten": false},
              {"id": 7,"date": null,"eaten": false},
            ],
            menuItems: [
                { menuIdx:0, title: '카메라/갤러리', component : "MobileRegister" },
                { menuIdx:1, title: '텍스트', component : "TextRegister" },
            ],
        }
    },

    methods : {

        goImageRegister(component, date, meal){
            this.$router.push(
            {
                name : component,
                params : {
                    initDate : date,
                    initMeal : meal,
                }
            });
        },
    }
}
</script>

<style  scoped>
.border {
  border: 3px solid ;
}
</style>
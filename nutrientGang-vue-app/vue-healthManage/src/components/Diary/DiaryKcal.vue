<template>

    <div class="fill-height" v-if="isError">
        <v-row justify="center">
            <v-col cols="auto">
                <ServerErrorComponent/>
            </v-col>
        </v-row>
    </div>
    <v-row align="center" v-else>
        <!--일일 권장 Kcal와 섭취 Kcal--> 
        <v-col cols="auto">
            <div>일일 권장</div>
            <strong class="black--text">{{recommendKcal}}kcal</strong>
            
            <div>
                <v-row align="center" no-gutters>
                    <v-col cols="auto" class="mr-1">
                        <div>섭취</div>
                    </v-col>
                    <v-col cols="auto">
                        <v-chip v-if="isKcalExcess" class="my-2" color="red" text-color="white" small>초과</v-chip>
                    </v-col>
                </v-row>
            </div>
            <strong class="black--text">{{dateKcal}}kcal</strong>
        </v-col>
        
        <v-spacer></v-spacer>
          
        <!--잔여 Kcal 그래프--> 
        <v-col cols="auto">
            <v-progress-circular :value="leftPercentKcal" 
            rotate="90" size="100" width="13" color="blue" button>
                <div class="text-center">
                    <strong class="grey--text">잔여</strong><br>
                    <strong class="grey--text">{{leftKcal}}kcal</strong>
                </div>
            </v-progress-circular>
        </v-col>
    </v-row>

</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
import Diary from '@/api/Diary';
export default {
    name : 'DiaryKcal',
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

                //중요) 필요한 데이터 요청
                Diary.getKcal(date)
                .then((res) =>{
                    this.isError = false;
                    console.log(res.data.message);
                    if(res.data.isSuccess === true && res.data.code === 1000){
                        //중요) 요청에 성공하였습니다.
                        this.recommendKcal = res.data.result.needCalorie;
                        this.dateKcal = res.data.result.haveCalorie;
                    }else if (res.data.isSuccess === false && res.data.code === 2014){
                        //중요) 건강정보를 찾을 수 없습니다.
                        this.recommendKcal = 0;
                        this.dateKcal = 0;
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

            recommendKcal : 0,     //일일 권장 Kcal
            dateKcal : 0,           //사용자의 날짜별 Kcal
        }
    },

    computed: {
        
        isKcalExcess(){
            return this.recommendKcal < this.dateKcal
        },

        leftKcal(){
            if (this.recommendKcal < this.dateKcal){
                return 0;
            }
            
            return this.recommendKcal - this.dateKcal;
            
        },

        leftPercentKcal(){
            if (this.recommendKcal === 0){
                return 0;
            }
            
            return (this.dateKcal / this.recommendKcal) * 100
        },
    }
    
}
</script>

<style>

</style>
<template>
    <div>
        <!--식사 기록 내용-->
        <div class="fill-height" v-if="isError">
            <v-row justify="center">
                <v-col cols="auto" class="mt-5">
                    <ServerErrorComponent/>
                </v-col>
            </v-row>
        </div>
        <div class="fill-height" v-else-if="isMealError">
            <v-row justify="center">
                <v-col cols="auto" class="mt-5">
                    <NotMealInfoComponent/>
                </v-col>
            </v-row>
        </div>
        <div v-else>
            <!--식사기록 아침-->
            <div class="mb-5">
                <div>
                    <div>
                        <strong class="red--text">사진 클릭(수정 및 삭제)</strong> 
                    </div>
                </div>
                <div>
                    아침 <strong class="black--text">{{breakfastKcal}}kcal</strong> / <strong class="grey--text">{{recommendKcal}}kcal</strong>
                </div>
                <div>
                    <div class="fill-height" v-if="isBreakfastNothing">
                        <v-row justify="center">
                            <v-col cols="auto" class="mt-5">
                                <NotMealInfoComponent/>
                            </v-col>
                        </v-row>
                    </div>
                    <vueper-slides v-else 
                     class="no-shadow" slide-multiple :bullets= "false" :arrows-outside="false"
                     :gap="3" :slide-ratio="1 / 4" :dragging-distance="200" :visibleSlides="4">
                        <template #arrow-left>
                            <v-icon color="blue">mdi-arrow-left-bold-box</v-icon>
                        </template>
                        <template #arrow-right>
                            <v-icon color="blue">mdi-arrow-right-bold-box</v-icon>
                        </template>

                        <vueper-slide v-for="(food,index) in breakfastArray" :key="`food-${index}`" :image="cImg(food.imgUrl)" :title="`${food.calorie}kcal`" 
                        :style="`color : ${cColor(food.imgUrl)}`" @click.native="slideClick(food, '아침')"/>  
                    </vueper-slides>  
                </div>
            </div>
            

            <!--식사기록 점심-->
            <div class="mb-5">
                <div>
                    <div>
                        <strong class="red--text">사진 클릭(수정 및 삭제)</strong> 
                    </div>
                </div>
                <div>
                    점심 <strong class="black--text">{{lunchKcal}}kcal</strong> / <strong class="grey--text">{{recommendKcal}}kcal</strong>
                </div>
                <div>
                    <div class="fill-height" v-if="isLunchNothing">
                        <v-row justify="center">
                            <v-col cols="auto" class="mt-5">
                                <NotMealInfoComponent/>
                            </v-col>
                        </v-row>
                    </div>
                    <vueper-slides v-else 
                     class="no-shadow" slide-multiple :bullets= "false" :arrows-outside="false"
                     :gap="3" :slide-ratio="1 / 4" :dragging-distance="200" :visible-slides="4">
                        <template #arrow-left>
                            <v-icon color="blue">mdi-arrow-left-bold-box</v-icon>
                        </template>
                        <template #arrow-right>
                            <v-icon color="blue">mdi-arrow-right-bold-box</v-icon>
                        </template>

                        <vueper-slide v-for="(food,index) in lunchArray" :key="`food-${index}`" :image="cImg(food.imgUrl)" :title="`${food.calorie}kcal`" 
                        :style="`color : ${cColor(food.imgUrl)}`" @click.native="slideClick(food, '점심')"/>  
                    </vueper-slides>  
                </div>
            </div>

            <!--식사기록 저녁-->
            <div class="mb-5">
                <div>
                    <div>
                        <strong class="red--text">사진 클릭(수정 및 삭제)</strong> 
                    </div>
                </div>
                <div>
                    저녁 <strong class="black--text">{{dinnerKcal}}kcal</strong> / <strong class="grey--text">{{recommendKcal}}kcal</strong>
                </div>
                <div>
                    <div class="fill-height" v-if="isDinnerNothing">
                        <v-row justify="center">
                            <v-col cols="auto" class="mt-5">
                                <NotMealInfoComponent/>
                            </v-col>
                        </v-row>
                    </div>
                    <vueper-slides v-else 
                    class="no-shadow" slide-multiple :bullets= "false" :arrows-outside="false"
                     :gap="3" :slide-ratio="1 / 4" :dragging-distance="200" :visibleSlides="4">
                        <template #arrow-left>
                            <v-icon color="blue">mdi-arrow-left-bold-box</v-icon>
                        </template>
                        <template #arrow-right>
                            <v-icon color="blue">mdi-arrow-right-bold-box</v-icon>
                        </template>

                        <vueper-slide v-for="(food,index) in dinnerArray" :key="`food-${index}`" :image="cImg(food.imgUrl)" :title="`${food.calorie}kcal`" 
                        :style="`color : ${cColor(food.imgUrl)}`" @click.native="slideClick(food, '저녁')"/>  
                    </vueper-slides>  
                </div>
            </div>

        </div>
    </div>

</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
const NotMealInfoComponent = () => import("@/components/ErrorComponent/NotMealInfoComponent.vue")
import Diary from '@/api/Diary';
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

export default {
    name : 'DiaryMeal',
    props: {
        date : {
            type : String,
            default : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
        },
    },
    components: { 
        VueperSlides, 
        VueperSlide,
        "ServerErrorComponent" : ServerErrorComponent,
        "NotMealInfoComponent" : NotMealInfoComponent
    },

    watch : {
        date : {
            immediate : true,
            handler(date){
                Diary.getMeal(date)
                .then((res) => {
                    this.isError = false;
                    this.isMealError = false;
                    this.isBreakfastNothing = false;
                    this.isLunchNothing = false;
                    this.isDinnerNothing = false;
                    console.log(res.data.message);

                    if(res.data.isSuccess === true && res.data.code === 1000){
                        //중요) 요청에 성공하였습니다.
                        this.recommendKcal = res.data.result.eachNeedCalorie;
                        this.breakfastKcal = res.data.result.breakfastCalorie;
                        this.lunchKcal = res.data.result.lunchCalorie;
                        this.dinnerKcal = res.data.result.dinnerCalorie;
                        
                        this.breakfastArray = res.data.result.breakfast;
                        if (this.breakfastArray.length === 0){
                            this.isBreakfastNothing = true;
                        }
                        this.lunchArray = res.data.result.lunch;
                        if (this.lunchArray.length === 0){
                            this.isLunchNothing = true;
                        }
                        this.dinnerArray = res.data.result.dinner;
                        if (this.dinnerArray.length === 0){
                            this.isDinnerNothing = true;
                        }

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
                        //중요) 식사기록을 찾을 수 없습니다.
                        this.isMealError = true;
                    }
                })
                .catch((err)=>{
                    //중요) 서버 오류입니다.
                    //뜨기 -> alert메시지 뜨기
                    console.log(err);
                    this.isBreakfastNothing = false;
                    this.isLunchNothing = false;
                    this.isDinnerNothing = false;
                    this.isMealError = false;

                    this.isError = true;
                })
            }
        }
    },

    computed : {
        cImg(){
            return (imgUrl) => {
                                
                const isDefaultImage = !imgUrl;

                // AWS S3 주소
                const href = 'https://dgucapstonepics.s3.ap-northeast-2.amazonaws.com';
                const albumName = 'food_album';
                const imgPreUrl = `${href}/${albumName}/${imgUrl}`;

                return isDefaultImage ? require('@/assets/default.png') : imgPreUrl;
            }
        },
        cColor(){
            return (imgUrl) => {
                
                const isDefaultImage = !imgUrl;

                return isDefaultImage ? 'grey' : 'white';
            }
        }
    },

    data(){
        return {
            //에러 판단
            isError : false,  
            isMealError: false,

            breakfastKcal : 0,     //사용자의 날짜별 아침 칼로리
            breakfastArray : [],    //{ names : ["삼겹살", "김치","밥"], imgUrl : "abc.jpg", calorie : 1500},
            isBreakfastNothing : false,

            lunchKcal : 0,         //사용자의 날짜별 점심 칼로리
            lunchArray :  [],      //{ names : ["삼겹살", "김치","밥"], imgUrl : "abc.jpg", calorie : 1500},
            isLunchNothing : false,

            dinnerKcal : 0,        //사용자의 날짜별 저녁 칼로리
            dinnerArray :  [],     //{ names : ["삼겹살", "김치","밥"], imgUrl : "abc.jpg", calorie : 1500},
            isDinnerNothing : false,

            recommendKcal : 0,
        }
    },

    methods : {
        slideClick(food, meal){
            //MealDetailModify
            this.$router.push({
                name : "MealDetailModify",
                params : {
                    initMealId : food.mealId,
                    initMeal : meal
                }
            });
        },
    }
}
</script>

<style>

</style>
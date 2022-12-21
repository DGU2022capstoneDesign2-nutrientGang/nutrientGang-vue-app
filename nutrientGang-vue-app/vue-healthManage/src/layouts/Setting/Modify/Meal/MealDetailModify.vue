<template>
  <div class="fill-height mt-10" v-if="isError">
        <!--0.제목-->
        <div class="text-center mb-10">
            <h1 class="text--primary font-weight-black">식사 상세 수정 및 삭제</h1>
        </div>

        <v-row justify="center">
            <v-col cols="auto">
                <ServerErrorComponent/>
            </v-col>
        </v-row>
  </div>
  <v-container fluid v-else>
    
        <!--0.제목-->
        <div class="text-center mb-10">
                <h1 class="text--primary font-weight-black">식사 상세 수정 및 삭제</h1>
        </div>

        <!--1. 카메라/갤러리/텍스트 이미지(분석됨) 보기-->
        <LabelImage :foods="foods" :isDefaultLabelImage="isDefaultImg" :labelImgPreURL="imgPreURL"
        class="mb-5"/>

        <v-divider></v-divider>

        <!--2. 전체 섭취량, 등록할 음식 버튼-->
        <div class="mt-3 mb-3">
            <v-row align="center">
            
                <!--전체 섭취량-->
                <v-col cols="auto">
                    <h2>
                      전체 섭취량 <span class="blue--text font-weight-medium">({{ foodsKcal }}kcal)</span>
                    </h2>
                </v-col>

                <!--등록할 음식 버튼-->
                <v-col cols="auto">
                  <v-dialog v-model="addDialog" scrollable max-width="300px">

                        <!--Dialog 유발-->
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on"  
                            dark color="blue" outlined fab small> 
                                <v-icon dark>mdi-plus</v-icon>
                            </v-btn>
                        </template>

                        <!--Dialog 내용-->
                        <v-card class="text-center">
                            <v-card-text>
                                <AddFoodDialog :date="date" :meal="meal" v-on:add-food="addFood"/>
                            </v-card-text>
                        </v-card>
                  </v-dialog>
                </v-col>
            </v-row>
        </div>

        <!--3. 날짜선택, 식사 선택(아침/점심/저녁)-->
        <div class="mt-3 mb-8 pa-3 border">
            <v-row align="center">
            
                <!--날짜선택-->
                <v-col cols="auto">
                    <v-dialog v-model="dateDialog">

                        <!--Dialog 유발-->
                        <template v-slot:activator="{ on, attrs }">
                            <v-chip color="blue" dark v-bind="attrs" v-on="on" label>
                              {{date}}
                            </v-chip>
                        </template>

                        <!--Dialog 내용-->
                        <v-date-picker v-model="date" 
                        color="blue" header-color="blue">
                        </v-date-picker>

                    </v-dialog>
                </v-col>

                <!--식사 선택(아침/점심/저녁)-->
                <v-col cols="auto">
                    <v-dialog v-model="mealDialog" scrollable max-width="300px">

                        <!--Dialog 유발-->
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip v-bind="attrs" v-on="on" label
                          color="blue" dark>{{meal}}</v-chip>
                        </template>

                        <!--Dialog 내용-->
                        <v-card class="text-center">
                            <v-card-title class="justify-center">
                                <div>식사 선택</div>
                            </v-card-title>

                            <v-divider></v-divider>

                            <v-card-text class="justify-center" style="height: 300px;">
                                <v-radio-group v-model="meal" column>
                                    <v-radio label="아침" value="아침"></v-radio>
                                    <v-radio label="점심" value="점심"></v-radio>
                                    <v-radio label="저녁" value="저녁"></v-radio>
                                </v-radio-group>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions class="justify-center">
                              <v-btn color="blue darken-1" text
                              @click="mealDialog = false">확인</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
        </div>

        <!--4. 영양정보 확인, 등록할 음식들-->
        <div class="mt-3 mb-8 pa-3 border">

            <!--영양정보 확인-->
            <v-row align="center" justify="center">
                <v-col cols="auto">
                    <v-dialog v-model="nutrientDialog" scrollable max-width="300px">

                        <!--Dialog 유발-->
                        <template v-slot:activator="{ on, attrs }">
                            <v-chip v-bind="attrs" v-on="on" label outlined color="blue" dark>
                                <v-icon left>mdi-flower</v-icon>영양정보<v-icon right>mdi-flower</v-icon>
                            </v-chip>
                        </template>

                        <!--Dialog 내용-->
                        <v-card class="text-center">
                            <v-card-title class="justify-center">
                                <div>영양 정보</div>
                            </v-card-title>

                            <v-divider></v-divider>

                            <v-card-text class="justify-center" style="height: 300px;">
                                <!--Tab 선택-->
                                <v-tabs v-model="nutrientTabModel" background-color="transparent" color="blue" grow>
                                    <v-tab v-for="tabItem in nutrientTabItems" :key="tabItem.tabIdx">
                                      {{ tabItem.tabName }}
                                    </v-tab>
                                </v-tabs>

                                <!--Tab 선택시 내용-->
                                <v-tabs-items v-model="nutrientTabModel" class="mt-5">
                                    <v-tab-item v-for="tabItem in nutrientTabItems" :key="tabItem.tabIdx">
                                        <div v-if="tabItem.tabIdx === 0">
                                            <NutrientSum :foods="foods" :foodsKcal="foodsKcal"/>
                                        </div>
                                        <div v-else-if="tabItem.tabIdx === 1">
                                            <NutrientDetail :foods="foods" :foodsKcal="foodsKcal"/>
                                        </div>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions class="justify-center">
                                  <v-btn color="blue darken-1" text
                                  @click="nutrientDialog = false">확인</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>

            <!--등록할 음식들-->
            <v-row align="center" justify="center">
                <v-col cols="auto" v-for="(food,index) in foods" :key="`food-${index}`">
                    <v-chip link close @click:close="deleteFood(index)">{{food.name}}</v-chip>
                </v-col>
            </v-row>
        </div>

        <v-divider></v-divider>

        <!--5. 입력-->
        <div class="mt-3 mb-3">
        
            <!--입력 제목, 음식 선택 Dialog-->
            <v-row align="center">

                <!--입력 제목-->
                <v-col cols="auto">
                    <h2>비율 입력</h2>
                </v-col>

                <!--음식 선택 Dialog-->
                <v-col cols="auto">
                    <v-dialog v-model="selectDialog" scrollable max-width="300px">

                        <!--Dialog 유발-->
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on"  
                            dark color="#03C04A" outlined> 
                              <v-icon left>mdi-silverware-variant</v-icon> 
                              음식 선택
                              <v-icon right>mdi-silverware-variant</v-icon>
                            </v-btn>
                        </template>

                        <!--Dialog 내용-->
                        <v-card class="text-center">
                            <v-card-text>
                              <SelectFoodDialog :foods="foods" 
                              v-on:select-food="selectFood"
                              v-on:select-dialog-off="selectDialogOff"/>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>

            <!--선택한 음식 이름-->
            <v-row align="center" justify="center">
                <v-col cols="auto">
                    <h2 class="blue--text font-weight-medium">선택한 음식 ({{selectedFoodName}})</h2>
                </v-col>
            </v-row>

            <!--입력-->
            <v-card class="border" tile>
                <v-list>
                    <v-list-item-group v-model="inputModel" mandatory color="blue">
                        <v-list-item v-for="(inputItem) in inputItems " :key="inputItem.inputIdx" class="mb-2 rounded-pill">

                            <v-list-item-title>
                              <div class="text--primary mb-2">{{inputItem.title}}</div>
                            </v-list-item-title>

                            <v-list-item-icon>
                                {{ratioFoodsKcal(inputItem.ratio)}}kcal
                            </v-list-item-icon>  

                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card>
        </div>

        <!--6. 수정, 삭제-->
        <div class="mt-10">
            <v-row align="center" justify="center">

                <!--수정-->
                <v-col cols="6">
                    <v-form @submit.prevent="submit">
                        <v-btn type="submit"
                        block x-large rounded color="primary" outlined>수정</v-btn>
                    </v-form>
                </v-col>

                <!--삭제-->
                <v-col cols="6">
                    <v-btn @click="deleteDialogOn"
                    block x-large rounded color="error" outlined>삭제</v-btn>
                </v-col>
            </v-row>
            <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="submitDialog">
                <!--Dialog 내용-->
                <v-card>
                    <v-card-title class="justify-center error white--text">
                        <v-icon left>mdi-alert-decagram</v-icon>주의<v-icon right>mdi-alert-decagram</v-icon>
                    </v-card-title>
                    <v-card-text class="text-center">
                        <h3 class="pa-12" v-html="printNewLine"></h3>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn text @click="closeSubmitDialog()">확인</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="deleteDialog">
                <!--Dialog 내용-->
                <v-card>
                    <v-card-title class="justify-center error white--text">
                        주의
                    </v-card-title>
                    <v-card-text class="text-center">
                        <h3 class="pa-12">정말로 삭제 하시겠습니까?</h3>
                    </v-card-text>
                    <v-row align="center" justify="center">
                        <v-col cols="6">
                            <v-card-actions class="justify-center">
                                <v-btn text @click="okayDeleteDialog()">삭제</v-btn>
                            </v-card-actions>
                        </v-col>
                        <v-col cols="6">
                            <v-card-actions class="justify-center">
                                <v-btn text @click="closeDeleteDialog()">취소</v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>

                </v-card>
            </v-dialog>
        </div>
    </v-container>
</template>

<script>
import Modify from '@/api/Modify'
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
const LabelImage = () => import("@/components/Register/Image/LabelImage.vue");
const AddFoodDialog = () => import("@/components/Register/Meal/AddFoodDialog.vue");
const SelectFoodDialog = () => import("@/components/Register/Meal/SelectFoodDialog.vue");
const NutrientSum = () => import("@/components/Register/Meal/NutrientSum.vue");
const NutrientDetail = () => import("@/components/Register/Meal/NutrientDetail.vue");
export default {
    name : "MealDetailModify",
    components : {
        "ServerErrorComponent" : ServerErrorComponent,
        "LabelImage" : LabelImage,
        "AddFoodDialog" : AddFoodDialog,
        "SelectFoodDialog" : SelectFoodDialog,
        "NutrientSum" : NutrientSum,
        "NutrientDetail" : NutrientDetail,
    },

    created(){
        const hasNotInitMealId = !this.$route.params.initMealId;
        const hasNotInitMeal = !this.$route.params.initMeal;

        if(hasNotInitMealId || hasNotInitMeal){
            this.isError = true;
        }else{
            this.initMealId = this.$route.params.initMealId;
            this.initMeal = this.$route.params.initMeal;

            Modify.getMealInfo(this.initMealId, this.initMeal)
            .then((res) =>{
                this.isError = false;
                console.log(res.data.message);
                if(res.data.isSuccess === true && res.data.code === 1000){
                    //중요) 요청에 성공하였습니다.
                    this.date = res.data.result.date;
                    this.meal = res.data.result.meal;

                    if(!res.data.result.imgUrl){
                        this.isDefaultImg = true;
                        this.imgURL = null;
                        this.imgPreURL = null;
                    }else{
                        this.isDefaultImg = false;
                        this.imgURL = res.data.result.imgUrl;
                        
                        const href = 'https://dgucapstonepics.s3.ap-northeast-2.amazonaws.com/';
                        const albumName = 'food_album';
                        this.imgPreURL = href + albumName + '/' + res.data.result.imgUrl;
                    }

                    if(!res.data.result.foods){
                        this.foods = [];
                    }else{
                        const foods = res.data.result.foods;
                        if(Array.isArray(this.foods) && this.foods.length === 0){
                            //애초에 등록한 음식이 하나라도 있어야 수정 가능
                        }else{
                            this.foods = foods;

                            let deepArr = [];
                            for(let i=0; i< this.foods.length; i++){
                                const deepObject = JSON.parse(JSON.stringify(this.foods[i]));
                                deepArr.push(deepObject);
                            }
                            this.originalFoods = deepArr;
                        }
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
                    //중요) 수정할 Meal 정보가 없습니다.
                    this.isError = true;
                }
            })
            .catch((err)=>{
                //중요) 서버 오류입니다.
                //뜨기 -> alert메시지 뜨기
                console.log(err);
                this.isError = true;
            });
        }
    },

    data(){
        return {
        
            //에러 발생
            isError : false,

            //이전 Data 관련,
            initMealId : null,
            initMeal: null,

            //수정 Data 관련
            date : null,
            dateDialog : false,

            meal : null,
            mealDialog : false,

            foods : null,
            originalFoods : null,

            isDefaultImg : true,
            imgURL : null,       //s3에 업로드되면 얻기, PUT요청 (afas.jpg)
            imgPreURL : null,    //s3에 업로드되면 얻기, v-img:src (http: ~~ /afas.jpg)

            //음식추가시 Dialog 관련
            addDialog : false,

            //전체,상세 영양정보 Dialog, Tab 관련
            nutrientDialog : false,
            nutrientTabModel: 0,
            nutrientTabItems : [
                {tabIdx: 0, tabName : '영양정보 전체'},
                {tabIdx: 1, tabName : '영양정보 상세'},
            ],

            //비율 Item 관련
            inputModel : 3,
            inputItems : [
                { inputIdx: 0, title: '1/4소접시', ratio : 0.25},
                { inputIdx: 1, title: '1/2소접시', ratio : 0.5},
                { inputIdx: 2, title: '3/4소접시', ratio : 0.75},
                { inputIdx: 3, title: '1소접시', ratio : 1},
                { inputIdx: 4, title: '2소접시', ratio : 2},
            ],

            //비율음식선택시 Dialog 관련
            selectDialog : false,
            selectedFoodIndex : 0,

            //음식수정시 Dialog 관련 
            submitDialog : false,
            submitErrMsg : "",

            //음식삭제시 Dialog관련
            deleteDialog : false,
        }
    },

    watch : {

        //비율Model값 변경 될 때마다
        //foods의kcal,nutrient(변경O), originalFoods의kcal(변경X)
        inputModel : {
            immediate : false,
            handler(inputModel) {
                if(!this.foods){
                    //
                }else{
                    if(Array.isArray(this.foods) && this.foods.length === 0){
                        //애초에 등록한 음식이 하나라도 있어야 수정 가능
                    }else{
                        const ratio = this.inputItems[inputModel].ratio;
    
                        const selectedKcal = this.originalFoods[this.selectedFoodIndex].kcal;
                        const selectedCarbo = this.originalFoods[this.selectedFoodIndex].nutrient.carbo;
                        const selectedProtein = this.originalFoods[this.selectedFoodIndex].nutrient.protein;
                        const selectedFat = this.originalFoods[this.selectedFoodIndex].nutrient.fat;
    
                        const computedKcal = ratio * selectedKcal;
                        const computedCarbo = ratio * selectedCarbo;
                        const computedProtein = ratio * selectedProtein;
                        const computedFat = ratio * selectedFat;
    
                        this.foods[this.selectedFoodIndex].kcal = computedKcal;
                        this.foods[this.selectedFoodIndex].nutrient.carbo = computedCarbo;
                        this.foods[this.selectedFoodIndex].nutrient.protein = computedProtein;
                        this.foods[this.selectedFoodIndex].nutrient.fat = computedFat;
                    }
                }
                
            }
        }
    },

    computed : {
      
        //isDefaultImg = false -> imgPreURL
        //isDefaultImg = true -> defaultimg
        cImg(){
            return this.isDefaultImg ? require('@/assets/default.png') : this.imgPreURL;
        },

        //전체kcal
        //foods의kcal(변경O), originalFoods의kcal(변경X)
        foodsKcal(){
            let sum_kcal = 0;
            if(!this.foods){
                //
            }else{
                if(Array.isArray(this.foods) && this.foods.length === 0){
                    //애초에 등록한 음식이 하나라도 있어야 수정 가능
                }else{
                    for(let i=0; i< this.foods.length; i++){
                        sum_kcal += this.foods[i].kcal;
                    } 
                }
            }

            return sum_kcal
        },

        //비율표시kcal
        //foods의kcal(이용X), originalFoods의kcal(이용O)
        ratioFoodsKcal(){
            return (ratio) => {
                let selected_kcal = 0;
                if(!this.foods){
                    //
                }else{
                    if(Array.isArray(this.foods) && this.foods.length === 0){
                        //애초에 등록한 음식이 하나라도 있어야 수정 가능
                    }else{
                        selected_kcal = this.originalFoods[this.selectedFoodIndex].kcal;
                    }
                }

                return ratio * selected_kcal;
            }
        },

        //비율음식선택이름
        //foods의name(이용X), originalFoods의name(이용O)
        selectedFoodName(){
            let selectedFoodName = "";

            if(!this.foods){
                //
            }else{
                if(Array.isArray(this.foods) && this.foods.length === 0){
                    //애초에 등록한 음식이 하나라도 있어야 수정 가능
                }else{
                    selectedFoodName = this.originalFoods[this.selectedFoodIndex].name;
                }
            }

            return selectedFoodName;
        },

        printNewLine(){
            return this.submitErrMsg.replace("\n", "<br />")
        }
    },

    methods : {
      
        //isDefaultImg = true -> false
        changeNotDefault(){
            this.isDefaultImg = false;
        },

        //텍스트 등록 통해 추가
        //foods에 추가O, originalFoods에 추가O(깊은복사)
        addFood(foodObject){
            this.foods.push(foodObject);

            const deepObject = JSON.parse(JSON.stringify(foodObject));
            this.originalFoods.push(deepObject);

            this.addDialog = false;
        },

        //chip close이벤트 통해 삭제
        //foods에 삭제O, originalFoods에 삭제O
        //selectedFoodIndex는 맨 처음걸로 set
        deleteFood(id){
            this.foods.splice(id,1);
            this.originalFoods.splice(id,1);
            this.selectedFoodIndex = 0;
        },

        //SelectFoodDialog 통해 선택
        //selectedFoodIndex set
        selectFood(foodIndex){
            this.selectedFoodIndex = foodIndex;
        },

        //SelectFoodDialog 통해 초기화
        //비율Model 1소접시로 set
        selectDialogOff(){
            this.selectDialog = false;
            this.inputModel = 3;
        },

        async submit(){

            if(Array.isArray(this.foods) && this.foods.length === 0){
                this.submitDialog = true;
                this.submitErrMsg = "최소한 1개의 음식은\n 등록해주세요."
            }
            else{

                // 섭취 음식 수정 정보
                let deepArr = [];
                for(let i=0; i< this.foods.length; i++){
                    const deepObject = {
                        xmain : this.foods[i].xmain,
                        ymain : this.foods[i].ymain,
                        name : this.foods[i].name,
                        calorie : this.foods[i].kcal,
                        nutrient : {
                            carbohydrate : this.foods[i].nutrient.carbo,
                            protein : this.foods[i].nutrient.protein,
                            fat : this.foods[i].nutrient.fat
                        }
                    };
                  
                    deepArr.push(deepObject);
                }

                const putObj = {
                    date : this.date,
                    meal : this.meal,
                    imgUrl : this.imgURL,
                    foods : deepArr,
                };

                Modify.modifyFood(putObj, this.initMealId, this.initMeal)
                .then((res) => {
                    console.log(res.data.message);
                    if(res.data.isSuccess === true && res.data.code === 1000){
                    
                        //Diary
                        this.$router.push({
                            name : "Diary",
                        });
    
                    }else{
                        this.submitDialog = true;
                        this.submitErrMsg = "서버 오류로 수정 불가"
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.submitDialog = true;
                    this.submitErrMsg = "서버 오류로 수정 불가"
                });
            }
        },

        closeSubmitDialog(){
            this.submitDialog = false;
            this.submitErrMsg = "";
        },

        deleteDialogOn(){
            this.deleteDialog = true;
        },

        okayDeleteDialog(){
            this.deleteDialog = false;

            Modify.deleteFood(this.initMealId, this.initMeal)
            .then((res) => {
                    console.log(res.data.message);
                    if(res.data.isSuccess === true && res.data.code === 1000){
                    
                        //Diary
                        this.$router.push({
                            name : "Diary",
                        });
    
                    }else{
                        this.submitDialog = true;
                        this.submitErrMsg = "서버 오류로 삭제 불가"
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.submitDialog = true;
                    this.submitErrMsg = "서버 오류로 삭제 불가"
                });

        },

        closeDeleteDialog(){
            this.deleteDialog = false;
        }
    }
}
</script>
<style scoped>
.border {
    border: 2px dashed;
    border-color: #80CAFF;
}
.border-image{
    border : 3px solid ;
}
</style>
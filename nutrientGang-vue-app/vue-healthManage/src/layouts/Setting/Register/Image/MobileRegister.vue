<template>
    <v-container fluid>
        
        <!--카메라,갤러리 제목-->
        <div class="mb-5">
            <div class="text-center mb-10">
                <h1 class="text--primary font-weight-black">카메라 및 갤러리 등록</h1>
            </div>
            <div>
            <div class="blue--text"><strong class="black--text">등록 날짜:</strong> {{this.date}}</div>
            <div class="blue--text"><strong class="black--text">등록 종류:</strong> {{this.meal}}</div>
            </div>
        </div>

        <!--카메라,갤러리 등록, 등록 버튼-->
        <div>
            <v-row align="center" justify="center">
                <v-col cols="12">
                    
                    <ValidationObserver ref="observer" v-slot="{invalid}">
                        <v-form @submit.prevent="submit">
                            <div>
                                <!--음식 파일 등록-->
                                <div class="mb-3">
                                    <div class="text-center">
                                        <h2 class="text--primary font-weight-black">음식 사진 불러오기(클릭)</h2>
                                    </div>
                                    <div>
                                        <ValidationProvider :rules="{
                                                required : true,
                                                }" name="카메라/갤러리 사진" v-slot="{errors}">
                                                <v-file-input type="file" accept="image/*"
                                                v-model="img" label="카메라/갤러리 사진" :error-messages="errors"
                                                outlined :show-size="1000"
                                                prepend-icon="mdi-camera-burst" clearable counter color="blue"
                                                @change="uploadAlbumFile">
                                                    <template v-slot:selection="{ text }">
                                                        <v-chip color="primary accent-4" dark label small>
                                                          {{ text }}
                                                        </v-chip>
                                                    </template>
                                                </v-file-input>
                                        </ValidationProvider>
                                    </div>
                                </div>
                                
                                <!--음식 라벨링 사진 확인-->
                                <div>
                                    <div class="text-center">
                                        <h2 class="text--primary font-weight-black">음식 사진 확인</h2>
                                    </div>

                                    <v-row align="center" justify="center" v-if="isLoading">
                                        <v-col cols="auto">
                                            <LoadingComponent/>
                                        </v-col>
                                    </v-row>
                                    <LabelImage :foods="foods" :isDefaultLabelImage="isDefaultLabelImage" :labelImgPreURL="labelImgPreURL"
                                    v-else/>
                                </div>

                                <!--구분선-->
                                <v-divider class="ma-4"></v-divider>

                                <!--음식 라벨링 후보군 선택-->                                    
                                <div v-if="isZeroCnddtFoods === false">
                                    <v-row v-for="(cnddtFood,cnddtIndex) in cnddtFoods" :key="`cnddtFood-${cnddtIndex}`"
                                    align="center" justify="center"
                                    class="border-candidate ma-1">
                                  
                                        <v-col cols="4">
                                            <div>
                                                음식{{cnddtIndex+1}} 후보군:
                                            </div>
                                        </v-col>
                                        <v-col cols="8">
                                            <CandidateFood :cnddtFood="cnddtFood" :cnddtIndex="cnddtIndex"
                                            v-on:select-canddt="selectCanddt"/>
                                        </v-col>
                                    </v-row>
                                </div>
                                <h3 v-else class="text-center red--text">
                                    분석된 음식이 없습니다
                                </h3>
                                
                                <!--등록 버튼-->
                                <div>
                                    <v-btn type="submit" block x-large rounded color="primary" class="mt-4" :disabled="invalid">상세 등록</v-btn>
                                </div>
                            </div>
                        </v-form>
                    </ValidationObserver>

                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
const LabelImage = () => import("@/components/Register/Image/LabelImage.vue");
const CandidateFood = () => import("@/components/Register/Image/CandidateFood.vue");
const LoadingComponent = () => import("@/components/LoadingComponent.vue");

import axios from 'axios'
import AWS from 'aws-sdk'
import {extend, ValidationObserver, ValidationProvider } from "vee-validate"
import {required} from "vee-validate/dist/rules"
extend('required', {
  ...required,
  message : '해당 필드는 필수값입니다.'
});

export default {
    name : "MobileRegister",
    components : {
        ValidationObserver,
        ValidationProvider,
        LabelImage,
        CandidateFood,
        LoadingComponent
    },

    created(){
        const hasNotInitDate = !this.$route.params.initDate;
        this.date = hasNotInitDate ? (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10) : this.$route.params.initDate;

        const hasNotInitMeal = !this.$route.params.initMeal;
        this.meal = hasNotInitMeal ?  '아침' : this.$route.params.initMeal;
    },

    computed : {
        //isDefaultImage:true -> defaultimg
        //isDefaultImage:false -> imgPreURL
        cImg(){
            return this.isDefaultImage ? require('@/assets/default.png') : this.imgPreURL;
        },

        cLabelImg(){
            return this.isDefaultLabelImage ? require('@/assets/default.png') : this.labelImgPreURL;
        },

        isZeroCnddtFoods(){
            return Array.isArray(this.cnddtFoods) && this.cnddtFoods.length === 0;
        }
    },

    data(){
        return {

            //로딩 관련
            isLoading : false,

            //router params 관련
            date : null,
            meal : null,

            //이미지 등록 전(이미지파일 관련)
            img : null,             //v-input 받아온 값
            imgURL : null,          //s3에 업로드되면 얻기, POST요청 (afas.jpg)
            imgPreURL : null,       //s3에 업로드되면 얻기, v-img:src (http: ~~ /afas.jpg)
            isDefaultImage : true,

            //분석된 이미지 등록 전(이미지파일 관련)
            labelImgPreURL : null,
            isDefaultLabelImage : true,

            //이미지 등록 전(S3관련)
            bucketRegion : 'ap-northeast-2',
            IdentityPoolId : 'ap-northeast-2:d6a685e8-0da6-493d-bb54-d84abf3ab01c',
            href : 'https://dgucapstonepics.s3.ap-northeast-2.amazonaws.com/', 
            albumBucketName : 'dgucapstonepics', 
            albumName : 'food_album',

            //이미지 등록 후(음식 관련)
            foods : [],
            cnddtFoods : []

        }
    },

    methods : {

        //isDefaultImage = true -> false
        changeNotDefault(){
            this.isDefaultImage = false;
        },

        //isDefaultLabelImage = true -> false
        changeNotDefaultLabel(){
            this.isDefaultLabelImage = false;
        },

        //후보군 선택
        //cnddtIndex=음식Index, activeFoodIndex=후보군Index
        selectCanddt(cnddtIndex, activeFoodIndex){
            this.foods.splice(cnddtIndex, 1, this.cnddtFoods[cnddtIndex][activeFoodIndex])
        },

        async submit(){
            // 입력조건 유효성 결과
            const result = await this.$refs.observer.validate()
            
            // 입력조건 유효성 결과 만족시
            if (result){

                //MealRegister
                this.$router.push({
                    name : "MealRegister",
                    params : {
                        initImgPreURL : this.imgPreURL,
                        initDate : this.date,
                        initMeal : this.meal,
                        initFoods : this.foods,
                    }
                });
            }
        },

        connectAWS(){
            AWS.config.update({
              region: this.bucketRegion,
              credentials: new AWS.CognitoIdentityCredentials({
                  IdentityPoolId: this.IdentityPoolId
              })
            });
        },

        getS3(){
          var s3 = new AWS.S3({
            apiVersion: "2006-03-01",
            params: { Bucket: this.albumBucketName }
          });
          return s3;
        },

        uploadAlbumFile(){
            //1.로딩 시작
            this.isLoading = true;
            this.cnddtFoods = [];
            this.foods = [];

            //2.AWS 연결
            this.connectAWS();

            //3.img 지울때 / 추가할때
            if (!this.img){
                
                //일반 이미지
                this.img = null;
                this.imgURL = null;
                
                this.imgPreURL = null;
                this.isDefaultImage = true;

                //분석된 이미지
                this.labelImgPreURL = null;
                this.isDefaultLabelImage = true;

                //1.로딩 끝
                this.isLoading = false;

            }else{
                
                //4. AWS 버킷에 업로드(1) 
                // 파일형식(.jpg) + 랜덤문자열 얻기
                let albumFileName = this.img.name;
                let form = albumFileName.split('.')[1];

                let randomString = new Date().getTime().toString(36);

                // 앨범이름 얻기
                let albumPhotosKey = encodeURIComponent(this.albumName) + "/";

                // photoKey: S3에 저장형식
                let photoKey = albumPhotosKey + randomString + '.'+ form;

                var upload = new AWS.S3.ManagedUpload({
                  params: {
                    Bucket: this.albumBucketName,
                    Key: photoKey,
                    Body: this.img,
                  }
                });

                //4. AWS 버킷에 업로드(2) 
                var promise = upload.promise();
                promise
                .then(() => {
                    
                        //이미지
                        this.imgURL = randomString + '.' + form;

                        this.imgPreURL = this.href + this.albumName + '/' + randomString + '.' + form;
                        this.isDefaultImage = false;

                        //분석된 이미지(여기서 axios.post 날려서 foods 할당)
                        this.labelImgPreURL = this.href + this.albumName + '/' + randomString + '.' + form;
                        this.isDefaultLabelImage = false;

                        axios({
                            method : 'get',
                            url : 'http://13.124.140.178:5000/predict/' + this.imgURL,
                        })
                        .then((res) =>{
                            this.isError = false;

                            if(res.data.isSuccess === "true" && res.data.code === 1000){
                                //중요) 요청에 성공하였습니다.
                                this.cnddtFoods = res.data.result.foods;

                                for (let i=0; i < this.cnddtFoods.length; i++){
                                    this.foods.push(this.cnddtFoods[i][0]); 
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
                                //중요) 인식된 음식이 없습니다.
                                
                            }

                            //1.로딩 끝
                            this.isLoading = false;
                        })
                        .catch((err)=>{
                            //중요) 서버 오류입니다.
                            //뜨기 -> alert메시지 뜨기
                            console.log(err);
                            this.isError = true;

                            //1.로딩 끝
                            this.isLoading = false;
                        });

                })
                .catch((err) => {
                    console.log(err)

                    //1.로딩 끝
                    this.isLoading = false;
                });
            } 
        }, 
    }
}
</script>

<style scoped>
.border-image{
  border : 3px solid ;
}
.border-candidate{
  border: 2px dashed;
  border-color: #80CAFF;
}
</style>
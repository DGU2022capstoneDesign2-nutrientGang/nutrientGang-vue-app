<template>

    <v-container fluid>
        <!--제목-->
        <div class="text-center">
            <h1 class="text--primary font-weight-black">음식점 수정</h1>
        </div>

        <!--음식점 등록-->
        <div>
            <v-row align="center" justify="center">
                <v-col cols="12">
                    <ValidationObserver ref="observer" v-slot="{invalid}">
                        <v-form @submit.prevent="submit">
                            <div>

                                <!--1. 음식점 이름-->
                                <div class="text-center mt-10 mb-3 div-border">
                                    <div>
                                        <h2 class="blue--text font-weight-black">음식점 이름</h2>
                                    </div>
                                    <div>
                                        <ValidationProvider :rules="{
                                        required : true,
                                        }" name="음식점 이름" v-slot="{errors}">
                                        <v-text-field v-model="rtrName" label="음식점 이름" :error-messages="errors"
                                        prepend-icon="mdi-clipboard-outline" clearable 
                                        ></v-text-field>                                    
                                        </ValidationProvider>
                                    </div>
                                </div>

                                <!--2. 음식점 사진-->
                                <div class="text-center mt-10 mb-3 div-border">
                                    <div>
                                        <h2 class="blue--text font-weight-black">음식점 사진</h2>
                                    </div>
                                    <div>
                                        <ValidationProvider :rules="{
                                        required : true,
                                        }" name="음식점 사진" v-slot="{errors}">
                                        <v-file-input v-model="rtrimg" label="음식점 사진" :error-messages="errors"
                                        accept="image/png, image/jpeg, image/bmp" outlined :show-size="1000"
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

                                    <!--음식점 사진 확인-->
                                    <div>
                                        <h4 class="font-weight-black">올린 사진 확인</h4>
                                    </div>
                                    <div class="border-image">
                                        <v-img :src="cImg" @error="changeNotDefault"
                                        height="200px" contain/>
                                    </div>
                                </div>
                                                               
                                <!--3. 음식점 주소-->
                                <div class="text-center mt-10 mb-3 div-border">
                                    <div>
                                        <h2 class="blue--text font-weight-black">음식점 주소</h2>
                                    </div>
                                    <div>
                                        <ValidationProvider :rules="{
                                            required : true,
                                            address : true,
                                            }" name="음식점 주소" v-slot="{errors}">
                                            <v-text-field v-model="rtrLocation" label="음식점 주소" :error-messages="errors"
                                            prepend-icon="mdi-map-marker" clearable class="mt-4"
                                            ></v-text-field>
                                        </ValidationProvider>
                                    </div>
                                </div>
                             
                                <!--4. 음식점 메뉴 - 반복문 -->
                                <div v-for="menu,i in rtrMenu" :key="i" class="text-center div-menuBorder mb-1">
                                    <v-app-bar flat color="white">
                                        <v-spacer></v-spacer>
                                        <v-btn class="mr-1" color="borderColor" small dark fab outlined @click="addMenu()"><v-icon>mdi-plus</v-icon></v-btn>
                                        <v-btn class="ml-1" color="borderColor" small dark fab outlined @click="deleteMenu(i)"><v-icon>mdi-minus</v-icon></v-btn>
                                    </v-app-bar>
                                    <div>
                                        <h2 class="borderColor--text font-weight-black">메뉴{{i+1}}</h2>
                                    </div>
                                    <div>
                                        <ValidationProvider :rules="{
                                            required : true,
                                            }" name="메뉴 이름" v-slot="{errors}">
                                            <v-text-field v-model="rtrMenu[i].menuName" label="메뉴 이름" :error-messages="errors"
                                            prepend-icon="mdi-food-fork-drink" clearable class="mt-4"
                                        ></v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider :rules="{
                                            required : true,
                                            }" name="메뉴 정보" v-slot="{errors}">
                                            <v-text-field v-model="rtrMenu[i].menuInfo" label="메뉴 정보" :error-messages="errors"
                                            prepend-icon="mdi-food-fork-drink" clearable class="mt-4"
                                        ></v-text-field>
                                        </ValidationProvider>
                                    </div>
                                    <div>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="6" lg="4">
                                                <ValidationProvider :rules="{
                                                    required : true,
                                                    numeric: true,
                                                    }" name="탄수화물(g) 함유량" v-slot="{errors}">
                                                    <v-text-field v-model="rtrMenu[i].menuCarbo" label="탄수화물(g) 함유량" :error-messages="errors"
                                                    prepend-icon="mdi-bowl" clearable suffix="g"></v-text-field>
                                                </ValidationProvider>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6" lg="4">
                                                <ValidationProvider :rules="{
                                                    required : true,
                                                    numeric: true,
                                                    }" name="단백질(g) 함유량" v-slot="{errors}">
                                                    <v-text-field v-model="rtrMenu[i].menuProtein" label="단백질(g) 함유량" :error-messages="errors"
                                                    prepend-icon="mdi-fuel" clearable suffix="g"></v-text-field>
                                                </ValidationProvider>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6" lg="4">
                                                <ValidationProvider :rules="{
                                                    required : true,
                                                    numeric: true,                                            
                                                    }" name="지방(g) 함유량" v-slot="{errors}">
                                                    <v-text-field v-model="rtrMenu[i].menuFat" label="지방(g) 함유량" :error-messages="errors"
                                                    prepend-icon="mdi-fire" clearable suffix="g"></v-text-field>
                                                </ValidationProvider>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>

                                <!--5. 등록 버튼-->
                                <div>
                                    <v-btn type="submit" block x-large rounded color="primary" class="mt-4" :disabled="invalid">등록하기</v-btn>
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
import AWS from 'aws-sdk'
import axios from 'axios'
import {extend, ValidationObserver, ValidationProvider } from "vee-validate"
import {required , numeric} from "vee-validate/dist/rules"
extend('required', {
  ...required,
  message : '해당 필드는 필수값입니다.'
});
extend('numeric', {
    ...numeric,
    message : '해당 필드는 숫자로만 입력해야 합니다.'
})

extend('address', async (value) => {
    
    const kakao = window.kakao;
    let geocoder = new kakao.maps.services.Geocoder();

    const addressSearch = address => {
        return new Promise((resolve) => {
            
            geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    resolve(result);
                } else {
                    resolve(status)
                }
            });
        });
    };

    const result = await addressSearch(value)
    if (result === 'ZERO_RESULT'){
        return '해당 주소 정보는 없습니다.'
    }
    return true
});


export default {

    name : 'UpdateRestaurant',  
    props : {
        rtr : Object
    },

    created(){
        const hasNotRtr = !this.$route.params.rtr;
        if(hasNotRtr) {
            this.$router.push({
                name : 'register',
            });
        }else{
            this.rtrName = hasNotRtr ? null : this.$route.params.rtr.rtrName;
            this.rtrimgPreURL = hasNotRtr ? null : this.$route.params.rtr.rtrimgURL;
            this.isDefaultImage = hasNotRtr ? true : false;
            this.rtrLocation = hasNotRtr ? null : this.$route.params.rtr.rtrLocation;

            const menuObject = [{
                menuName: null,
                menuInfo : null,
                menuCarbo : null,
                menuProtein : null,
                menuFat : null
            }];
            this.rtrMenu = hasNotRtr ? menuObject : this.$route.params.rtr.rtrMenu;
        }
    },

    data(){
        return {

            rtrName: null,

            rtrimg : null,                        //v-input 받아온 값
            rtrimgURL : null,                     //s3에 업로드되면 얻기, POST요청 (afas.jpg)
            rtrimgPreURL : null,    //s3에 업로드되면 얻기, v-img:src (~)
            isDefaultImage : true,

            rtrLocation : null,

            rtrMenu: null,


            //bucketRegion : 'ap-northeast-2',
            //IdentityPoolId : 'ap-northeast-2:7361f497-478c-4d05-88c0-aaa4f9b759bd',
            //href : 'https://photo-album-cluejws.s3.ap-northeast-2.amazonaws.com/', 
            //albumBucketName : 'photo-album-cluejws', 
            //albumName : 'rtr_album',  
            
            bucketRegion : 'ap-northeast-2',
            IdentityPoolId : 'ap-northeast-2:d6a685e8-0da6-493d-bb54-d84abf3ab01c',
            href : 'https://dgucapstonepics.s3.ap-northeast-2.amazonaws.com/', 
            albumBucketName : 'dgucapstonepics', 
            albumName : 'rtr_album',       
        }
    },

    components : {
      ValidationObserver,
      ValidationProvider
    },

    computed :{
        //isDefaultImage:true -> defaultimg
        //isDefaultImage:false -> rtrimgPreURL
        cImg(){
            return this.isDefaultImage ? require('@/assets/default.png') : this.rtrimgPreURL;
        }
    },

    methods : {
        async submit(){
            // 입력조건 유효성 결과
            const result = await this.$refs.observer.validate()
            
            // 입력조건 유효성 결과 만족시
            if (result){

                // 음식점 정보
                const rtr_info = {
                    rtrName : this.rtrName,
                    rtrimgURL : this.rtrimgURL,
                    rtrLocation : this.rtrLocation,
                    rtrMenu : this.rtrMenu
                };

                await axios.put('/api/rtr/update', rtr_info)
                    .then(res => {
                        console.log(res.data.success, res.data.message);
                        //this.$router.push('/')
                    })
                    .catch(err =>{
                        console.log(err.message)
                    })
            }
        },
        
        //메뉴등록 칸 추가 -> 버튼 클릭
        addMenu(){
            this.rtrMenu.push({
                menuName: null,
                menuInfo : null,
                menuCarbo : null,
                menuProtein : null,
                menuFat : null
            }); 
        },

        //메뉴등록 칸 제거 -> 버튼 클릭
        deleteMenu(idx){
            
            if (this.rtrMenu.length  === 1){
                //pass
            }else{
                //위치 -1(끝) , 개수 1개
                this.rtrMenu.splice(idx,1)
            }
        },

        //isDefaultImage = true -> false
        changeNotDefault(){
            this.isDefaultImage = false;
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
            //AWS 연결
            this.connectAWS();

            //rtrimg 지울때 / 추가할때
            if (!this.rtrimg){
                
                this.rtrimg = null
                this.rtrimgURL = null
                
                this.rtrimgPreURL = null;
                this.isDefaultImage = true;
            }else{
                
                //2. AWS 버킷에 업로드(1) 
                // 파일형식(.jpg) + 랜덤문자열 얻기
                let albumFileName = this.rtrimg.name;
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
                    Body: this.rtrimg,
                  }
                });

                //2. AWS 버킷에 업로드(2) 
                var promise = upload.promise();
                promise.then(
                    (data) => {
                        console.log(`파일 업로드: ${data}`);

                        //s3에 업로드되면 얻기, POST요청 (afas.jpg)
                        //s3에 업로드되면 얻기, v-img:src (~)
                        this.rtrimgURL = randomString + '.' + form;
                        
                        this.rtrimgPreURL = this.href + 'rtr_album/' + randomString + '.' + form;
                        this.isDefaultImage = false;

                    },
                    (err) => {
                       console.log(err)
                    }
                );
            } 
        }, 

        //올바른 주소인지 확인 -> 버튼 클릭
        //checkRtrLocation(){
        //    const kakao = window.kakao
        //    let geocoder = new kakao.maps.services.Geocoder();
        //
        //    let base = this;
        //    geocoder.addressSearch(this.rtrLocation, function(res,status){
        //        if (status === kakao.maps.services.Status.OK){
        //
        //            base.rtrLocationCheck = true
        //            console.log(res[0].y, res[0].x)
        //        }else{
        //            base.rtrLocationCheck = false
        //            console.log('못찾음')
        //        }
        //    });
        //},
    },

}
</script>
<style scoped>
.div-border{
    border: 2px dashed;
    border-color: #80CAFF;
    padding: 2%; 
}

.div-menuBorder{
    border: 2px dashed;
    border-color: #03C04A;
    padding: 1.5%;
}

.border-image{
  border : 3px solid ;
}
</style>

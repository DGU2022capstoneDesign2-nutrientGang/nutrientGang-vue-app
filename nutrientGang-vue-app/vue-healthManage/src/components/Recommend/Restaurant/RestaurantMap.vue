<template>

    <v-container fluid>
        <!--제목-->
        <div class="text-center mb-5">
            <v-row justify="center" align="center">
                <v-col cols="auto">
                    <h1 class="text--primary font-weight-black">음식점 현황</h1>
                </v-col>
                <v-col cols="auto">
                    <v-btn outlined color="blue" fab
                    @click="refreshMap">
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        
        <!--음식점 지도-->
        <!--서버 에러 경우, 해당 메뉴 가진 음식점 없을 경우, 정상-->
        <div class="fill-height mt-10" v-if="isError">
            <v-row justify="center">
                <v-col cols="auto">
                    <ServerErrorComponent/>
                </v-col>
            </v-row>
        </div>
        <div class="fill-height mt-10" v-else-if="isNotRtrError">
            <v-row justify="center">
                <v-col cols="auto">
                    <NotRtrInfoComponent/>
                </v-col>
            </v-row>
        </div>
        <v-card class="text-center" v-else>
            <v-card-text class="text-center">
                
                <!--카카오지도-->
                <KakaoMap ref="kmap" v-bind:options="mapOptions">
                    <template #overlay>
                        <div class="overlay-popup" ref="restaurantOverlay">

                            <div v-if="overlayRestaurant">
                                <h3>{{overlayRestaurant.rtrName}}</h3>
                                <div align="left" v-for="menu,i in overlayRestaurant.rtrMenu" :key="i" class="menu font-weight-black">
                                {{i+1}}. {{menu.menuName}}
                                </div>
                                <v-row justify="end">
                                    <v-col cols="auto" ><v-btn @click.prevent="closeOverlay()" icon><v-icon>mdi-close-outline</v-icon></v-btn></v-col>
                                </v-row>
                            </div>

                        </div>
                    </template>
                </KakaoMap>

                <!--카카오지도 버튼-->
                <v-row justify="center" class="pd-5">
                        <v-col cols="auto">
                            <v-btn v-on:click="zoom(-1)" color="primary" fab large><v-icon>mdi-magnify-plus</v-icon></v-btn>
                            <v-btn v-on:click="zoom(1)" color="primary" fab large><v-icon>mdi-magnify-minus</v-icon></v-btn>
                        </v-col>
                </v-row>
            </v-card-text>

        </v-card>
        
        <!--음식점 정보-->
        <v-card>
            <v-row class="ma-3">
                <v-col v-for="rtr,i in this.restaurants" :key="i" cols="12" sm="6" md="4" lg="3"
                @click="showOnMap(rtr)" :class="activeColor(rtr)" class="restaurant" >
                    <RestaurantVue v-bind:rtr="rtr" ></RestaurantVue>
                </v-col>
            </v-row>
        </v-card>
        

    </v-container>
</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
const NotRtrInfoComponent = () => import("@/components/ErrorComponent/NotRtrInfoComponent.vue");
import Recommend from '@/api/Recommend';
import KakaoMap from "@/components/Map/KakaoMap.vue"
import RestaurantVue from "@/components/Recommend/Restaurant/Restaurant.vue"


import {MarkerHandler} from "@/components/Map/marker-handler.js"
import {KakaoOverlay} from "@/components/Map/overlay-handler.js"

export default {
    name : 'RestaurantMap',
    props : {
        menu : Object,
    },
    components : {
      "KakaoMap" : KakaoMap,
      "RestaurantVue" : RestaurantVue,
      "ServerErrorComponent" : ServerErrorComponent,
      "NotRtrInfoComponent" : NotRtrInfoComponent,
    },

    data(){
        return {
            //에러 발생
            isError : false,
            isNotRtrError : false,

            restaurants : [],

            mapOptions : {
                center : {
                    lat : 0,
                    lng : 0
                },
                level : 3
            },

            userLat : 0,
            userLng : 0,

            markers : null, //marker 인스턴스

            activeRestaurant : null, //selected 음식점(class: acitve활성)

            overlay : null,  //overlay 인스턴스
            overlayRestaurant : null, //overlay에 보여줄 음식점(음식정보내용: 할당)
        }
    },

    computed : {
        activeColor(){
            return (rtr) => {
                
                const isNullObject = !this.activeRestaurant;

                if (!isNullObject) {
                    if(rtr.rtrIndex === this.activeRestaurant.rtrIndex){
                        return 'active';
                    }

                    return '';
                }

                return '';
            }
        }
    },

    created(){

        // 현재 위치얻기 / 안되면 동국대학교로 설정
        this.$getLocation({})
            .then((coordinates) => {
                this.mapOptions.center = {
                    lat : coordinates.lat,
                    lng : coordinates.lng
                }

                this.userLat = coordinates.lat;
                this.userLng = coordinates.lng;

                this.refreshMap();

            })
            .catch((error) => {
                this.mapOptions.center = {
                    lat : 37.55807745217469,
                    lng : 127.00095068962825
                }

                this.userLat = 37.55807745217469;
                this.userLng = 127.00095068962825;

                console.log(`${error}: 동국대학교로 위치를 설정합니다.`);
                
                this.refreshMap();
            });
    },

    methods : {

        // 버튼클릭시 지도 확대 이벤트
        zoom(delta){
            const level = Math.max(1, this.mapOptions.level + delta) //최소 level 1
            this.mapOptions.level = level
        },

        // 음식점클릭 이벤트
        showOnMap(rtr){

            //음식점클릭시 class: acitve활성
            this.activeRestaurant = rtr;


            //음식점클릭시 KakaoMap.vue의 watch속성 로직실행
            this.mapOptions.center = {
                lat : rtr.rtrlat,
                lng : rtr.rtrlng
            }

            //음식점클릭시 overlay보여주기 이벤트
            this.overlayRestaurant = rtr;
            this.overlay.showAt(rtr.rtrlat, rtr.rtrlng);

        },

        closeOverlay(){
          this.overlay.hide();
        },

        refreshMap(){
            //1. 추천 음식점 정보 얻기
            Recommend.getRcnRtr(this.menu.name, this.userLat, this.userLng)
            .then((res) =>{
                this.isError = false;
                this.isNotRtrError = false;
                console.log(res.data.message);
                if(res.data.isSuccess === true && res.data.code === 1000){
                    //중요) 요청에 성공하였습니다.
                    this.restaurants = res.data.result.restaurantDtoList;

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
                    //중요) 추천 음식점을 찾을 수 없습니다.
                    this.initData();
                    this.isNotRtrError = true;
                }
            })
            .catch((err)=>{
                //중요) 서버 오류입니다.
                //뜨기 -> alert메시지 뜨기
                console.log(err);
                this.initData();
                this.isNotRtrError = false;

                this.isError = true;
            });

            //2.(1) 음식점 마커객체 생성
            const vuekakaomap = this.$refs.kmap
            this.markers = new MarkerHandler(vuekakaomap, {
              markerClicked : (rtr) => {

                // 마커클릭시 음식점클릭 이벤트
                this.showOnMap(rtr)

              },
            });

            //2.(2) 음식점 마커 지도에 추가
            this.markers.add(this.restaurants, (rtr) => {
              return {lat : rtr.rtrlat, lng: rtr.rtrlng}
            });

            //3. 음식점 overlay객체 생성
            this.overlay = new KakaoOverlay(vuekakaomap, this.$refs.restaurantOverlay)
        },

        initData(){
            this.restaurants = [];

            //이건 처음에 할당하고 고정해야됨
            //this.mapOptions = {
            //    center : {
            //        lat : 0,
            //        lng : 0
            //    },
            //    level : 3
            //};

            //marker 인스턴스
            this.markers = null; 

            //selected 음식점(class: acitve활성)
            this.activeRestaurant = null; 

            //overlay 인스턴스
            //overlay에 보여줄 음식점(음식정보내용: 할당)
            this.overlay = null;  
            this.overlayRestaurant = null; 
        }
    },
}
</script>

<style>
.active {
  background-color: #ed4215;
}

.restaurant:hover {
    cursor: pointer;
}
</style>

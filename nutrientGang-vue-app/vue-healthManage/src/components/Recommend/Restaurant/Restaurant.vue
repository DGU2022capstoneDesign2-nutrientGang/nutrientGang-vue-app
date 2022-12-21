<template>
    <v-card class="mx-auto" max-width="344">
        <v-img :src="cImg" @error="changeNotDefault"  
        height="200px" contain></v-img>

        <v-card-title>{{rtr.rtrName}}</v-card-title>
        <v-card-subtitle>주소 : {{rtr.rtrLocation}}</v-card-subtitle>

        <v-card-actions>
          <v-btn color="rtrActive" text @click="show = !show">메뉴보기(클릭)</v-btn>

          <v-spacer></v-spacer>

          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>

            <v-card-text v-for="menu,i in rtr.rtrMenu" :key="i">
              <div class="border-styles">
                <h3>{{menu.menuName}}</h3>
                <v-divider></v-divider>
                <div class="mb-1">{{menu.menuInfo}}</div>
                <div>칼로리: {{menu.menuKcal}}kcal</div>
                <div>탄수화물: {{menu.menuCarbo}}g</div>
                <div>단백질: {{menu.menuProtein}}g</div>
                <div>지방: {{menu.menuFat}}g</div>
              </div>

            </v-card-text>
          </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
export default {
    name : 'Restaurant',
    props : {
      rtr : Object
    },

    data(){
        return {
          show: false,
          default_img : false,
        }
    },

    computed :{
        //default_img:true -> defaultimg
        //default_img:false -> rtrimgPreURL
        cImg(){

            //이미지 등록 전(S3관련)

            const href = 'https://dgucapstonepics.s3.ap-northeast-2.amazonaws.com/';
            const albumName = 'rtr_album';

            const url = href + albumName + '/' + this.rtr.rtrImgURL;
            return this.default_img ? require('@/assets/default.png') : url;
        }
    },

    methods :{
      //default_img = false -> true,
      changeNotDefault(){
          this.default_img = true;
      },
    }
}
</script>

<style>
.border-styles{
 margin: 2px 0;
 padding: 1px 3px;
 border-width: 2px;
 border-style: solid;
}

.border-styles h3{
 color: #ed4215;;
}
</style>
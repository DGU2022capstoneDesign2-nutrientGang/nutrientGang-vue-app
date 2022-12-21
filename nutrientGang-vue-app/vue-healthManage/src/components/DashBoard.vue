<template>
  <v-container>
    <div v-if="isLogin">
      <div class="mb-10 border pa-3">
        <div class="text-center mb-10">
            <h1 class="text--primary font-weight-black">건강정보</h1>
        </div>
        <v-row align="center" justify="center">

            <!--다이어리-->
            <v-col cols="6">
                <v-btn @click="goDiary"
                block x-large rounded color="primary" outlined>다이어리</v-btn>
            </v-col>

            <!--리포트-->
            <v-col cols="6">
                <v-btn @click="goReport"
                block x-large rounded color="error" outlined>리포트</v-btn>
            </v-col>
        </v-row>
      </div>
      <div class="mb-10 border pa-3">
        <div class="text-center mb-10">
            <h1 class="text--primary font-weight-black">추천</h1>
        </div>
        <v-row align="center" justify="center">

            <!--메뉴 추천-->
            <v-col cols="6">
                <v-btn @click="goMenu"
                block x-large rounded color="primary" outlined>메뉴</v-btn>
            </v-col>

            <!--음식점 추천-->
            <v-col cols="6">
                <v-btn @click="goRestaurant"
                block x-large rounded color="error" outlined>음식점</v-btn>
            </v-col>
        </v-row>
      </div>
      <div class="mb-10 border pa-3">
        <div class="text-center mb-10">
            <h1 class="text--primary font-weight-black">수정</h1>
        </div>
        <v-row align="center" justify="center">

            <!--식사정보 수정-->
            <v-col cols="6">
                <v-btn @click="goMealModify"
                block x-large rounded color="primary" outlined>식사정보</v-btn>
            </v-col>

            <!--건강정보 수정-->
            <v-col cols="6">
                <v-btn @click="goHealthModify"
                block x-large rounded color="error" outlined>건강정보</v-btn>
            </v-col>
        </v-row>
      </div>

    </div>
    <div v-else>
      <div class="text-center mb-10">
          <h1 class="text--primary font-weight-black">회원가입 및 로그인</h1>
      </div>
      <v-row align="center" justify="center">
         
          <!--다이어리-->
          <v-col cols="6">
              <v-btn @click="goRegister"
              block x-large rounded color="primary" outlined>회원가입</v-btn>
          </v-col>
          
          <!--리포트-->
          <v-col cols="6">
              <v-btn @click="goLogin"
              block x-large rounded color="error" outlined>로그인</v-btn>
          </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name : 'DashBoard',
  computed : {
    ...mapState(['isLogin']),
  },

  methods : {

    goRegister(){
      this.$router.push({
        name : "info-first",
      });
    },

    goLogin(){
      this.$router.push({
        name : "sign-in",
      });
    },

    goDiary(){
      this.$router.push({
        name : "Diary",
      });
    },

    goReport(){
      this.$router.push({
        name : "Report",
      });
    },

    goMenu(){
      this.$router.push({
        name : "MenuRcn",
      });
    },

    goRestaurant(){
      this.$router.push({
        name : "RestaurantRcn",
      });
    },

    goMealModify(){
      this.$router.push({
        name : "MealModify",
      });
    },

    goHealthModify(){
      this.$router.push({
        name : "HealthInfoModify",
      });
    },
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
<template>

   <!-- v-bind="$attrs"를 통해 상위 props를 내려받음 -->
   <!-- <v-navigation-drawer v-model="drawer" :src="require('@/assets/star.jpg')" dark app> -->
  <v-navigation-drawer v-bind="$attrs" :src="require('@/assets/star.jpg')" dark app>

      <!--(1)v-navigation-drawer :src="require('@/assets/star.jpg')"[배경입히기]-->
      <!--(2)v-navigation-drawer 배경이미지[그라디언트 취하기]-->
      <!--(3)v-navigation-drawer dark[글자 밝게하기]-->
      <!--(4)v-navigation-drawer active-class="primary"[선택시 색깔 표시]-->

      <!--하위컴포넌트에서 slot을 이용해 해당부분에 삽입-->
      <!--상위컴포넌트--> 
      <template v-slot:img="props">
        <v-img :gradient="gradient" v-bind="props"></v-img>
      </template>

      <!--drawer 제목, 부제목-->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            건강관리 서비스
          </v-list-item-title>
          <v-list-item-subtitle>
            영양갱
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <!--drawer Navigation-->
      <v-list expand dense nav>
        
        <!--로그인 x items-->
        <template v-for="(item,index) in items">
          
          <!--item.items가 존재하면O-->
          <v-list-group v-if="item.items" :key="`NotLogin-${index}`" :prepend-icon="item.icon">
            
            <!--주 Navigtaion-->
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <!--보조 Navigtaion-->
            <template v-for="(itemchild, index) in item.items">
              <!--item-->
              <v-list-item :key="index" :to="itemchild.to" link
              :disabled="isLogin === true">
                <v-list-item-icon>
                  <v-icon>{{ itemchild.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ itemchild.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

          </v-list-group>

          <!--item.items가 존재하면X-->
          <!--item-->
          <v-list-item v-else :key="index" :to="item.to" active-class="primary" link
          :disabled="isLogin === true">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <!--로그인 o items-->
        <template v-for="(item,index) in login_items">
          
          <!--item.items가 존재하면O-->
          <v-list-group v-if="item.items" :key="`Login-${index}`" :prepend-icon="item.icon">
  
            <!--주 Navigtaion-->
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <!--보조 Navigtaion-->
            <template v-for="(itemchild, index) in item.items">
              <!--item-->
              <v-list-item :key="index" :to="itemchild.to" link
              :disabled="isLogin === false">
                <v-list-item-icon>
                  <v-icon>{{ itemchild.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ itemchild.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

          </v-list-group>

          <!--item.items가 존재하면X-->
          <!--item-->
          <v-list-item v-else :key="index" :to="item.to" active-class="primary" link
          :disabled="isLogin === false">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>


      </v-list>

    </v-navigation-drawer>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name : "AppNavigationDrawer",
  data() {
    return {
      gradient: "rgba(0,0,0,0.7), rgba(0,0,0,0.7)",

      items: [
        { title: '로그인', icon: 'mdi-account-badge', to: "/authentication/sign-in" },
        { title: '회원가입', icon: 'mdi-apple-finder', to: "/authentication/info-first" },
      ],

      login_items : [
        { title: '마이페이지', icon: 'mdi-account-multiple', items : [
            { title: "다이어리", icon: 'mdi-heart-box-outline', to: "/mypage/diary" },
            { title: "리포트", icon: 'mdi-history', to: "/mypage/report" },
        ]},          
        { title: '추천페이지', icon: 'mdi-thumb-up', items : [
            { title: "메뉴", icon: 'mdi-silverware', to: "/recommend/menu" },
            { title: "음식점", icon: 'mdi-home-variant', to: "/recommend/restaurant" },
        ]},
        { title: '등록페이지', icon: 'mdi-account-multiple-plus', items : [
            { title: "카메라/갤러리(식사)", icon: 'mdi-image-filter-tilt-shift', to: "/setting/register/image/mobile" },
            { title: "텍스트(식사)", icon: 'mdi-comment-text-outline', to: "/setting/register/image/text" },
        ]},
        { title: '수정페이지', icon: 'mdi-account-switch', items : [
            { title: "식사", icon: 'mdi-food', to: "/setting/modify/meal" },
            { title: "건강정보", icon: 'mdi-dumbbell', to: "/setting/modify/healthInfo" },
        ]}, 
      ]
    }
  },

  computed : {
    ...mapState(['isLogin'])
  }
}
</script>

<style>

</style>
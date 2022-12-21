<template>

   <!-- v-bind="$attrs"를 통해 상위 props를 내려받음 -->
   <!-- <v-navigation-drawer v-model="drawer" :src="require('@/assets/sidebar.jpg')" dark app> -->
  <v-navigation-drawer v-bind="$attrs" :src="require('@/assets/star.jpg')" dark app>

      <!--(1)v-navigation-drawer :src="require('@/assets/sidebar.jpg')"[배경입히기]-->
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
           음식점 등록 서비스
          </v-list-item-title>
          <v-list-item-subtitle>
            영양갱
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <!--drawer Navigation-->
      <v-list expand dense nav>
        <!--item.items가 존재하면X-->
        <!--item(items의 item)-->   
        <template v-for="(item) in not_login_items">
          <v-list-item :key="item.idx" :to="item.to" active-class="primary" link
          :disabled="isLogin === true">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!--item.items가 존재하면X-->
        <!--item(items의 item)-->        
        <template v-for="(item) in items">
          <v-list-item :key="item.idx" :to="item.to" active-class="primary" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!--item.items가 존재하면X-->
        <!--item(login_items의 item)-->
        <template v-for="(item) in login_items">
          <v-list-item :key="item.idx" :to="item.to" active-class="primary" link 
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
  name : 'AppNavigationDrawer',
  data() {
    return {
      gradient: "rgba(0,0,0,0.7), rgba(0,0,0,0.7)",

      not_login_items : [
        { idx : 0, title: '로그인', icon: 'mdi-food-fork-drink', to: '/authentication/sign-in'}, 
        { idx : 1, title: '회원가입', icon: 'mdi-food-fork-drink', to: '/authentication/sign-up'},   
      ],

      items: [
        { idx : 100, title: '음식점 현황', icon: 'mdi-food-fork-drink', to: '/'},  
      ],
      
      login_items :[
        { idx : 200, title: '음식점 등록', icon: 'mdi-cart-plus', to: '/register'},
        { idx : 201, title: '마이페이지', icon: 'mdi-account-check', to: '/mypage'}
      ],
    }
  },

  computed : {
      ...mapState(['isLogin'])
  },
}
</script>

<style>

</style>
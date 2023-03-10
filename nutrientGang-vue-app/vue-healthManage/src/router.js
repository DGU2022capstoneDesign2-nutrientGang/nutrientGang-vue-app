import Vue from "vue"
import VueRouter from "vue-router"
import axios from 'axios'
import {store} from '@/store/store'

const DefaultLayout = () => import("@/layouts/Default/index.vue");
const AuthenticationLayout = () => import("@/layouts/Auth/index.vue");
const MyPageLayout = () => import("@/layouts/MyPage/index.vue");
const RecommendLayout = () => import("@/layouts/Recommend/index.vue");
const SettingLayout = () => import("@/layouts/Setting/index.vue");

//DefaultLayout
const DashBoard = () => import('@/components/DashBoard.vue');

//AuthenticationLayout
const SignIn = () => import('@/layouts/Auth/SignIn.vue')

const InfoFist = () => import("@/layouts/Auth/InfoFirstIn.vue");
const InfoSecond = () => import("@/layouts/Auth/InfoSecondIn.vue");
const InfoSignUp  = () => import("@/layouts/Auth/InfoSignUp.vue");

//MyPageLayout
const Diary = () => import("@/layouts/MyPage/Diary/Diary.vue");
const Report = () => import("@/layouts/MyPage/Report/Report.vue");

//RecommendLayout
const MenuRcn = () => import("@/layouts/Recommend/Menu/MenuRcn.vue");
const RestaurantRcn = () => import("@/layouts/Recommend/Restaurant/RestaurantRcn.vue");

//SettingLayout
//SettingLayout- Register
const WeightRegister = () => import("@/layouts/Setting/Register/Weight/WeightRegister.vue");

const MobileRegister = () =>import("@/layouts/Setting/Register/Image/MobileRegister.vue");
const TextRegister = () => import("@/layouts/Setting/Register/Image/TextRegister.vue");

const MealRegister = () => import("@/layouts/Setting/Register/Meal/MealRegister.vue");

//SettingLayout
//SettingLayout - Modify
const WeightModify = () => import("@/layouts/Setting/Modify/Weight/WeightModify.vue");

const MealModify = () => import("@/layouts/Setting/Modify/Meal/MealModify.vue");
const MealDetailModify = () => import("@/layouts/Setting/Modify/Meal/MealDetailModify.vue");

const HealthInfoModify = () => import("@/layouts/Setting/Modify/HealthInfo/HealthInfoModify.vue");


Vue.use(VueRouter)
const routes = [
    {
        path: "/main",
        component : DefaultLayout,
        children : [
            {
                name : 'main',
                path : '/',
                component : DashBoard
            }
        ]
    },

    {
        path: "/",
        redirect : '/authentication/sign-in'
    },

    {
        name : "authentication",
        path: "/authentication",
        component : AuthenticationLayout,
        children : [
            {
                name : 'info-first',
                path : 'info-first',
                component : InfoFist
            },
            {  
                name : 'info-second',
                path : 'info-second',
                component : InfoSecond,
            },
            {
                name : 'info-sign-up',
                path : 'info-sign-up',
                component : InfoSignUp
            },
            {
                name : 'sign-in',
                path : "sign-in",
                component : SignIn
            },
        ]
    },

    {
        path: "/mypage",
        component : MyPageLayout,
        children : [
            {   
                name : 'Diary',
                path : "diary",
                component : Diary,

            },
            {
                name : 'Report',
                path : "report",
                component : Report
            },
        ]
    },

    {
        path : '/recommend',
        component : RecommendLayout,
        children : [
            {
                name : "MenuRcn",
                path : 'menu',
                component : MenuRcn,
                props : true,
            },
            {
                name : "RestaurantRcn",
                path : 'restaurant',
                component : RestaurantRcn,
                props : true,
            }
        ]
    },

    {
        path : '/setting/register',
        component : SettingLayout,
        children : [
            {
                name : "WeightRegister",
                path : 'weight',
                component : WeightRegister,
                props : true,
            },
            {
                name : "MobileRegister",
                path : 'image/mobile',
                component : MobileRegister,
                props : true,
            },
            {
                name : "TextRegister",
                path : 'image/text',
                component : TextRegister,
                props : true,
            },
            {
                name : "MealRegister",
                path : 'meal',
                component : MealRegister,
                props : true,
            },
        ]
    },

    {
        path : '/setting/modify',
        component : SettingLayout,
        children : [
            {
                name : "WeightModify",
                path : 'weight',
                component : WeightModify,
                props : true,
            },
            {
                name : "MealModify",
                path : 'meal',
                component : MealModify,
                props : true,
            },
            {
                name : "MealDetailModify",
                path : 'meal/detail',
                component : MealDetailModify,
                props : true,
            },
            {
                name : "HealthInfoModify",
                path : 'healthInfo',
                component : HealthInfoModify,
                props : true,
            }
        ]
    }

];

const router = new VueRouter({
    mode : "history",
    routes
});

router.beforeEach( async (to,from,next)=>{

    // ????????????
    const expiredTime = localStorage.getItem('access-token-expiresIn');

    // ?????? ??????
    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_curr = new Date(utc + (KR_TIME_DIFF));
    const nowTime = kr_curr.getTime();

    //?????? ????????? ????????? ?????????,???????????? ??????????????? ?????????,???????????? ???????????? ?????????
    if (!expiredTime){
        
        // x(????????? ?????????: ????????? ???????????? return)
        const isInfoFirst = to.path === '/authentication/info-first';
        const isInfoSecond = to.path === '/authentication/info-second';
        const isInfoSignUp = to.path === '/authentication/info-sign-up';
        const isSignIn = to.path === '/authentication/sign-in';

        const isAuthPage = isInfoFirst || isInfoSecond || isInfoSignUp || isSignIn;
        if (!isAuthPage){
            return next({name : 'sign-in'});
        }
    }
    //?????? ????????? ????????? ????????? ??????
    else{

        // ????????????>???????????? ?????????O
        if (nowTime > expiredTime){
      
            //1. localStorage?????? ????????????
            const accessToken = localStorage.getItem('access-token');
            const refreshToken = localStorage.getItem('refresh-token');

            const tokenObj = {
                accessToken : accessToken,
                refreshToken : refreshToken,
            }
          
            //2. ????????? ??????
            await axios.post('http://54.180.116.95:3000/auth/reissue', tokenObj)
            .then(res => {
                if (res.data.isSuccess === true && res.data.code === 1000){
                    //??????) ????????? ?????????????????????.
                    // o(?????? ????????? return)
                    console.log('????????? ?????????????????????. ????????? ?????? ?????? - ???????????????');

                    //1. localStoarge??? ??????
                    const loginResult = res.data.result;
                    store.commit('setLocalStorage', loginResult);

                    //2. loginSuccess
                    store.commit('loginSuccess', res.data.result.username);
                    
                    //3. (?????? ????????? ???????????? route??? Diary??? return)
                    switch(to.path){
                        case '/authentication/info-first':
                            return next({name : 'Diary'});
                        case '/authentication/info-second':
                            return next({name : 'Diary'});
                        case '/authentication/info-sign-up':
                            return next({name : 'Diary'});
                        case '/authentication/sign-in':
                            return next({name : 'Diary'});
                    }

                }else {
                    //??????) Refresh Token??? ???????????? ????????????, ??????????????? ??????????????????.
                    // x(????????? ???????????? return)
                    console.log('????????? ???????????? ????????? ??????????????? ?????? - ????????? ?????????');

                    store.dispatch('logout')
                    .then(() => {
                        return next({name : 'sign-in'});
                    });
                }
            })
            .catch(() => {
                //??????) ?????? ?????? ?????????.
                // x(????????? ???????????? return)
                console.log('????????? ???????????? ????????? ??????????????? ?????? - ????????? ?????????');

                store.dispatch('logout')
                .then(() => {
                    return next({name : 'sign-in'});
                });
            });
        }
        // ????????????>???????????? ?????????X
        // o(?????? ????????? return)
        else{
            console.log('????????? ???????????? ??????????????? - ???????????????');
            
            //0. (?????? ????????? ???????????? route??? Diary??? return)
            switch(to.path){
                case '/authentication/info-first':
                    return next({name : 'Diary'});
                case '/authentication/info-second':
                    return next({name : 'Diary'});
                case '/authentication/info-sign-up':
                    return next({name : 'Diary'});
                case '/authentication/sign-in':
                    return next({name : 'Diary'});
            }

            //1. loginSuccess
            const userName = localStorage.getItem('user-name');
            store.commit('loginSuccess', userName);
        }
    }

    return next();
});

export {router}; 
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

    // 완료시간
    const expiredTime = localStorage.getItem('access-token-expiresIn');

    // 현재 시간
    const curr = new Date();
    const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_curr = new Date(utc + (KR_TIME_DIFF));
    const nowTime = kr_curr.getTime();

    //만료 토큰이 없다면 로그인,회원가입 페이지니까 로그인,회원가입 페이지로 돌리기
    if (!expiredTime){
        
        // x(이외의 페이지: 로그인 페이지로 return)
        const isInfoFirst = to.path === '/authentication/info-first';
        const isInfoSecond = to.path === '/authentication/info-second';
        const isInfoSignUp = to.path === '/authentication/info-sign-up';
        const isSignIn = to.path === '/authentication/sign-in';

        const isAuthPage = isInfoFirst || isInfoSecond || isInfoSignUp || isSignIn;
        if (!isAuthPage){
            return next({name : 'sign-in'});
        }
    }
    //만료 토큰이 있다면 재발행 판단
    else{

        // 현재시간>만료시간 재발행O
        if (nowTime > expiredTime){
      
            //1. localStorage에서 가져오기
            const accessToken = localStorage.getItem('access-token');
            const refreshToken = localStorage.getItem('refresh-token');

            const tokenObj = {
                accessToken : accessToken,
                refreshToken : refreshToken,
            }
          
            //2. 재발행 요청
            await axios.post('http://54.180.116.95:3000/auth/reissue', tokenObj)
            .then(res => {
                if (res.data.isSuccess === true && res.data.code === 1000){
                    //중요) 요청에 성공하였습니다.
                    // o(목표 페이지 return)
                    console.log('로그인 만료되었습니다. 재발행 요청 성공 - 페이지이동');

                    //1. localStoarge에 저장
                    const loginResult = res.data.result;
                    store.commit('setLocalStorage', loginResult);

                    //2. loginSuccess
                    store.commit('loginSuccess', res.data.result.username);
                    
                    //3. (만료 토큰이 필요없는 route면 Diary로 return)
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
                    //중요) Refresh Token이 유효하지 않습니다, 로그아웃된 사용자입니다.
                    // x(로그인 페이지로 return)
                    console.log('로그인 만료되어 재발행 요청했으나 오류 - 로그인 페이지');

                    store.dispatch('logout')
                    .then(() => {
                        return next({name : 'sign-in'});
                    });
                }
            })
            .catch(() => {
                //중요) 서버 오류 입니다.
                // x(로그인 페이지로 return)
                console.log('로그인 만료되어 재발행 요청했으나 오류 - 로그인 페이지');

                store.dispatch('logout')
                .then(() => {
                    return next({name : 'sign-in'});
                });
            });
        }
        // 현재시간>만료시간 재발행X
        // o(목표 페이지 return)
        else{
            console.log('로그인 만료되지 않았습니다 - 페이지이동');
            
            //0. (만료 토큰이 필요없는 route면 Diary로 return)
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
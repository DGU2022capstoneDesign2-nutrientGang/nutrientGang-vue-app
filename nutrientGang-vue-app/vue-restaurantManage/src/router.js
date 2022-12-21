import Vue from "vue"
import VueRouter from "vue-router"
import axios from 'axios'
import {store} from '@/store/store'

const DefaultLayout = () => import("@/layouts/default/index.vue")
const AuthenticationLayout = () => import("@/layouts/authentication/index.vue")
const RegisterLayout = () => import("@/layouts/register/index.vue")
const MyPageLayout = () => import("@/layouts/mypage/index.vue")

// DefaultLayout
const RestaurantList = () => import("@/layouts/default/RestaurantList.vue")

//AuthenticationLayout
const SignIn = () => import('@/layouts/authentication/SignIn.vue')
const SignUp = () => import("@/layouts/authentication/SignUp.vue")

//RegisterLayout
const RegisterRestaurant = () => import("@/layouts/register/RegisterRestaurant.vue")

//MyPageLayout
const AllRestaurant = () => import("@/layouts/mypage/AllRestaurant.vue")
const UpdateRestaurant = () => import("@/layouts/mypage/UpdateRestaurant.vue");


Vue.use(VueRouter)
const routes = [

    {
        path : "/",
        component : DefaultLayout,
        children : [

            {
                name : 'main',
                path : '/',
                component : RestaurantList
            },
        ]
    },

    {   
        path: "/authentication",
        component : AuthenticationLayout,
        children : [
            {
                name : 'sign-up',
                path : 'sign-up',
                component : SignUp
            },
            {
                name : 'sign-in',
                path : "sign-in",
                component : SignIn
            },
        ]
    },

    {
        path: "/register",
        component : RegisterLayout,
        children : [
            {
                name : 'RegisterRestaurant',
                path : '/',
                component : RegisterRestaurant
            },

        ]
    },

    {
        path: "/mypage",
        component : MyPageLayout,
        children : [
            {
                name : 'AllRestaurant',
                path : '/',
                component : AllRestaurant
            },
            {
                name : 'UpdateRestaurant',
                path : 'update',
                component : UpdateRestaurant,
                props : true
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

    //만료 토큰이 없다면 메인,로그인,회원가입 페이지니까 메인,로그인,회원가입 페이지로 돌리기
    if (!expiredTime){
        
        // x(이외의 페이지: 메인 페이지로 return)
        const isMain = to.path === '/';
        const isInfoSignUp = to.path === '/authentication/sign-up';
        const isSignIn = to.path === '/authentication/sign-in';

        const isAuthPage = isMain || isInfoSignUp || isSignIn;
        if (!isAuthPage){
            return next({name : 'main'});
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
                    
                    //3. (만료 토큰이 필요없는 route면 main으로 return)
                    switch(to.path){
                        case '/authentication/sign-up':
                            return next({name : 'main'});
                        case '/authentication/sign-in':
                            return next({name : 'main'});
                    }

                }else {
                    //중요) Refresh Token이 유효하지 않습니다, 로그아웃된 사용자입니다.
                    // x(로그인 페이지로 return)
                    console.log('로그인 만료되어 재발행 요청했으나 오류 - 메인 페이지');

                    store.dispatch('logout')
                    .then(() => {
                        return next({name : 'main'});
                    });
                }
            })
            .catch(() => {
                //중요) 서버 오류 입니다.
                // x(로그인 페이지로 return)
                console.log('로그인 만료되어 재발행 요청했으나 오류 - 메인 페이지');

                store.dispatch('logout')
                .then(() => {
                    return next({name : 'main'});
                });
            });
        }
        // 현재시간>만료시간 재발행X
        // o(목표 페이지 return)
        else{
            console.log('로그인 만료되지 않았습니다 - 페이지이동');
            
            //0. (만료 토큰이 필요없는 route면 main으로 return)
            switch(to.path){
                case '/authentication/sign-up':
                    return next({name : 'main'});
                case '/authentication/sign-in':
                    return next({name : 'main'});
            }

            //1. loginSuccess
            const userName = localStorage.getItem('user-name');
            store.commit('loginSuccess', userName);
        }
    }

    return next();
});

export {router}; 
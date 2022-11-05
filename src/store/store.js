import Vue from "vue"
import Vuex from "vuex"
import axios from 'axios'


Vue.use(Vuex);

export const store = new Vuex.Store({

    state : {
        isLogin : false,
        isLoginError : false,
        LoginErrorMsg: '',

        userInfo : {
            user_name : "정원석"
        }
    },

    getters : {
        getUserInfo_name(state){
            if(state.isLogin){
                return state.userInfo.user_name;
            }

            return '';
        }
    },

    mutations : {
        
        //로그인 성공 시
        loginSuccess(state, payload){
            state.isLogin = true;
            state.isLoginError = false;

            state.userInfo = payload
        },

        //로그인 실패 시
        loginError(state, msg){
            state.isLogin = false;
            state.isLoginError = true;
            state.LoginErrorMsg = msg;

            setTimeout(()=>{
                state.isLoginError = false;
                state.LoginErrorMsg = '';
            },3000);
        },

        logout(state){
            state.isLogin = false;
            state.isLoginError = false;

            state.userInfo = null;
        },

    },

    actions : {
        login({dispatch}, loginObj){
            
            axios.post('/api/user/login', loginObj)
            .then(res => {
                
                
                // 로그인 일치 정보 o (isSuccess: true, token: token)
                // 로그인 일치 정보 x (isSuccess: false, message)
                if (res.data.isSuccess === true){             // 로그인 일치 정보 o
                    
                    //1. localStoarge에 token 저장(새로고침 방지)
                    let token = res.data.token;
                    localStorage.setItem('access-token', token);

                    //2. getMemberInfo
                    dispatch('getMemberInfo');

                }else{                                     // 로그인 일치 정보 x      
                    console.log(res.data.isSuccess, res.data.message)
                    
                    this.commit('loginError', res.data.message);
                }

            })
            .catch(err =>{
                console.log(err.message)
            })
        },

        getMemberInfo({commit}){
            
            //1. localStoarge에서 token 얻음(새로고침 방지)
            let token = localStorage.getItem('access-token');
            let config = {
                headers : {
                    'access-token' : token
                }
            };

            //2. token을 헤더에 포함시켜서 유저 정보를 요청
            axios.get('/api/user/auth', config)
            .then(response => {
                
                //auth o (isSuccess: true, user_id, user_name)
                //auth x (isSuccess: false, message)
                if (response.data.isSuccess === true){    //auth o
                    
                    let userInfo = {
                        user_id : response.data.user_id,
                        user_name : response.data.user_name,
                    };
                    console.log(response.data.isSuccess, response.data.user_name)
                    commit('loginSuccess', userInfo)
                }else{                                  //auth x
                    console.log(response.data.isSuccess, response.data.message);
                }
            })
            .catch(err => {
                console.log(err.message);
            });
        },

        logout({commit}) {

            localStorage.removeItem('access-token');

            commit('logout')
        },
    }
});
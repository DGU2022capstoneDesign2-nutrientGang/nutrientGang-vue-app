import Vue from "vue"
import Vuex from "vuex"
import axios from 'axios'

Vue.use(Vuex);

export const store = new Vuex.Store({

    state : {
        infoTarget : 0,   //0:체중감량 1:근육증량 2:체중유지
        infoActivity : 0, //0:가벼운활동 1:일상적업무 2:심한활동
        infoGender : 0,   //0:남자 1:여자
        infoHeight : 180, //키
        infoWeight : 50,  //몸무게
        infoName : null,
        infoEmail : null,
        infoPassword : null,

        isLogin : false,
        isLoginError : false,
        LoginErrorMsg : '',

        userName : '',

        modifyInfoTarget : 0,   //0:체중감량 1:근육증량 2:체중유지
        modifyInfoActivity : 0, //0:가벼운활동 1:일상적업무 2:심한활동
        modifyInfoGender : 0,   //0:남자 1:여자
        modifyInfoHeight : 180, //키
        modifyInfoWeight : 50,  //몸무게
    },

    getters : {
        getUserName(state){
            if(state.isLogin){
                return state.userName;
            }

            return '';
        },
    },
    
    mutations : {

        //회원가입 성공 시 
        clearInfoRegister(state){
            state.infoTarget = 0;
            state.infoActivity = 0;
            state.infoGender = 0;
            state.infoHeight = 180;
            state.infoWeight = 50;
            state.infoName = null;
            state.infoEmail = null;
            state.infoPassword = null;     
        },

        //건강정보 수정 성공시
        clearInfoModify(state){
            state.modifyInfoTarget = 0;
            state.modifyInfoActivity = 0;
            state.modifyInfoGender = 0;
            state.modifyInfoHeight = 180;
            state.modifyInfoWeight = 50;
        },
        
        //localStorage에 저장
        setLocalStorage(state, loginResult){
            
            const accessToken = loginResult.tokenDto.accessToken;
            const refreshToken = loginResult.tokenDto.refreshToken;
            const accessTokenExpiresIn = loginResult.tokenDto.accessTokenExpiresIn;
            localStorage.setItem('access-token', accessToken);
            localStorage.setItem('refresh-token', refreshToken);
            localStorage.setItem('access-token-expiresIn', accessTokenExpiresIn);
            localStorage.setItem('user-name', loginResult.username);
        },

        //localStorage에 삭제
        removeLocalStorage(){
            
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh-token');
            localStorage.removeItem('access-token-expiresIn');
            localStorage.removeItem('user-name');
        },

        //로그인 성공 시
        loginSuccess(state, userName){
            state.isLogin = true;
            state.isLoginError = false;

            state.userName = userName;
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

            state.userName = '';
        },
    },

    actions : {
        
        // 로그인 버튼 클릭시 dispatch
        async login({commit}, loginObj){
            
            await axios.post('http://54.180.116.95:3000/auth/login', loginObj)
            .then(res => {
                console.log(res.data.message);
                if (res.data.isSuccess === true && res.data.code === 1000){            
                    //중요) 요청에 성공하였습니다.
                    //1. localStoarge에 저장
                    const loginResult = res.data.result;
                    commit('setLocalStorage', loginResult);
                    
                    //2. loginSuccess
                    commit('loginSuccess', res.data.result.username);

                }else if(res.data.isSuccess === false && res.data.code === 2003){       
                    
                    //중요) 비밀번호가 틀렸습니다.
                    commit('loginError', res.data.message);
                }else if (res.data.isSuccess === false && res.data.code === 2010){

                    //중요) 유저를 찾을 수 없습니다.
                    commit('loginError', res.data.message);
                }

            })
            .catch(err =>{
                //중요) 서버 오류입니다.
                //뜨기 -> alert메시지 뜨기
                console.log(err);
                commit('loginError', '서버와의 통신이 원할하지 않습니다.');
            });
        },


        //로그아웃 버튼 클릭시 dispatch
        logout({commit}) {

            //1. localStorage에 삭제
            commit('removeLocalStorage');

            //2. logout
            commit('logout')
        },
    }
});
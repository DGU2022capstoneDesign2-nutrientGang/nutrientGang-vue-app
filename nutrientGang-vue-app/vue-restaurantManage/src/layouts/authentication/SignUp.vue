<template>

    <v-container fluid>

        <v-card>
            <v-card-text class="text-center px-12 py-16">  
              
                <h1 class="text--primary font-weight-black">회원가입</h1>
               
                <ValidationObserver ref="observer" v-slot="{invalid}">
                    <v-form @submit.prevent="submit">
        
                        <ValidationProvider rules="required|max:10" name="이름" v-slot="{errors}">
                          <v-text-field v-model="name" label="이름" :counter="10" :error-messages="errors"
                          prepend-icon="mdi-account-badge" clearable
                          />
                        </ValidationProvider>
                   
                        <ValidationProvider :rules="{
                            required : true,
                            email : true,
                            }" name="이메일" v-slot="{errors}">
                            <v-text-field v-model="email" label="이메일" :error-messages="errors"
                            prepend-icon="mdi-email-outline" clearable 
                            ></v-text-field>                                    
                        </ValidationProvider>
            
                        <ValidationProvider rules="required|min:4" name="비밀번호" v-slot="{errors}">
                            <v-text-field v-model="password" label="비밀번호" :error-messages="errors"
                            prepend-icon="mdi-lock-outline" clearable class="mt-4"
                            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'" :type="passwordShow ? 'text' : 'password'"
                            @click:append="passwordShow = !passwordShow"></v-text-field>
                        </ValidationProvider>
                
                        <ValidationProvider :rules="{
                            required : true,
                            min : 4,
                            confirmed : '비밀번호'
                        }" name="비밀번호 확인" v-slot="{errors}">
                            <v-text-field v-model="cofirm_password" label="비밀번호 확인" :error-messages="errors"
                            prepend-icon="mdi-lock-outline" clearable class="mt-4"
                            :append-icon="confirm_passwordShow ? 'mdi-eye' : 'mdi-eye-off'" :type="confirm_passwordShow ? 'text' : 'password'"
                            @click:append="confirm_passwordShow = !confirm_passwordShow"></v-text-field>
                        </ValidationProvider>
                         
                        <v-btn type="submit" block x-large rounded color="primary" class="mt-4" :disabled="invalid">회원가입</v-btn>
                  
                    </v-form>
                </ValidationObserver>
                          
                <v-alert :value='isRegisterError' type="error" class="mt-5" 
                transition="scale-transition" dense outlined>
                    {{RegisterErrorMsg}}
                </v-alert>
                 
                <div class="mt-10">
                    <router-link to="/authentication/sign-up" class="text-decoration-none mr-3">
                        회원가입
                    </router-link> | 
                    <router-link to="/authentication/sign-in" class="text-decoration-none ml-3">
                        로그인
                    </router-link>
                </div>
                    
            </v-card-text>
        </v-card>

    </v-container>
</template>

<script>
import axios from "axios"


import {extend, ValidationObserver, ValidationProvider } from "vee-validate"
import {required, email, confirmed} from "vee-validate/dist/rules"
extend("max", (val,params) =>{
  const limit = params[0]
  if (val && val.length > limit){
    return `해당 필드는 ${limit}자를 초과 할 수 없습니다.`
  }
  return true
});
extend("min", (val,params) =>{
  const limit = params[0]
  if (val && val.length < limit){
    return `해당 필드는 최소 ${limit}자 입니다.`
  }
  return true
});
extend('required', {
  ...required,
  message : '해당 필드는 필수값입니다.'
});
extend('email',{
  ...email,
  message : '입력된 정보가 이메일 형식이 아닙니다.'
});
extend('confirmed', {
    ...confirmed,
    message : '입력된 비밀번호가 일치하지 않습니다.'

});

export default {
    name : 'SignUp',
    data(){
        return {
          name : null,
          email: null,

          passwordShow: true,
          password: null,

          confirm_passwordShow: true,
          cofirm_password: '',

          isRegisterError: false,
          RegisterErrorMsg : ''
        }
    },

    components : {
      ValidationObserver,
      ValidationProvider
    },

    methods : {
        async submit(){
            // 입력조건 유효성 결과
            const result = await this.$refs.observer.validate()
            
            // 입력조건 유효성 결과 만족시
            if (result){

                // 회원가입 정보
                const info = {
                    name : this.name,
                    email : this.email,
                    password : this.password
                };

                await axios.post('/auth/signup', info)
                    .then(res => {
                        console.log(res.data.message);
                        if (res.data.isSuccess === true && res.data.code === 1000){ 
                            //중요) 요청에 성공하였습니다.
                            console.log('여기?')
                            this.$router.push({
                                name : 'sign-in'
                            });
                        }else if(res.data.isSuccess === false && res.data.code === 2005){
                            //중요) 이미 회원가입된 email 입니다.
                            this.isRegisterError = true;
                            this.RegisterErrorMsg = res.data.message;

                            setTimeout(()=>{
                                this.isRegisterError = false;
                                this.RegisterErrorMsg = '';
                            },3000);

                        }
                    })
                    .catch(err =>{
                        //중요) 서버 오류입니다.
                        //뜨기 -> alert메시지 뜨기
                        console.log(err);
                        this.isRegisterError = true;
                        this.RegisterErrorMsg = '서버와의 통신이 원할하지 않습니다.';

                        setTimeout(()=>{
                            this.isRegisterError = false;
                            this.RegisterErrorMsg = '';
                        },3000);
                    })
            }
        }
    }
}
</script>

<style>

</style>
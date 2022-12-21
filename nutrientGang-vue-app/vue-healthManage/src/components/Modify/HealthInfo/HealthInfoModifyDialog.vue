<template>
  <div class="fill-height" v-if="isError">
      <v-row justify="center">
          <v-col cols="auto" class="mt-5">
              <ServerErrorComponent/>
          </v-col>
      </v-row>
  </div>
  <div class="fill-height" v-else-if="isNotHealthInfoError">
        <v-row justify="center">
            <v-col cols="auto" class="mt-5">
                <NotHealthInfoComponent/>
            </v-col>
        </v-row>
  </div>
  <div v-else>
    <v-row align="center" justify="center">
        <v-col cols="auto">

          <!--건강정보 수정 Dialog-->
          <v-dialog v-model="modifyDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
              
              <!--건강정보 수정 Dialog 유발-->
              <template v-slot:activator="{ on, attrs }">
                <v-chip v-bind="attrs" v-on="on" label outlined color="blue" dark>
                  <v-icon left>mdi-chevron-double-right</v-icon>건강정보 수정<v-icon right>mdi-chevron-double-left</v-icon>
                </v-chip>
              </template>
              
              <!--건강정보 수정 Dialog 내용-->
              <v-card class="text-center">
                <v-toolbar dark color="blue">
                    <v-btn icon dark @click="modifyDialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>({{computedDate}}) 건강정보 수정</v-toolbar-title>
                </v-toolbar>
                
                <v-card-text class="justify-center">
                    <!--1. 단계 Tab 선택-->
                    <v-tabs v-model="modifyTabModel" background-color="transparent" color="blue" grow>
                      <v-tab v-for="tabItem in modifyTabItems" :key="tabItem.tabIdx">
                        {{ tabItem.tabName }}
                      </v-tab>
                    </v-tabs>

                    <!--1. 단계 Tab 선택시 내용-->
                    <v-tabs-items v-model="modifyTabModel" class="mt-5">
                      <v-tab-item v-for="tabItem in modifyTabItems" :key="tabItem.tabIdx">
                        <div v-if="tabItem.tabIdx === 0">
                            <HealthInfoFirstDialog/>
                        </div>
                        <div v-else-if="tabItem.tabIdx === 1">
                            <HealthInfoSecondDialog/>
                        </div>
                      </v-tab-item>
                    </v-tabs-items>

                    <!--2. 수정-->
                    <v-row justify="center" align="center" class="mt-1">
                        <v-col cols="auto">
                            <v-btn color="blue darken-1" outlined x-large rounded
                            @click="modify">수정</v-btn>
                        </v-col>
                    </v-row>
                    
                    <!--3. 수정 클릭시 Dialog-->
                    <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="submitDialog">
                        <!--Dialog 내용-->
                        <v-card>
                            <v-card-title class="justify-center error white--text">
                                <v-icon left>mdi-alert-decagram</v-icon>주의<v-icon right>mdi-alert-decagram</v-icon>
                            </v-card-title>
                            <v-card-text class="text-center">
                                <h3 class="pa-12" v-html="printNewLine"></h3>
                            </v-card-text>
                            <v-card-actions class="justify-center">
                                <v-btn text @click="closeSubmitDialog()">확인</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-text>
              </v-card>
          </v-dialog>
        </v-col>
      </v-row>
  </div>
</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
const NotHealthInfoComponent = () => import("@/components/ErrorComponent/NotHealthInfoComponent.vue");

const HealthInfoFirstDialog = () => import("@/components/Modify/HealthInfo/HealthInfoFirstDialog");
const HealthInfoSecondDialog = () => import("@/components/Modify/HealthInfo/HealthInfoSecondDialog");

import Modify from '@/api/Modify';
export default {
    name : 'HealthInfoModifyDialog',
    components : {
        "ServerErrorComponent" : ServerErrorComponent,
        "NotHealthInfoComponent" : NotHealthInfoComponent,
        "HealthInfoFirstDialog" : HealthInfoFirstDialog,
        "HealthInfoSecondDialog" : HealthInfoSecondDialog
    },
    props : {
        "date" : String
    },
    
    computed : {
        //날짜
        computedDate(){
            return this.formatDate(this.date);
        },

        //submitDialog 개행
        printNewLine(){
            return this.submitErrMsg.replace("\n", "<br />")
        }
    },

    watch : {
        date : {
            immediate : true,
            handler(date){
                
                //날짜별 회원정보 가져오기
                //중요) 필요한 데이터 요청
                Modify.getHealthInfo(date)
                .then((res) =>{
                    this.isError = false;
                    this.isNotHealthInfoError = false;
                    console.log(res.data.message);
                    if(res.data.isSuccess === true && res.data.code === 1000){
                        //중요) 요청에 성공하였습니다.

                        //성별
                        switch(res.data.result.gender){
                            case 'MALE':
                                this.$store.state.modifyInfoGender = 0;
                                break;
                            case 'FEMALE':
                                this.$store.state.modifyInfoGender = 1;
                                break;
                        }

                        //목표
                        switch(res.data.result.target){
                            case 'LOSS_WEIGHT':
                                this.$store.state.modifyInfoTarget = 0;
                                break;
                            case 'GAIN_MUSCLE':
                                this.$store.state.modifyInfoTarget = 1;
                                break;
                            case 'MAINTAIN_WEIGHT':
                                this.$store.state.modifyInfoTarget = 2;
                                break;
                        }

                        //활동량
                        switch(res.data.result.activity){
                            case 'SOFT_ACTIVITY':
                                this.$store.state.modifyInfoActivity = 0;
                                break;
                            case 'NORMAL_ACTIVITY':
                                this.$store.state.modifyInfoActivity = 1;
                                break;
                            case 'HARD_ACTIVITY':
                                this.$store.state.modifyInfoActivity = 2;
                                break;
                        }

                        //키, 몸무게
                        this.$store.state.modifyInfoHeight = res.data.result.height;
                        this.$store.state.modifyInfoWeight = res.data.result.weight;
                        
                    }else if (res.data.isSuccess === false && res.data.code === "NO_AUTHORIZATION"){
                        //중요) 인증 정보 없으니까 로그아웃 후 리다이렉션
                        //돌리기 -> 하지만 이미 레이아웃이 그려지기 전에 이미 재발행 받아서 로그인 페이지로 돌려지지 않음
                        this.$store.dispatch('logout')
                        .then(() => {
                            this.$router.push({
                                name : "sign-in",
                            });
                        });
                    }else{
                        //중요) 건강정보를 찾을 수 없습니다.
                        this.isNotHealthInfoError = true;

                    }
                })
                .catch((err)=>{
                    //중요) 서버 오류입니다.
                    //뜨기 -> alert메시지 뜨기
                    console.log(err);
                    this.isNotHealthInfoError = false;

                    this.isError = true;
                });
            }
        }
    },

    data(){
        return {
            //에러 판단
            isError : false,
            isNotHealthInfoError : false,

            //건강정보 수정 Dialog, 건강정보 수정 1단계, 2단계 Tab 관련
            modifyDialog : false,
            modifyTabModel: 0,
            modifyTabItems : [
              {tabIdx: 0, tabName : '1단계'},
              {tabIdx: 1, tabName : '2단계'},
            ],

            //수정 버튼 클릭시 Dialog 관련 
            submitDialog : false,
            submitErrMsg : "",
        }
    },

    methods : {
        //computed 통해 날짜 할당시 format
        formatDate(date){
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${year.substring(2,4)}/${month}/${day}`
        },

        modify(){

            const putObj = {
                height : this.$store.state.modifyInfoHeight,
                weight : this.$store.state.modifyInfoWeight,
                gender : this.$store.state.modifyInfoGender,
                activity : this.$store.state.modifyInfoActivity,
                target : this.$store.state.modifyInfoTarget,
                date : this.date
            }

            Modify.modifyHealthInfo(putObj)
            .then((res) => {
                    this.modifyDialog = false;

                    console.log(res.data.message);
                    if(res.data.isSuccess === true && res.data.code === 1000){
                        //중요) 요청에 성공하였습니다.
                        this.$store.commit('clearInfoModify');
                        this.$router.push({
                            name : "Diary",
                        });
    
                    }else{
                        this.submitDialog = true;
                        this.submitErrMsg = "서버 오류로 수정 불가"
                    }
                })
                .catch((err) => {
                    this.modifyDialog = false;

                    console.log(err)
                    this.submitDialog = true;
                    this.submitErrMsg = "서버 오류로 수정 불가"
                });
        },

        closeSubmitDialog(){
            this.submitDialog = false;
            this.submitErrMsg = "";
        },
    }

}
</script>

<style>

</style>
<template>
  <v-container fluid>
      
      <div class="text-center mb-10">
            <h1 class="text--primary font-weight-black">식사 수정</h1>
      </div>

      <!--1. 달력-->
      <div class="mb-3">
          <v-row>
            <v-col cols="auto">
              <!--Dialog-->
              <v-dialog v-model="dateDialog">

                  <!--Dialog 유발-->
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn color="blue" dark v-bind="attrs" v-on="on">
                        {{date}}<v-icon right>mdi-calendar</v-icon>
                      </v-btn>
                  </template>

                  <!--Dialog 내용-->
                  <v-date-picker v-model="date"
                  color="blue" header-color="blue">
                  </v-date-picker>

              </v-dialog>

              <!--Dialog 왼쪽 버튼-->
              <v-btn @click="minusDate" class="ml-3" color="primary" icon>
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              
              <!--Dialog 오른쪽 버튼-->
              <v-btn @click="plusDate" color="primary" icon :disabled="computedDisabled">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
      </div>

      <v-divider class="mb-5"></v-divider>

      <!--2. 등록 날짜 표시-->
      <div class="text-center mb-10">
          <h2 class="blue--text"><strong class="black--text">등록 날짜:</strong> {{this.date}}</h2>
      </div>

      <!--3. 날짜별 식사기록-->
      <div class="mb-3">
        <DiaryMeal :date="date"/>
      </div>
  </v-container>
</template>

<script>
const DiaryMeal = () => import("@/components/Diary/DiaryMeal.vue");
export default {
  name : "MealModify",
  components : {
      "DiaryMeal" : DiaryMeal,
  },

  data(){
    return {
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateDialog: false,
    }
  },

  computed : {
      //달력 다음날 이동 버튼 가능여부 
      computedDisabled(){

        const today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        if (this.date === today){
          return true
        }else{
          return false
        }
      }
  },

  methods : {

      //event 통해 날짜 할당시 format
      leftPad(value) {
          if (value >= 10) {
              return value;
          }

          return `0${value}`;
      },

      //event 통해 날짜 할당시 format
      toStringByFormatting(source, delimiter = '-') {
          const year = source.getFullYear();
          const month = this.leftPad(source.getMonth() + 1);
          const day = this.leftPad(source.getDate());

          return [year, month, day].join(delimiter);
      },

      minusDate(){
          let temp_date = new Date(this.date);
          temp_date.setDate(temp_date.getDate() - 1);

          this.date = this.toStringByFormatting(temp_date);

      },

      plusDate(){
          let temp_date = new Date(this.date);
          temp_date.setDate(temp_date.getDate() + 1);

          this.date = this.toStringByFormatting(temp_date);
      },
  }
}
</script>

<style>

</style>
<template>
  <div>
    <div class="mb-3">
      <v-row>
        <!--달력-->
        <v-col cols="auto">
          <!--Dialog-->
          <v-dialog v-model="dateDialog">
                
              <!--Dialog 유발-->
              <template v-slot:activator="{ on, attrs }">
                  <v-btn color="blue" dark v-bind="attrs" v-on="on">
                    {{computedDate}}
                  </v-btn>
              </template>
              
              <!--Dialog 내용-->     
              <v-date-picker v-model="dates" range readonly
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
    
    <v-divider></v-divider>
    
    <div class="mb-3">
      <ReportMealPieChart :pieChartData="updatePieChartData" :pieChartOption="updatePieChartOption"
      :isPieChartError="isPieChartError" :isPieChatNotMealError="isPieChatNotMealError"/>
    </div>

    <v-divider></v-divider>

    <div class="mb-3">
      <ReportMealCheck :dates="dates"/>
    </div>


  </div>
</template>

<script>
import Report from '@/api/Report';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale} from 'chart.js'
import chartjsPluginDoughnutlabel from "chartjs-plugin-doughnutlabel-rebourne";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, chartjsPluginDoughnutlabel, ChartDataLabels);

const ReportMealPieChart = () => import("@/components/Report/ReportMeal/ReportMealPieChart.vue");
const ReportMealCheck = () => import("@/components/Report/ReportMeal/ReportMealCheck.vue");

export default {
  name : "ReportMeal",
  components : {
    "ReportMealPieChart" : ReportMealPieChart,
    "ReportMealCheck" : ReportMealCheck,
  },

  mounted(){

      //'일주일전' ~ '오늘' 불러오기 (String)
      let now = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000);
      const beforeday = new Date(now.setDate(now.getDate() - 6)).toISOString().substr(0,10);
      const today = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().substr(0,10);

      this.dates = [beforeday, today];
  },

  watch : {
    dates : {
      immediate : true,
      handler(dates){

        const begin = dates[0];
        const end = dates[1];

        //파이차트
        //중요) 필요한 데이터 요청
        Report.getMealGraph(begin,end)
        .then((res)=>{
            this.isPieChartError = false;
            this.isPieChatNotMealError = false;
            console.log(res.data.message);
            if(res.data.isSuccess === true && res.data.code === 1000){
                //중요) 요청에 성공하였습니다.
                const breakfastPortion = (res.data.result.breakfast * 100).toFixed(2);
                const lunchPortion = (res.data.result.lunch * 100).toFixed(2);
                const dinnerPortion = (res.data.result.dinner * 100).toFixed(2);
                
                this.fillPieChartData(breakfastPortion, lunchPortion, dinnerPortion);
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
                //중요) 식사기록을 찾을 수 없습니다.
                this.isPieChatNotMealError = true;
            }
        })
        .catch((err)=>{
            //중요) 서버 오류입니다.
            //뜨기 -> alert메시지 뜨기
            console.log(err);
            this.isPieChatNotMealError = false;

            this.isPieChartError = true;
        });
      }
    }
  },

  data(){
    return {
        dates: [],

        isPieChartError : false,
        isPieChatNotMealError : false,
        pieChartData : [0,0,0],

        dateDialog: false,
    }
  },

  computed : {
    
    updatePieChartData(){
      let chartData = {
        labels: ['아침', '점심', '저녁'],
        datasets: [
        {
            backgroundColor: ['#0095FF', '#80CAFF', '#BFE4FF'],
            data: this.pieChartData,
            
            hoverBackgroundColor: ['#0095FF', '#80CAFF', '#BFE4FF'],
            //hoverBorderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'], 
            hoverBorderWidth : 7,
            cutout : '50%',
        
            datalabels: {
                display : true,
                font : {
                    size: 17,
                    family : 'Jua',
                },
                formatter: (value, context) => {
                    const labelArray = ['아침', '점심', '저녁'];
                    const textlabel = labelArray[context.dataIndex];
                    const textvalue = value;
                    const text = textlabel + ": " + textvalue + "%"
                    return text ; 
                },
            },
        }]
      }

      return chartData;
    },

    updatePieChartOption(){
      let chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 5000,
        },
                
        //그래프 특징
        plugins: {

            //그래프 종류 표시
            legend: {              
                display: true,
                align : 'end',
                fullSize : false,
                labels :{
                    boxWidth : 10,
                    font : {
                      family : 'Jua',
                      size : 13,
                    },
                },

                onClick: () => {
                  //pass
                },
            },

            //그래프 점 표시
            tooltip: {
                callbacks : {
                    //매개변수 -> return 변화 매개변수 
                    label : (tooltipItem) => {
                        const text = tooltipItem.label + ': ' + tooltipItem.formattedValue + '%';
                        return text;
                    }
                },
                boxWidth: 10,
                bodyFont: {
                    size: 14,
                    family : 'Jua'
                }
            },

            //그래프 제목 표시
            title : {
                display : true,
                font : {
                    family : 'Jua',
                    size : 20
                },
                text : '삼시세끼 비율(%)'
            },

            //그래프 안 제목 표시
            doughnutlabel: {
                labels: [	
                {
                    text: '세끼 비율',
                    font: {
                        family : 'Jua',
                        size: '30',
                        weight: 'bold',
                    }
                },
                {
                    text: '아침, 점심, 저녁',
                    font: {
                        family : 'Jua',
                        size: '20',
                        weight: 'bold',
                    }
                }],
            },
        },
      }

      return chartOptions;
    },

    //달력 버튼 내용 표시
    computedDate(){

      const beforday = this.formatDate(this.dates[0]);
      const today = this.formatDate(this.dates[1])

      return beforday + '~' + today;
    },

    //달력 다음날 이동 버튼 가능여부 
    computedDisabled(){

      const today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      if (this.dates[1] === today){
        return true
      }else{
        return false
      }
    }

  },

  methods : {

      fillPieChartData(breakfastPortion, lunchPortion, dinnerPortion){
        this.pieChartData = [breakfastPortion, lunchPortion, dinnerPortion];
      },

      fillBarChartLabels(portionLabels){
        this.barChartLabel = portionLabels;
      },

      //computed 통해 날짜 할당시 format
      formatDate(date){
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${year.substring(2,4)}/${month}/${day}`
      },

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
          let start_date = new Date(this.dates[0]);
          let end_date = new Date(this.dates[1]);

          start_date.setDate(start_date.getDate() - 1);
          end_date.setDate(end_date.getDate() - 1);

          //(String)
          this.dates =[this.toStringByFormatting(start_date),this.toStringByFormatting(end_date)];

      },

      plusDate(){
          let start_date = new Date(this.dates[0]);
          let end_date = new Date(this.dates[1]);

          start_date.setDate(start_date.getDate() + 1);
          end_date.setDate(end_date.getDate() + 1);

          //(String)
          this.dates =[this.toStringByFormatting(start_date), this.toStringByFormatting(end_date)];
      },
  }
}
</script>

<style>

</style>
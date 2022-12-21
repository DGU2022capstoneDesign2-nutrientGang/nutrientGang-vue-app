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
    
    <!--날짜별 영양소 파이 차트-->
    <div class="mb-3">
      <ReportBalancePieChart :pieChartData="updatePieChartData" :pieChartOption="updatePieChartOption"
      :isPieChartError="isPieChartError" :isPieChatNotHealthError="isPieChatNotHealthError"/>  
    </div>

    <!--날짜별 영양소-->
    <div class="mb-3">
      <ReportBalanceNutrient :dates="dates"/>
    </div>

    <v-divider></v-divider>

    <!--날짜별 영양소 막대 차트-->
    <div class="mb-3">
      <ReportBalanceBarChart :barChartData="updateBarChartData" :barChartOption="updateBarChartOption"
      :isBarChartError="isBarChartError"/>
    </div>

  </div>
</template>

<script>
import Report from '@/api/Report';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement, LinearScale} from 'chart.js'
import chartjsPluginDoughnutlabel from "chartjs-plugin-doughnutlabel-rebourne";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, ArcElement, CategoryScale, chartjsPluginDoughnutlabel, ChartDataLabels)

const ReportBalancePieChart = () => import("@/components/Report/ReportBalance/ReportBalancePieChart.vue");
const ReportBalanceNutrient = () => import("@/components/Report/ReportBalance/ReportBalanceNutrient.vue");
const ReportBalanceBarChart = () => import("@/components/Report/ReportBalance/ReportBalanceBarChart.vue");

export default {
  name : "ReportBalance",
  components : {
    "ReportBalancePieChart" : ReportBalancePieChart,
    "ReportBalanceNutrient" : ReportBalanceNutrient,
    "ReportBalanceBarChart" : ReportBalanceBarChart,
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
        Report.getBalancePortion(begin, end)
        .then((res) =>{
            this.isPieChartError = false;
            this.isPieChatNotHealthError = false;
            console.log(res.data.message);
            if(res.data.isSuccess === true && res.data.code === 1000){
                //중요) 요청에 성공하였습니다.
                const carboPortion = (res.data.result.carbohydratePortion * 100).toFixed(2);
                const proteinPortion = (res.data.result.proteinPortion * 100).toFixed(2);
                const fatPortion = (res.data.result.fatPortion * 100).toFixed(2);
                
                this.fillPieChartData(carboPortion, proteinPortion, fatPortion);
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
                this.isPieChatNotHealthError = true;
            }
        })
        .catch((err)=>{
            //중요) 서버 오류입니다.
            //뜨기 -> alert메시지 뜨기
            console.log(err);
            this.isPieChatNotHealthError = false;

            this.isPieChartError = true;
        });

        //바 차트
        //중요) 필요한 데이터 요청
        Report.getBalanceGraph(begin,end)
        .then((res) =>{
            this.isBarChartError = false;
            console.log(res.data.message);
            if(res.data.isSuccess === true && res.data.code === 1000){
                //중요) 요청에 성공하였습니다.
                const weekPortionList = res.data.result.weekPortionList;
                
                let portionLabels = [];
                let portionCarboData = [];
                let portionProteinData = [];
                let portionFatData = [];
                for (const weekPortion of weekPortionList){
                  
                  let date = weekPortion.date;
                  let dateArray = date.split('-');
                  const finalDate = dateArray[1] + '.' + dateArray[2];
                  portionLabels.push(finalDate);

                  let carbohydratePortion = weekPortion.carbohydratePortion;
                  const finalCarbohydratePortion = (carbohydratePortion * 100).toFixed(2);

                  let proteinPortion = weekPortion.proteinPortion;
                  const finalProteinPortion = (proteinPortion * 100).toFixed(2);

                  let fatPortion = weekPortion.fatPortion;
                  const finalFatPortion = (fatPortion * 100).toFixed(2);

                  portionCarboData.push(finalCarbohydratePortion);
                  portionProteinData.push(finalProteinPortion);
                  portionFatData.push(finalFatPortion);
                }

                this.fillBarChartLabels(portionLabels);
                this.fillBarChartFatData(portionFatData);
                this.fillBarChartProteinData(portionProteinData);
                this.fillBarChartCarboData(portionCarboData);

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
                const begin = this.dates[0];
                let dateLabels = [];
                for (let i=0; i<7; i++){
                  let tempDate = new Date(begin);
                  tempDate.setDate(tempDate.getDate()+ i);

                  let strDate = tempDate.toISOString().substring(0,10);
                  let strDateArray = strDate.split('-');
                  const finalDate = strDateArray[1] + '.' + strDateArray[2];

                  dateLabels.push(finalDate);
                  
                }

                this.fillBarChartLabels(dateLabels);
                this.fillBarChartFatData([0,0,0,0,0,0,0]);
                this.fillBarChartProteinData([0,0,0,0,0,0,0]);
                this.fillBarChartCarboData([0,0,0,0,0,0,0]);
            }
        })
        .catch((err)=>{
            //중요) 서버 오류입니다.
            //뜨기 -> alert메시지 뜨기
            console.log(err);
            this.isBarChartError = true;
        })
      }
    }
  },

  data(){
    return {
        dates: [],

        isPieChartError : false,
        isPieChatNotHealthError : false,
        pieChartData : [0,0,0],

        isBarChartError : false,
        barChartLabel : ['null','null','null','null','null','null','null'],
        barChartCarboData : [0,0,0,0,0,0,0],
        barChartProteinData : [0,0,0,0,0,0,0],
        barChartFatData : [0,0,0,0,0,0,0],

        dateDialog: false,
    }
  },

  computed : {

    updatePieChartData(){
      let chartData = {
        labels: ['탄수화물', '단백질', '지방'],
        datasets: [
            {
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
                data: this.pieChartData,
                
                hoverBackgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
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
                        const labelArray = ['탄수화물', '단백질', '지방'];
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
                    text : '일주일 총 섭취 영양소 비율(%)'
                },

                //그래프 안 제목 표시
                doughnutlabel: {
                    labels: [	
                    {
                        text: '섭취 비율',
                        font: {
                            family : 'Jua',
                            size: '30',
                            weight: 'bold',
                        }
                    },
                    {
                        text: '3대 영양소',
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

    updateBarChartData(){
      let chartData = {
        
        labels: this.barChartLabel,
        datasets: [
          {
            label: '지방',
            stack: 'combined',
            type : 'bar',
            backgroundColor: 'rgb(255, 205, 86)',
            data: this.barChartFatData,
            datalabels: {
                display : false,
            },
          },
          {
            label: '단백질',
            stack: 'combined',
            type : 'bar',
            backgroundColor: 'rgb(54, 162, 235)',
            data: this.barChartProteinData,
            datalabels: {
                display : false,
            },
          },
          {
            label: '탄수화물',
            stack: 'combined',
            type : 'bar',
            backgroundColor: 'rgb(255, 99, 132)',
            data: this.barChartCarboData,
            datalabels: {
                display : false,
            },
          }]
      }

      return chartData;
    },

    updateBarChartOption(){

      let chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 5000,
        },
        scales: {
            x: {
              stacked: true,
              display: true,

              //x축 label 설정
              ticks: {
                padding: 10,
                font : {
                  family : 'Jua',
                  size : 10,
                },
              },

              grid: {
                display : true,         //이건 default
                drawOnChartArea : true, //이건 default
                drawBorder : true,      
                drawTicks : false,      
              },

            },
            y: {
              stacked: true,
              display : true,
              
              //y축 label 설정
              ticks: {
                display : true,
                stepSize : 5, 
                font : {
                  family : 'Jua',
                  size : 10,
                },

                callback : (value) =>{
                  if(value === 25){
                    return '25%'
                  }else if(value === 50){
                    return '50%'
                  }
                }
              },

              grid : {
                display : true,         //이건 default
                drawOnChartArea : true, //이건 default
                drawBorder : true,      
                drawTicks : true,      
                color: function(context) {
                
                  if (context.tick.value === 25) {
                    return 'rgb(255, 205, 86)';
                  }else if(context.tick.value === 50) {
                    return 'rgb(255, 99, 132)';
                  }
                },
              }

            }
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
                        const text = tooltipItem.dataset.label + '(' + tooltipItem.formattedValue + '%)';
                        return text;
                    }
                },
                boxWidth: 10,
                titleFont: {
                    size: 14,
                    family : 'Jua'
                },
                bodyFont : {
                    size: 13,
                    family : 'Jua'
                },
            },

            //그래프 제목 표시
            title : {
                display : true,
                font : {
                    family : 'Jua',
                    size : 20
                },
                text : '일주일 간 섭취 비율(%)'
            },
        },


      };

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

      const today = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().substr(0,10);
      if (this.dates[1] === today){
        return true
      }else{
        return false
      }
    }

  },

  methods : {

      fillPieChartData(carboPortion, proteinPortion, fatPortion){
        this.pieChartData = [carboPortion, proteinPortion, fatPortion];
      },

      fillBarChartLabels(portionLabels){
        this.barChartLabel = portionLabels;
      },

      fillBarChartCarboData(portionCarboData){
        this.barChartCarboData = portionCarboData;
      },

      fillBarChartProteinData(portionProteinData){
        this.barChartProteinData = portionProteinData;
      },

      fillBarChartFatData(portionFatData){
        this.barChartFatData = portionFatData;
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
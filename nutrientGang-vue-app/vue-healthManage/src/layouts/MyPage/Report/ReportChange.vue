<template>
  <div>
    <div class="mb-3">
        <v-chip-group mandatory active-class="primary--text" v-model="selectedTag">
          <v-chip v-for="tag in tags" :key="tag">
            {{ tag }}
          </v-chip>
        </v-chip-group>
    </div>

    <v-divider></v-divider>

    <!--칼로리 chip-->
    <div v-if="selectedTag === 0">
      <ReportChangeKcal
      :isKcalError="isKcalError"
      :maxKcal="maxKcal"
      :minKcal="minKcal"
      :dateKcal="dateKcal"
      :todayKcal="todayKcal"
      :recommendKcal="recommendKcal"
      :lineChartKcalData="updateLineChartKcalData"
      :lineChartKcalOption="updateLineChartKcalOption"/>
    </div>

    <!--몸무게 chip-->
    <div v-else>
      <ReportChangeWeight
      :isKgError="isKcalError"
      :maxKg="maxKg"
      :minKg="minKg"
      :dateKg="dateKg"
      :todayKg="todayKg"
      :lineChartKgData="updateLineChartKgData"
      :lineChartKgOption="updateLineChartKgOption"/>
    </div>

  </div>
</template>

<script>
import Report from '@/api/Report';
const ReportChangeKcal = () => import("@/components/Report/ReportChange/ReportChangeKcal.vue");
const ReportChangeWeight = () => import("@/components/Report/ReportChange/ReportChangeWeight.vue");

export default {
    
    name : "ReportChange",

    components : {
      "ReportChangeKcal" : ReportChangeKcal,
      "ReportChangeWeight" : ReportChangeWeight,
    },

    mounted(){
      
      Report.getChangeKcal()
      .then((res) =>{
          this.isKcalError = false;
          console.log(res.data.message);
          if(res.data.isSuccess === true && res.data.code === 1000){
              //중요) 요청에 성공하였습니다.
              this.maxKcal = res.data.result.maxCalorie;
              this.minKcal = res.data.result.minCalorie;
              this.recommendKcal = res.data.result.needCalorie;

              const calorieInfoList = res.data.result.calorieInfoList;
              const reverseList = [...calorieInfoList].reverse();

              this.dateKcal = res.data.result.calorieInfoList[0].calorie;
              this.todayKcal = res.data.result.todayCalorie;

              this.kcalLabels = [];
              this.kcalData = [];
              for (const calorieInfo of reverseList){
                this.kcalLabels.push(calorieInfo.date);
                this.kcalData.push(calorieInfo.calorie)
              }

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
            this.maxKcal = 0;
            this.minKcal = 0;
            this.recommendKcal = 0;

            this.dateKcal = 0;
            this.todayKcal = 0;

            this.kcalLabels = [];
            this.kcalData = [];
          }
      })
      .catch((err)=>{
          //중요) 서버 오류입니다.
          //뜨기 -> alert메시지 뜨기
          console.log(err);
          this.isKcalError = true;
      });

      Report.getChangeWeight()
      .then((res) =>{
          this.isKgError = false;
          console.log(res.data.message);
          if(res.data.isSuccess === true && res.data.code === 1000){
              //중요) 요청에 성공하였습니다.
              this.maxKg = res.data.result.maxWeight;
              this.minKg = res.data.result.minWeight;

              const weightInfoList = res.data.result.weightInfoList;
              
              this.dateKg = res.data.result.weightInfoList[0].weight;
              this.todayKg = res.data.result.todayWeight; //이거필요

              this.kgLabels = [];
              this.kgData = [];
              for (const weightInfo of weightInfoList){
                this.kgLabels.push(weightInfo.date);
                this.kgData.push(weightInfo.weight)
              }

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
            this.maxKg = 0;
            this.minKg = 0;

            this.dateKg = 0;
            this.todayKg = 0;

            this.kgLabels = [];
            this.kgData = [];
          }
      })
      .catch((err)=>{
          //중요) 서버 오류입니다.
          //뜨기 -> alert메시지 뜨기
          console.log(err);
          this.isKgError = true;
      });
    },

    data(){
        return {

            isKcalError : false,
            maxKcal : null,
            minKcal : null,
            recommendKcal : null,
            dateKcal : null,
            todayKcal: null,
            kcalLabels : [],
            kcalData : null,

            isKgError : false,
            maxKg : null,
            minKg : null,
            dateKg : null,
            todayKg : null,
            kgLabels : [],
            kgData : null,

            tags: ['칼로리', '몸무게'],
            selectedTag : null
        }
    },

    computed : {
      updateLineChartKcalData(){
        let chartData = {
          labels: this.kcalLabels,
          datasets: [     
            {
              label: '칼로리 변화',

              backgroundColor: '#1870d5',    //점 색깔
              pointBorderColor: '#1870d5',   //점 주위 색깔
              borderColor: '#1870d5',        //그래프 색깔
              borderWidth: 2,             //그래프 두께
              
              tension: 0.5,               //휘어짐 정도

              data: this.kcalData,

              datalabels: {
                display : true,
                formatter: function() {
                  return '';
                },

                listeners: {
                  click: (context) => {
                    this.dateKcal = this.kcalData[context.dataIndex];
                    //this.$emit('show-kcalData', this.kcalData[context.dataIndex]);
                  }
                },
              }
            },]
        }

        return chartData;
      },

      updateLineChartKcalOption(){
        let chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 5000,
          },
          interaction : {
            mode : 'index',
            intersect : false
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
                    label : () => {
                      return '';
                    }
                  },
                  boxWidth: 10,
                  titleFont: {
                    size: 13,
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
                  text : '섭취 칼로리(점 클릭)'
              },
          },
          
          //x축, y축
          scales: {
            x: {
              display: false,
              ticks: {
                padding: 5
              },
              grid: {
                display: false
              },
            },

            y: {
              display : true,
              min : 0,

              //y축 label 설정
              ticks: {
                display : true,
                stepSize : 5,
                font : {
                  family : 'Jua',
                  size : 10,
                },

                callback : (value) => {
                  const diff = this.recommendKcal - value;
                  if(value % 500 === 0){
                    return value
                  }else if( 0 <= diff && diff <= 5){
                    return '권장 칼로리'
                  }
                }
              },

              grid : {
                display : true,         //이건 default
                drawOnChartArea : true, //이건 default
                drawBorder : false,      
                drawTicks : true,      
                color: function(context) {
                  if(context.tick.label === '권장 칼로리'){
                    return 'black'
                  }else{
                    return 'rgba(0, 0, 0, 0.1)'
                  }
                },
                borderDash : [5,5],
                lineWidth : 1.5
              }

            }
          },

        }

        return chartOptions
      },

      updateLineChartKgData(){
        let chartData = {
          labels: this.kgLabels,
          datasets: [     
            {
              label: '몸무게 변화',

              backgroundColor: '#1870d5',    //점 색깔
              pointBorderColor: '#1870d5',   //점 주위 색깔
              borderColor: '#1870d5',        //그래프 색깔
              borderWidth: 2,             //그래프 두께
              
              tension: 0.5,               //휘어짐 정도

              data: this.kgData,

              datalabels: {
                display : true,
                formatter: function() {
                  return '';
                },

                listeners: {
                  click: (context) => {
                    this.dateKg = this.kgData[context.dataIndex];
                  }
                }
              }
  
            },
          ]
        }

        return chartData;
      },

      updateLineChartKgOption(){
        let chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 5000,
          },
          interaction : {
            mode : 'index',
            intersect : false
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
                  label : () => {
                    return '';
                  }
                },
                boxWidth: 10,
                titleFont: {
                  size: 13,
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
                text : '몸무게(점 클릭)'
            },
          },
        
          //x축, y축
          scales: {
              x: {
                display: false,
                ticks: {
                  padding: 5
                },
                grid: {
                  display: false
                },
              },

              y: {
                display : true,
                min : 0,

                //y축 label 설정
                ticks: {
                  display : true,
                  font : {
                    family : 'Jua',
                    size : 10,
                  },
                },

                grid : {
                  display : true,         //이건 default
                  drawOnChartArea : true, //이건 default
                  drawBorder : false,      
                  drawTicks : true,      
                  color: function(context) {
                    if(context.tick.label === '권장 몸무게'){
                      return 'black'
                    }else{
                      return 'rgba(0, 0, 0, 0.1)'
                    }
                  },
                  borderDash : [5,5],
                  lineWidth : 1.5
                }
              }
          },
        } 

        return chartOptions;
      }
    },
}
</script>

<style>

</style>
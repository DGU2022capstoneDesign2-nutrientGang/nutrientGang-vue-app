<template>

  <div class="fill-height" v-if="isKcalError">
      <v-row justify="center">
          <v-col cols="auto">
              <ServerErrorComponent/>
          </v-col>
      </v-row>
  </div>
  <div v-else>  
    <!--칼로리 정보-->
    <v-row class="mt-3">

      <!--날짜별 섭취 칼로리, (오늘날짜 섭취-날짜별 섭취칼로리)-->
      <v-col cols="auto">
        <h2>{{dateKcal}}<span class="grey--text font-weight-thin">kcal</span></h2>
        <div :class="KcalColor">
          <v-icon :color="KcalIconColor">{{KcalIcon}}</v-icon>{{differKcal}} <span class="grey--text">오늘보다</span>
        </div>
      </v-col>

      <v-spacer></v-spacer>

      <!--섭취 최대 칼로리, 섭취 최소 칼로리-->
      <v-col cols="auto">
        <div>
          <div class="text-right">
            <strong class="red--text">{{maxKcal}}kcal</strong> <span class="grey--text">MAX</span> 
          </div>
          <div class="text-right">
            <strong class="blue--text">{{minKcal}}kcal</strong> <span class="grey--text">MIN</span> 
          </div>
        </div>
      </v-col>
    </v-row>

    <!--칼로리 그래프-->
    <div class="py-3 px-1 border">
      <LineChartGenerator :chart-options="lineChartKcalOption" :chart-data="lineChartKcalData"/>
    </div>
  </div>
</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'
import {Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement, ChartDataLabels);

export default {
  name : 'ReportChangeKcal',
  components: {
    LineChartGenerator,
    "ServerErrorComponent" : ServerErrorComponent
  },

  props : {
    isKcalError : { type : Boolean},
    maxKcal : {type : Number},
    minKcal : {type : Number},
    recommendKcal : {type : Number},
    dateKcal : {type : Number},
    todayKcal : {type: Number},
    lineChartKcalData : {type: Object},
    lineChartKcalOption : {type: Object}
  },

  computed : {

    KcalIcon(){
      if (this.dateKcal - this.todayKcal > 0) {
        //오늘보다 초과
        return 'mdi-menu-up'

      }else if (this.dateKcal - this.todayKcal === 0){
        //오늘보다 유지
        return 'mdi-minus'
      }else{
        //오늘보다 감소
        return 'mdi-menu-down'
      }
    },

    KcalIconColor(){
      if (this.dateKcal - this.todayKcal > 0) {
        //오늘보다 초과
        return 'red'

      }else if (this.dateKcal - this.todayKcal === 0){
        //오늘보다 유지
        return 'grey'
      }else{
        //오늘보다 감소
        return 'blue'
      }
    },

    KcalColor(){
      if (this.dateKcal - this.todayKcal > 0) {
        //오늘보다 초과
        return 'red--text'

      }else if (this.dateKcal - this.todayKcal === 0){
        //오늘보다 유지
        return 'grey--text' 
      }else{
        //오늘보다 감소
        return 'blue--text' 
      }
    },

    differKcal(){
      return Math.abs(this.todayKcal - this.dateKcal);
    }
  }
}
</script>

<style  scoped>
.border {
  border: 3px solid ;
}
</style>
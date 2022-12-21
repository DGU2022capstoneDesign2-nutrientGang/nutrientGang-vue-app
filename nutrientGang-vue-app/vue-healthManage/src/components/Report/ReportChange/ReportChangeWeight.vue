<template>
  
  <div class="fill-height" v-if="isKgError">
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
        <h2>{{dateKg}}<span class="grey--text font-weight-thin">kg</span></h2>
        <div :class="KgColor">
          <v-icon :color="KgIconColor">{{KgIcon}}</v-icon>{{differKg}} <span class="grey--text">오늘보다</span>
        </div>
      </v-col>

      <v-spacer></v-spacer>

      <!--섭취 최대 칼로리, 섭취 최소 칼로리-->
      <v-col cols="auto">
        <div>
          <div class="text-right">
            <strong class="red--text">{{maxKg}}kg</strong> <span class="grey--text">MAX</span> 
          </div>
          <div class="text-right">
            <strong class="blue--text">{{minKg}}kg</strong> <span class="grey--text">MIN</span> 
          </div>
        </div>
      </v-col>
    </v-row>

    <!--칼로리 그래프-->
    <div class="pa-3 border">
      <LineChartGenerator :chart-options="lineChartKgOption" :chart-data="lineChartKgData"/>
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
  name : "ReportChangeWeight",
  components: {
    LineChartGenerator,
    "ServerErrorComponent" : ServerErrorComponent
  },
  props: {
    isKgError : { type : Boolean},
    maxKg : {type : Number},
    minKg : {type : Number},
    dateKg : {type : Number},
    todayKg : {type : Number},
    lineChartKgData : {type: Object},
    lineChartKgOption : {type: Object}
  },

  computed : {

    KgIcon(){
      if (this.dateKg - this.todayKg > 0) {
        //오늘보다 초과
        return 'mdi-menu-up'

      }else if (this.dateKg - this.todayKg === 0){
        //오늘보다 유지
        return 'mdi-minus'
      }else{
        //오늘보다 감소
        return 'mdi-menu-down'
      }
    },

    KgIconColor(){
      if (this.dateKg - this.todayKg > 0) {
        //오늘보다 초과
        return 'red'

      }else if (this.dateKg - this.todayKg === 0){
        //오늘보다 유지
        return 'grey'
      }else{
        //오늘보다 감소
        return 'blue'
      }
    },

    KgColor(){
      if (this.dateKg - this.todayKg > 0) {
        //오늘보다 초과
        return 'red--text'

      }else if (this.dateKg - this.todayKg === 0){
        //오늘보다 유지
        return 'grey--text' 
      }else{
        //오늘보다 감소
        return 'blue--text' 
      }
    },

    differKg(){
      return Math.abs(this.todayKg - this.dateKg);
    }
  }
}
</script>

<style  scoped>
.border {
  border: 3px solid ;
}
</style>
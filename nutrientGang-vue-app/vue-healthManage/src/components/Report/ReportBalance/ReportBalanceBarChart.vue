<template>

  <div class="fill-height mt-10" v-if="isBarChartError">
      <v-row justify="center">
          <v-col cols="auto">
              <ServerErrorComponent/>
          </v-col>
      </v-row>
  </div>
  <div class="text-center mt-10 border" v-else>
    <BarChartGenerator :chart-options="barChartOption" :chart-data="barChartData"/>
  </div>

</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
import { Bar as BarChartGenerator } from 'vue-chartjs/legacy'

export default {
  name : 'ReportBalanceBarChart',
  props : {
      barChartData : {type : Object},
      barChartOption : {type: Object},
      isBarChartError : {type: Boolean}
  },
  components: {
    BarChartGenerator,
    "ServerErrorComponent" : ServerErrorComponent
  },
}
</script>
<style  scoped>
.border {
  border: 3px solid ;
}
</style>
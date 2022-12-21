<template>
    <div class="fill-height mt-10" v-if="isPieChartError">
        <v-row justify="center">
            <v-col cols="auto">
                <ServerErrorComponent/>
            </v-col>
        </v-row>
    </div>
    <div class="fill-height mt-10" v-else-if="isPieChatNotMealError">
        <v-row justify="center">
            <v-col cols="auto">
                <NotMealInfoComponent/>
            </v-col>
        </v-row>
    </div>
    <div class="text-center mt-10 border" v-else>
        <DoughnutChartGenerator :chart-options="pieChartOption" :chart-data="pieChartData"/>
    </div>
</template>

<script>
const ServerErrorComponent = () => import("@/components/ErrorComponent/ServerErrorComponent.vue");
const NotMealInfoComponent = () => import("@/components/ErrorComponent/NotMealInfoComponent.vue")
import { Doughnut as DoughnutChartGenerator} from 'vue-chartjs/legacy'

export default {
    name : "ReportMealPieChart",
    props: {
        pieChartData : {type : Object},
        pieChartOption : {type: Object},
        isPieChartError :{type : Boolean},
        isPieChatNotMealError : {type : Boolean},
    },

    components: {
        DoughnutChartGenerator,
        "ServerErrorComponent": ServerErrorComponent,
        "NotMealInfoComponent" : NotMealInfoComponent,
    },
}
</script>

<style  scoped>
.border {
  border: 3px solid ;
}
</style>
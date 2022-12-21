<template>
    <v-container fluid>
        <div class="mb-5">
            <div class="text-center mb-10">
                <h1 class="text--primary font-weight-black">음식 선택</h1>
            </div>

            <div class="text-center mb-3 blue--text">
                음식(비율 선택)을 클릭하세요
            </div>

            <div class="pa-5 border">
                <v-row align="center" justify="center">
                    <v-col cols="auto" v-for="(food,index) in foods" :key="`food-${index}`">
                        <v-btn outlined color="#03C04A" dark
                        @click="selectFood(index)">
                            <v-icon left>mdi-silverware-variant</v-icon>{{food.name}}
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
        </div>
    </v-container>
</template>

<script>
export default {
    name : 'SelectFoodDialog',
    props : {
        foods : {
            type : Array
        }
    },

    methods : {
        selectFood(foodIndex){
            this.$emit("select-food", foodIndex)
            this.$emit("select-dialog-off");
        }
    }


}
</script>
<style scoped>
.border {
  border: 2px dashed;
  border-color: #80CAFF;
}
</style>
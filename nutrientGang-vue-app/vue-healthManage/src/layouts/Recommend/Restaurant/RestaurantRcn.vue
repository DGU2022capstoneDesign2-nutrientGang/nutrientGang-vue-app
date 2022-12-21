<template>
    <v-container fluid>
        <!--1. 제목-->
        <div class="text-center mb-10">
            <h1 class="text--primary font-weight-black">음식점 추천</h1>
        </div>

        <!--2. 선택한 메뉴, 선택한 메뉴를 가진 음식점-->
        <div>
            
            <!--선택한 메뉴-->
            <!--선택한 메뉴 없을 경우, 정상 -->
            <div class="fill-height menu-border pa-5" v-if="hasNotMenu">
                <v-row justify="center" align="center">
                    <v-col cols="auto">
                        <NotChooseMenuComponent/>
                    </v-col>
                </v-row>
                <v-row justify="center" align="center">
                    <v-col cols="auto">
                        <v-btn outlined color="blue"
                        @click="goMenuRcn">
                            <v-icon left>mdi-chevron-double-right</v-icon>
                            메뉴 선택하러 가기
                            <v-icon right>mdi-chevron-double-left</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
            <div class="menu-border" v-else>
                <v-expansion-panels focusable>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            {{menu.name}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-simple-table>
                                <template v-slot:default>
                                  <tbody>
                                    <tr>
                                        <td class="red--text">칼로리(kcal)</td>
                                        <td>{{menu.kcal}}kcal</td>
                                    </tr>
                                    <tr>
                                        <td>탄수화물 양(g)</td>
                                        <td>{{menu.carbo}}g</td>
                                    </tr>
                                    <tr>
                                        <td>단백질 양(g)</td>
                                        <td>{{menu.protein}}g</td>
                                    </tr>
                                    <tr>
                                        <td>지방 양(g)</td>
                                        <td>{{menu.fat}}g</td>
                                    </tr>
                                  </tbody>
                                </template>
                            </v-simple-table>                       
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>

            <v-divider class="mt-5 mb-5"></v-divider>

            <!--선택한 메뉴를 가진 음식점-->
            <!--선택한 메뉴 없을 경우, 정상 -->
            <div class="fill-height menu-border pt-5" v-if="hasNotMenu">
                <v-row justify="center" align="center">
                    <v-col cols="auto">
                        <NotRtrInfoComponent/>
                    </v-col>
                </v-row>
            </div>
            <div v-else>
                <RestaurantList :menu="menu"/>
            </div>
        </div>

    </v-container>
</template>

<script>
const NotChooseMenuComponent = () => import("@/components/ErrorComponent/NotChooseMenuComponent.vue");
const NotRtrInfoComponent = () => import("@/components/ErrorComponent/NotRtrInfoComponent.vue");
const RestaurantList = () => import("@/components/Recommend/Restaurant/RestaurantList.vue")
export default {
    name : 'RestaurantRcn',
    components : {
        "NotChooseMenuComponent" : NotChooseMenuComponent,
        "NotRtrInfoComponent" : NotRtrInfoComponent,
        "RestaurantList" : RestaurantList
    },

    created(){
        const hasNotInitMenu = !this.$route.params.initMenu;
        this.menu = hasNotInitMenu ? {} : this.$route.params.initMenu;
    },

    computed : {
        hasNotMenu(){
            if(this.menu.constructor === Object && Object.keys(this.menu).length === 0){
                return true;
            }

            return false;
        }
    },

    data(){
        return {
            menu : null,
            //menu : {
            //    name,
            //    kcal,
            //    carbo,
            //    protein,
            //    fat
            //}
        }
    },

    methods : {
        goMenuRcn(){
            this.$router.push({
                name : "MenuRcn",
            });
        }
    }

}
</script>

<style scoped>
.menu-border{
  border: 2px dashed;
}
</style>
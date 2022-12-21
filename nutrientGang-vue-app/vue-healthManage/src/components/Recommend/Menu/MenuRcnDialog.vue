<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        
        <!--Dialog 유발-->
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="#03C04A" dark rounded>
              <v-icon left dark>mdi-alert-circle-outline</v-icon>메뉴 추천 받기<v-icon right dark>mdi-alert-circle-outline</v-icon>
            </v-btn>
        </template>

        <!--Dialog 내용-->
        <v-card>
            <v-toolbar dark color="#03C04A">
                <v-btn icon dark @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>({{computedDate}} - {{meal}}) 추천 메뉴</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <MenuRcnDialogTemplate :rcnItems="rcnItems"
              :isError="isError" :isNotMenuError="isNotMenuError"/>
            </v-card-text>
        </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
const MenuRcnDialogTemplate = () => import("@/components/Recommend/Menu/MenuRcnDialogTemplate.vue");
export default {
    name : 'MenuRcnDialog',
    props : {
      date : {
        type : String
      },
      meal : {
        type : String
      },

      rcnItems : {
        type : Array
      },

      isError : {
        type : Boolean
      },

      isNotMenuError : {
        type : Boolean
      }

    },
    
    components : {
      "MenuRcnDialogTemplate" : MenuRcnDialogTemplate,
    },

    computed : {
      //날짜
      computedDate(){
        return this.formatDate(this.date);
      },
    },

    data () {
      return {
        dialog: false,
      }
    },

    methods : {
      //computed 통해 날짜 할당시 format
      formatDate(date){
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${year.substring(2,4)}/${month}/${day}`
      },
    }


}
</script>

<style>

</style>
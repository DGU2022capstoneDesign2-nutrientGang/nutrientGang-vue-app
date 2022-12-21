import interceptor from '../axios/interceptor.js'

export default {
    
    getKcal(date){
        
        return interceptor({
            url: 'http://54.180.116.95:3000/health/diary/calorie',
            method: 'get',
            params : {
                date :  date
            }
        });
    },

    getNutrient(date){

        return interceptor({
            url: 'http://54.180.116.95:3000/health/diary/nutrient',
            method: 'get',
            params : {
                date :  date
            }
        });
    },

    getMeal(date){

        return interceptor({
            url: 'http://54.180.116.95:3000/health/diary/meal',
            method: 'get',
            params : {
                date :  date
            }
        });
    }


}
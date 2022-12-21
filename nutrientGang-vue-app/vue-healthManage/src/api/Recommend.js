import interceptor from '../axios/interceptor.js'

export default {
    
    getRcnMenu(date, meal){
        
        let engMeal = '';
        if(meal === '아침'){
            engMeal = 'breakfast';
        }else if(meal === '점심'){
            engMeal = 'lunch';
        }else if(meal === '저녁'){
            engMeal = 'dinner'
        }

        return interceptor({
            url: 'http://54.180.116.95:3000/rcn/menu',
            method: 'get',
            params : {
                date : date,
                meal : engMeal
            }
        });
    },

    getRcnRtr(menuName, lat, lng){

        return interceptor({
            url : 'http://54.180.116.95:3000/rcn/res',
            method: 'get',
            params : {
                menu : menuName,
                lat : lat,
                lng : lng
            }
        });
    }


}
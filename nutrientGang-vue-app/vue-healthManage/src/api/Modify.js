import interceptor from '../axios/interceptor.js'

export default {
    
    //식사정보 수정 관련
    getMealInfo(mealId, meal){
        
        return interceptor({
            url: 'http://54.180.116.95:3000/register/info/meal',
            method: 'get',
            params : {
                mealId : mealId,
                meal : meal
            }
        });
    },

    modifyFood(putObj, mealId, meal){
        
        return interceptor({
            url: 'http://54.180.116.95:3000/register/update/meal',
            method: 'put',
            params : {
                mealId : mealId,
                meal: meal
            },
            data : {
                ...putObj
            }
        });
    },

    deleteFood(mealId,meal){
        return interceptor({
            url: 'http://54.180.116.95:3000/register/delete/meal',
            method: 'delete',
            params : {
                mealId : mealId,
                meal : meal
            }
        });
    },

    //건강정보 수정 관련
    getHealthInfo(date){
        
        return interceptor({
            url: 'http://54.180.116.95:3000/memberHealth',
            method: 'get',
            params : {
                date : date,
            }
        });
    },

    modifyHealthInfo(putObj){
        return interceptor({
            url: 'http://54.180.116.95:3000/memberHealth/update',
            method: 'put',
            data : {
                ...putObj
            }
        });
    }

}
import interceptor from '../axios/interceptor.js'

export default {
    
    getFoodName(name){
        
        return interceptor({
            url: 'http://54.180.116.95:3000/food',
            method: 'get',
            params : {
                name : name
            }
        });
    },

    registerFood(postObj){
        
        return interceptor({
            url: 'http://54.180.116.95:3000/register/meal',
            method: 'post',
            data : {
                ...postObj
            }
        });
    }



}
const href = 'https://photo-album-cluejws.s3.ap-northeast-2.amazonaws.com/rtr_album/';

const api = {
    restaurant : {
       restaurantAll(callback){
        const restaurants = [
            {
                rtrName : "동국 피자",
                rtrimgURL : href + 'l91g0ik8.png' ,
                rtrLocation: '충무로 10길', 
                rtrlat : 37.561395297835496, 
                rtrlng : 126.99566511579218,
                rtrMenu : [
                    {
                        menuName : '치즈피자',
                        menuInfo : '맛있는 치즈피자 입니다.',
                        menuKcal : 475,
                        menuCarbo : 52.17,
                        menuProtein : 21.21,
                        menuFat: 20.19,
                    },                  
                    {
                        menuName : '불고기피자',
                        menuInfo : '맛있는 불고기피자 입니다.',
                        menuKcal : 501,
                        menuCarbo : 67.98,
                        menuProtein : 21.57,
                        menuFat: 15.23,
                    },
                ]
            },
            {

                rtrName : "고려 치킨",
                rtrimgURL : href + 'l91g0mq4.png' ,
                rtrLocation: '서애로 1길', 
                rtrlat : 37.56081417937829, 
                rtrlng : 126.99641214720350,
                rtrMenu : [
                    {
                        menuName : '후라이드 치킨',
                        menuInfo : '맛있는 후라이드 치킨 입니다.',
                        menuKcal : 247 ,
                        menuCarbo : 8.48,
                        menuProtein : 18.96,
                        menuFat: 14.68
                    },                  
                    {
                        menuName : '양념 치킨',
                        menuInfo : '맛있는 양념 치킨 입니다.',
                        menuKcal : 576 ,
                        menuCarbo : 27.45,
                        menuProtein : 32.88,
                        menuFat: 36.01,
                    },
                    {
                        menuName : '간장 치킨',
                        menuInfo : '맛있는 간장 치킨 입니다.',
                        menuKcal : 689,
                        menuCarbo : 27.79,
                        menuProtein : 43.94,
                        menuFat: 43.21,
                    },
                ]
            },
            {
                rtrName : "서울 햄버거",
                rtrimgURL : href + 'l91g0q0b.png' ,
                rtrLocation: '서애로 15길 24', 
                rtrlat : 37.561543987013806, 
                rtrlng : 126.99640079394858,
                rtrMenu : [
                    {
                        menuName : '불고기 와퍼',
                        menuInfo : '맛있는 불고기 와퍼 입니다.',
                        menuKcal : 682,
                        menuCarbo : 50.00,
                        menuProtein : 28.00,
                        menuFat: 28.00,
                    },                  
                    {
                        menuName : '통새우 와퍼',
                        menuInfo : '맛있는 통새우 와퍼 입니다.',
                        menuKcal : 741 ,
                        menuCarbo : 50.00,
                        menuProtein : 34.00,
                        menuFat: 15.00,
                    },
                ]
            },
            {
                rtrName : "연세 서브웨이",
                rtrimgURL : href + 'l91g0u9k.png',
                rtrLocation: '충무로 1길', 
                rtrlat : 37.560944851198634,
                rtrlng : 126.99743643508589,
                rtrMenu : [
                    {
                        menuName : 'BLT 샌드위치',
                        menuInfo : '맛있는 BLT 샌드위치 입니다.',
                        menuKcal : 370 ,
                        menuCarbo : 46.00,
                        menuProtein : 16.00,
                        menuFat: 14.00,
                    },                  
                    {
                        menuName : '에그마요 샌드위치',
                        menuInfo : '맛있는 에그마요 샌드위치 입니다.',
                        menuKcal : 398,
                        menuCarbo : 26.77,
                        menuProtein : 12.56,
                        menuFat: 26.47,
                    },
                ]
            }
        ];

        callback({ success : true, restaurants })
       } 
    },

    temp_restaurant : {
        restaurantAll(callback){
            const restaurants = [
                {
                    seq: 398,
                    place : "temp음식점1",
                    info : "temp제육볶음",
                    lat : 37.56089076590386, 
                    lng : 126.99645175708804
                },
                {
                    seq : 399,
                    place : "temp음식점2",
                    info : "temp돈까스",
                    lat : 37.56081417997729, 
                    lng : 126.99641214720332
                },
                {
                    seq: 400,
                    place : "temp음식점3",
                    info : "temp초밥",
                    lat : 37.561543987013806, 
                    lng : 126.99640079394858
                },
                {
                    seq: 401,
                    place : "temp음식점4",
                    info : "temp햄버거",
                    lat : 37.560944851198634,
                    lng : 126.99743643508589
                }
            ];
    
            callback({ success : true, restaurants })
           } 
    }
}


export {api}
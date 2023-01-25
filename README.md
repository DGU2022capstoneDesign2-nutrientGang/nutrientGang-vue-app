# ✈️ 프로젝트 소개
> **Image Detection을 활용한 영양소 기반 음식점 추천 서비스**
- **동국대학교 2022 캡스톤디자인2, 3팀 영양갱**
- **프로젝트 기간** : 2022.09.15 ~ 2022.12.14 (3개월)

- 사용자 인적 사항 및 목표와 현재 영양 상태를 토대로 분석한 정보를 통해, 주변 음식점 중 해당 정보에 알맞는 메뉴를 제공하는 음식점을 추천하는 웹/앱 서비스
  - 사용자가 인적 사항 및 목표를 기입하고, 식단을 사진으로 찍거나 텍스트로 입력하도록 식단 데이터 수집
  - 식단 데이터를 기반으로 사용자의 식사 습관 및 영양 습관을 한눈에 확인
  - 영양 상태 분석을 통한 주변 음식점 메뉴 추천으로 식단 조절을 도움
  
<br><br>
# 📄 아키텍쳐 다이어그램
![image](https://user-images.githubusercontent.com/75558861/212501260-799ab27d-9ff1-4fd0-9b44-56b314a18fae.png)

<br><br>
# 🛠  개발 환경

> ![Java](https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white)
> ![Spring](https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
> ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white)
> <br>
> ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
> ![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08)
> ![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)
> <br>
> ![Python](https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white)
> ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
> ![Yolov5](https://img.shields.io/badge/yolo-00FFFF?style=for-the-badge&logo=yolo&logoColor=white)
> <br>
> ![AWS](https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)

<br><br>
# 🔍 사용 방법
|기능|설명|어플 화면|
|--------|------|----------|
|회원가입|사용자는 건강관리 서비스를 이용하기 위해서 회원가입을 해야 한다. <br><br>- 목표, 활동량, 성별, 키, 몸무게, 회원정보 총 3단계를 통한 정보 입력 후 회원가입을 할 수 있다. |![KakaoTalk_20230125_213144127](https://user-images.githubusercontent.com/75558861/214564528-f3871bd1-c1f3-4e80-9abf-1345c5274a2e.gif)|
|로그인|사용자는 건강관리 서비스를 이용하기 위해서 가입한 회원정보를 통해 로그인을 해야 한다. <br><br>- 이메일, 비밀번호로 로그인 할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212496675-ffe2f0b7-9559-416e-90eb-cc6bbe372649.png)|
|다이어리|사용자는 가입한 회원정보를 통해 로그인하면 다이어리 페이지를 접속할 수 있다. <br><br>- ‘일일 권장 칼로리’와 ‘선택한 날짜의 섭취 칼로리’를 확인할 수 있다. 또한 ‘일일 권장 칼로리’와 ‘선택한 날짜의 섭취 칼로리’ 차이인 ‘잔여 칼로리’를 확인할 수 있다.  <br>- 탄수화물, 단백질, 지방의 ‘선택한 날짜의 섭취량’과 ’일일 권장량’을 확인할 수 있다. 또한 각각의 ‘선택한 날짜의 섭취량’을 백분위로 확인 할 수 있다. <br>- 아침, 점심, 저녁의 ‘선택한 날짜의 섭취 칼로리’와 ‘일일 권장 칼로리’를 확인할 수 있다. 또한 각 식사기록의 칼로리를 확인할 수 있다.  <br>- 식사기록의 + 버튼을 클릭 시 ‘카메라/갤러리’ 또는 ‘텍스트 입력’을 통해 식사를 기록 할 수 있다. |![image](https://user-images.githubusercontent.com/75558861/212496862-c5719f4d-87e8-4859-ba8b-cc500e806d8d.png)|
|리포트<br>(변화추이)|사용자는 가입한 회원정보를 통해 로그인하면 리포트 페이지의 변화추이 탭을 확인할 수 있다. <br><br> - ‘날짜별 섭취 칼로리 변화’, ‘최대, 최소 칼로리’를 확인할 수 있고, 또한 ‘오늘 날짜의 섭취 칼로리와 날짜별 섭취 칼로리 비교’를 그래프 점 클릭 시 확인 할 수 있다. <br> - ‘날짜별 섭취 몸무게 변화’, ‘최대, 최소 몸무게’를 확인할 수 있고, 또한 ‘오늘 날짜의 몸무게와 날짜별 몸무게 비교’를 그래프 점 클릭 시 확인 할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497068-b8292f6b-2b69-438f-ae82-ef812ce1cb87.png)|
|리포트<br>(영양균형)|사용자는 가입한 회원정보를 통해 로그인하면 리포트 페이지의 영양균형 탭을 확인할 수 있다.<br><br>- 탄수화물, 단백질, 지방의 ‘일주일 총 섭취 영양소 비율’을 파이 차트를 통해 확인할 수 있다.<br>- 탄수화물, 단백질, 지방의 ‘일주일 동안 섭취 평균 비율 및 평균 섭취량’을 확인할 수 있고, ‘일일 권장량’을 확인할 수 있다.<br>- 탄수화물, 단백질, 지방의 ‘일주일 간 섭취 비율’을 바 차트를 통해 확인할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497162-c0a2525d-af09-4b85-af65-5bf8829240dd.png)|
|리포트<br>(식사기록)|사용자는 가입한 회원정보를 통해 로그인하면 리포트 페이지의 식사기록 탭을 확인할 수 있다.<br><br>- 기록한 식사 중 ‘일주일 총 삼시세끼 비율’을 파이 차트를 통해 확인할 수 있다.<br>- 아침, 점심, 저녁의 ‘일주일 간 섭취 여부’를 섭취 안했을 시 + 표시로, 섭취 했을 시 v 표시로 확인할 수 있다.<br>- 아침, 점심, 저녁의 섭취 안했을 시의 + 표시를 클릭 하면, ‘카메라/갤러리’ 또는 ‘텍스트 입력’을 통해 식사를 기록 할 수 있다. |![image](https://user-images.githubusercontent.com/75558861/212497252-03e43b4f-b14d-40b2-9a34-f61d09d6fcbb.png)|
|식사 등록(이미지)|사용자는 가입한 회원정보를 통해 로그인하면 카메라 및 갤러리로 식사 사진을 등록하는 페이지로 접속할 수 있다.<br><br>- ‘카메라/갤러리 사진’ 탭을 클릭하면 카메라로 식사 사진을 업로드 하거나 갤러리에서 식사 사진을 업로드 할 수 있다.<br>- 업로드 하면 업로드 한 사진을 확인할 수 있으며, 사진 위에 인식한 음식의 이름을 보여준다.<br>- 인식한 여러 가지 음식 후보군 중에 해당하는 음식을 선택할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497344-f5331bbc-ef2a-45f7-84e4-f536441692f9.png)|
|식사 등록(텍스트)|사용자는 가입한 회원정보를 통해 로그인하면 텍스트로 식사를 등록하는 페이지로 접속할 수 있다.<br><br>- 기록할 수 있는 음식을 검색하여 식사를 등록할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497355-02f7a90d-08f8-43c7-a843-26c136a8e385.png)|
|식사 등록(상세등록)|사용자는 가입한 회원정보를 통해 로그인하면 식사를 상세 등록하는 페이지로 접속할 수 있다.<br><br>- 등록할 식사 사진을 확인 할 수 있다.<br>- 등록할 날짜와 아침, 점심, 저녁을 선택할 수 있다.<br>- 등록할 식사의 음식들에 대한 영양정보를 확인할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497423-5a06f135-dc35-4a25-adc3-b90e3d285062.png)|
|식사 등록(상세등록)|추가로 등록을 하고 싶은 음식은 텍스트로 등록할 수 있고, 등록을 취소하고 싶은 음식은 x 표시를 클릭하면 삭제할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497451-4c84d027-6a9b-4f1f-aa12-e5214dc0266d.png)|
|식사 등록(상세등록)|등록할 식사의 음식들에 대한 비율을 선택할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497494-2bfcb6df-c95c-4cb3-9937-6d0a9cef5422.png)|
|메뉴 추천|사용자는 가입한 회원정보를 통해 로그인하면 메뉴를 추천받는 페이지로 접속할 수 있다.<br><br>- ‘일일 권장 칼로리’와 ‘오늘 날짜의 섭취 칼로리’를 확인할 수 있다. 또한 ‘일일 권장 칼로리’와 ‘오늘 날짜의 섭취 칼로리’ 차이인 ‘잔여 칼로리’를 확인할 수 있다. <br>- 탄수화물, 단백질, 지방의 ‘오늘 날짜의 섭취량’과 ’일일 권장량’을 확인할 수 있다. 또한 각각의 ‘오늘 날짜의 섭취량’을 백분위로 확인 할 수 있다.<br>- 추천받을 아침, 점심, 저녁을 선택할 수 있다.<br>- 메뉴 추천 받기 버튼을 클릭하면 오늘 날짜에 대한 목표, 활동량, 성별, 키, 몸무게, 회원정보와 식사 기록을 통해 계산된 섭취 영양 정보를 기반으로 무작위 메뉴 5가지를 추천받을 수 있다.<br>- 메뉴는 이름, 칼로리, 탄수화물, 단백질, 지방별로 오름차순 또는 내림차순으로 정렬하여 추천받을 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497553-57d7b12d-a167-47e7-82c0-05fc627b52b9.png)|
|음식점 추천|사용자는 가입한 회원정보를 통해 로그인하면 선택한 추천 메뉴를 가지는 음식점을 확인하는 페이지로 접속할 수 있다.<br><br>- 선택한 추천 메뉴에 대한 정보를 확인할 수 있다.<br>- 사용자의 위치 기반 주변 음식점들을 Kakao Map의 마커로 확인할 수 있다.<br>- 지도 확대 / 축소 버튼을 통해 Kakao Map을 확대 / 축소 할 수 있다. <br>- 마커를 클릭 시 해당 음식점이 제공하는 메뉴를 확인할 수 있으며, 해당 음식점의 위치로 Kakao Map을 이동시킨다.<br>- 음식점 상세 정보 카드를 클릭하면 마커를 클릭하는 효과를 얻을 수 있다.<br>- 음식점 상세 정보 카드에는 음식점 주소, 음식점이 제공하는 메뉴와 메뉴의 영양정보를 확인할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497645-4b1aac80-09be-44f3-9a3d-277ee3564171.png)|
|식사 정보 수정|사용자는 가입한 회원정보를 통해 로그인하면 등록한 식사 기록을 수정하는 페이지로 접속할 수 있다.<br><br>- 아침, 점심, 저녁의 ‘선택한 날짜의 섭취 칼로리’와 ‘일일 권장 칼로리’를 확인할 수 있다. 또한 각 식사기록의 칼로리를 확인할 수 있다.  <br>- 수정할 날짜를 선택할 수 있다.<br>- 식사 사진을 클릭 시 해당 식사 기록을 상세 수정할 수 있다. <br>- 식사 상세 수정은 식사 상세 등록과 같은 기능을 제공한다.<br>- 식사 상세 수정은 상세 수정과 삭제를 할 수 있다.|![image](https://user-images.githubusercontent.com/75558861/212497722-ad1bb5e9-774e-4723-a2b4-a48be5f4f7cf.png)|
|건강정보 수정|사용자는 가입한 회원정보를 통해 로그인하면 설정한 건강 정보를 수정하는 페이지로 접속할 수 있다.<br><br>- 수정할 날짜를 선택할 수 있다.<br>- 건강정보 수정 버튼을 클릭 시 해당 날짜의 건강정보를 상세 수정할 수 있다.<br>- 건강정보 수정은 회원가입 1단계, 2단계와 같은 기능을 제공한다.|![image](https://user-images.githubusercontent.com/75558861/212497759-c4a7e6d8-6329-4be1-b0c7-ce2758050645.png)|

<br><br>
# 🛠️ API specification
[API 명세서](https://mammoth-fruitadens-773.notion.site/API-b7e8bdd6308e42cbb7fbccfe83d104db)

<br><br>
# 👥 멤버
|이름|담당 업무|
|:------:|--------------|
|석재욱|Flask 서버 개발|
|정원석|웹/앱 개발 및 유지 보수|
|최용태|Yolov5 설계, Spring 서버 개발|
|홍진원|Spring 서버 개발 및 유지보수|

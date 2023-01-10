# 🎬 FIND MY MOVIES

- 데모 사이트 : [FIND MY MOVIES](https://coruscating-klepon-9efb9d.netlify.app/)

- 작업 기간 : 2023.01.03 ~ 2023.01.10
- 사용 언어 : `HTML`, `SCSS`, `Javascript`
- 사용 라이브러리 및 플러그인 : `GSAP`, "autoprefixer", "postcss"

- 목표 : OMDb API를 활용해 영화 검색 기능 구현하기
  <br /><br /><br /><br />

## 요구사항

### ❗ 필수

- [x] 영화 제목으로 검색 가능하고 검색된 결과의 영화 목록이 출력돼야 합니다.
- [x] jQuery, React, Vue 등 JS 라이브러리와 프레임워크는 사용하지 않아야 합니다.
- [x] 스타일(CSS) 라이브러리나 프레임워크 사용은 자유입니다.

### ❔ 선택

- [x] 한 번의 검색으로 영화 목록이 20개 이상 검색되도록 만들어보세요.
- [x] 영화 개봉연도로 검색할 수 있도록 만들어보세요.
- [x] 영화 목록을 검색하는 동안 로딩 애니메이션이 보이도록 만들어보세요.
- [x] 무한 스크롤 기능을 추가해서 추가 영화 목록을 볼 수 있도록 만들어보세요.
- [x] 영화 포스터가 없을 경우 대체 이미지를 출력하도록 만들어보세요.
- [x] 단일 영화의 상세정보(제목, 개봉연도, 평점, 장르, 감독, 배우, 줄거리, 포스터 등)를 볼 수 있도록 만들어보세요.
- [x] 영화 상세정보가 출력되기 전에 로딩 애니메이션이 보이도록 만들어보세요.
- [x] 영화 상세정보 포스터를 고해상도로 출력해보세요.(실시간 이미지 리사이징)
- [x] 차별화가 가능하도록 프로젝트를 최대한 예쁘게 만들어보세요.
- [ ] 영화와 관련된 기타 기능도 고려해보세요.
      <br /><br />

---

<br /><br />

## ✨ 사이트 소개
![main](https://user-images.githubusercontent.com/102499959/211477330-833c68c0-1ab7-42b4-8991-d3a177bb6035.gif)

- 사이트에 접속하면 귀여운 배너가 등장하며 반겨줍니다.
- 개봉연도와 영화 제목 키워드를 입력해 해당하는 영화를 찾을 수 있습니다. 
- footer 영역에는 해당 이미지 출처를 명시했습니다.

<br /><br />

### 🔎 영화 검색
![search](https://user-images.githubusercontent.com/102499959/211478787-2632b881-fd6d-47ad-b7e5-bb3f69d38225.gif)

- search 버튼에 `hover` 시 색이 변하고, 검색어를 입력한 뒤 버튼을 클릭하거나 `enter` 키를 누르면 API 서버에 요청 및 데이터 응답이 실행됩니다.
- 응답 중일 때는 로딩 애니메이션이 실행되며 응답이 완료되면 해당하는 영화를 20개 보여줍니다.

<br /><br />

### 👀 상세 페이지
![modal](https://user-images.githubusercontent.com/102499959/211480952-91f4eba3-7309-434b-8867-50037863282d.gif)

![modal](https://user-images.githubusercontent.com/102499959/211481569-da4e7a2a-bfaa-4452-b2de-65c3e7c4982d.png)
<br/>
- 각 영화 카드에 `hover` 시 `transition`이 일어납니다.
- 카드를 클릭하면 해당 카드로부터 `HTML`의 `data-name` 속성을 통해 영화의 `id`를 받아 서버에 영화 상세 정보를 요청합니다.
- 해당 영화의 상세 정보가 모달 창으로 보여지며, 상세 정보가 로딩 중일 때 로딩 애니메이션이 실행됩니다.
- 모달창이 보여지면 스크롤이 동작하지 않으며 모달창을 사라지게 하는 방법은 3가지가 있습니다.
  1. 상세 정보 창 바깥 영역 클릭
  2. `Esc` 키 입력
  3. 닫기 버튼 클릭


- Poster url을 수정하여 고해상도의 포스터를 출력하도록 했습니다.


<br /><br />

### 🖼️ 대체 이미지 출력
![noimages](https://user-images.githubusercontent.com/102499959/211485483-c916d5b4-0871-4d35-b957-8ed2ed539341.gif)
- 해당 영화 정보에 포스터 url이 없는 경우 카드와 모달창 둘다 대체 이미지가 출력되도록 했습니다.



<br /><br />


### 🖱️ 무한 스크롤
![scroll](https://user-images.githubusercontent.com/102499959/211485925-760bceaf-d88b-4b93-b3c8-e810377b20ca.gif)

스크롤이 영화 목록의 마지막에 도달하게 되면 10개의 영화 데이터를 추가로 받아옵니다. 마지막 페이지에 도달할 때까지 실행됩니다.



<br /><br />


### 📱 반응형 레이아웃
![responsive](https://user-images.githubusercontent.com/102499959/211487479-a3ef1063-663e-45f6-b125-8b636b1a53a1.gif)
- 다른 기기에서도 사용할 수 있도록 디바이스 크기에 따른 반응형 레이아웃을 제작했습니다.
- 디자인 감각이 부족해 아쉬움을 느끼실 수 있습니다.😅

<br /><br />
<img width="360" src="https://user-images.githubusercontent.com/102499959/211488265-65d576b5-aff0-42cc-8632-280f067ff718.jpg" alt="mobile1" />
<img width="360" src="https://user-images.githubusercontent.com/102499959/211488269-6cdbc845-82de-4e5a-b12d-f5b20c99e32c.jpg" alt="mobile2" />

- 아이폰으로 사이트에 접속했을 때 보여지는 화면입니다.
- 다른 기기와는 달리 `width : 768px` 미만인 기기에서는 모달 창에 이미지가 등장하지 않습니다.


<br /><br />


### ⚠️ 에러 메세지 출력

![please](https://user-images.githubusercontent.com/102499959/211490347-35bd8f31-a361-4c26-9d3b-94b4d4c142d0.png)
![tooshort](https://user-images.githubusercontent.com/102499959/211490341-94e1f2b7-f074-4824-92a9-e28521ed2716.png)
![noanswer](https://user-images.githubusercontent.com/102499959/211490344-a44fca92-e4d5-4c1b-a542-8ec70ec5fbca.png)

다음과 같은 에러 발생 시 상황에 맞는 메세지가 출력됩니다.
- 검색어가 없을 시의 메세지 출력
- 검색어 문자열 길이가 3 미만일 시의 메세지 출력
- 해당하는 영화 데이터가 없을 때의 메세지 출력



<br /><br />


### 🗒️ Review
- 에러 메세지 출력에서, `data.Response === false` 인 경우에 검색어를 분석해서 상황에 맞게 메세지를 출력했지만, `data.Response === false`인 경우는 검색어의 오류 뿐만 아니라 여러 가지 상황에서 올 수 있음을 간과했습니다. 추후 `try ... catch`를 통해 해당 코드를 대체해볼 생각입니다.
- `scroll` 이벤트를 사용해 무한 스크롤을 구현했으나 `scroll` 이벤트의 발생 빈도 때문에 제어하기가 어려웠습니다. `intersectionObserver API`를 공부한 뒤 해당 API로 대체할 수 있도록 하겠습니다.
- 코드를 어떻게 하면 더 깔끔하게 작성할 수 있을 지 고민하고 최적화하도록 하겠습니다.

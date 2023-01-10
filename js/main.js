// 화면 최상단 이동 버튼 구현
const toTopEl = document.querySelector("#to-top");
window.addEventListener(
  "scroll",
  function () {
    if (window.scrollY > 500) {
      // 페이지 스크롤 위치가 500px 넘으면 버튼 보이기
      gsap.to(toTopEl, 0.2, {
        x: -160,
      });
    } else {
      // 스크롤 위치가 500이 넘지 않으면 버튼 숨기기
      gsap.to(toTopEl, 0.2, {
        x: 0,
      });
    }
  },
  200
);
toTopEl.addEventListener("click", function () {
  // 버튼 클릭시 페이지 최상단으로 이동
  gsap.to(window, 0.5, {
    scrollTo: 0,
  });
});

// 페이지 접속 시 배너 클래스 추가 (transition)
const wrap = document.querySelector("#wrap");
const bannerEl = document.querySelector(".banner");
window.onload = function () {
  bannerEl.classList.add("loaded");
};

// select 옵션에 현재 연도로부터 50년 이전까지 연도 별 option 넣기
const yearsEl = document.querySelector("#years");
const nowYear = new Date().getFullYear();
const inputEl = document.querySelector("input");
const selectEl = document.querySelector("select");
for (let i = nowYear; i >= nowYear - 50; i--) {
  let yearEl = document.createElement("option");
  yearEl.value = i;
  yearEl.textContent = i;
  yearsEl.appendChild(yearEl);
}

// search 버튼 누르면 inputEl, selectEl value 가져와서 getMovies에 넣기
// loading 중일 때 .loader 삽입, fetch되면 .loader 제거
const SearchEl = document.querySelector(".search__btn");
const resultDiv = document.querySelector(".result");

let count = 1;
let getData;
let title, year;
let isFirst = false;
let loaded = false;
const loaderDiv = document.createElement("div");
const loaderEl = document.createElement("div");
loaderDiv.classList.add("loader-container");
loaderEl.classList.add("loader");
const noResultEl = document.createElement("p");
noResultEl.classList.add("no-result");
noResultEl.textContent = "검색 키워드를 입력해주세요!";

SearchEl.addEventListener("click", async function (e) {
  e.preventDefault();
  title = inputEl.value;
  year = selectEl.value;
  isFirst = true;

  // 입력 내용 없을 시 noResultEl 삽입
  if (title === "") {
    resultDiv.append(noResultEl);
    return;
  } else {
    // 영화 검색 실행
    count = 1;
    resultDiv.innerHTML = "";
    loaderDiv.append(loaderEl);
    resultDiv.append(loaderDiv);
    await getMovies(title, year, count);

    if (getData?.Response === "True" && totalPages > 1) {
      count++;
      getMovies(title, year, count);
    }
  }
});

// 영화 API 받아오기

let movies = [];
let totalResults;
let totalPages;

async function getMovies(title, year, count) {
  const s = `&s=${title}`;
  const y = year === "All Years" ? "" : `&y=${year}`;
  const page = `&page=${count}`;
  await fetch(`https://www.omdbapi.com/?apikey=d2f6bdf1${s}${y}${page}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.Response === "True") {
        // data 응답 성공 시 setMovies 실행
        movies = data.Search;
        totalResults = data.totalResults;
        totalPages = Math.ceil(totalResults / 10);
        setMovies(data);
        getData = data;
      } else if (isFirst) {
        // 오류 메세지 출력
        noResultEl.textContent =
          title.length < 3
            ? `3글자 이상 입력해주세요.`
            : `"${title}"을 포함하는 영화가 없습니다.`;
        resultDiv.innerHTML = "";
        resultDiv.append(noResultEl);
      }
      isFirst = false;
    });
}

// 받아온 JSON 데이터 출력
const totalEl = document.createElement("p");
totalEl.classList.add("total");

const moviesEl = document.createElement("ul");
moviesEl.classList.add("movie-list");

// 받아온 데이터 카드 섹션에 붙여넣기
function setMovies() {
  // 불러오는 동안에는 무한스크롤 불가
  loaded = false;

  totalEl.innerHTML = `총 <span>${totalResults}</span>개의 검색결과가 있습니다.`;

  const liEls = movies.map((movie) => {
    const liEl = document.createElement("li");
    const aEl = document.createElement("a");
    const imgEl = document.createElement("div");
    const infoEl = document.createElement("div");
    const titleEl = document.createElement("h2");
    const yearEl = document.createElement("span");
    const typeEl = document.createElement("span");

    const url =
      movie.Poster === "N/A"
        ? require("../images/no_images.png")
        : movie.Poster;

    aEl.href = "javascript:void(0)";
    imgEl.classList.add("background");
    imgEl.style.backgroundImage = `url(${url})`;
    liEl.dataset.id = movie.imdbID;
    titleEl.textContent = movie.Title;
    yearEl.textContent = movie.Year;
    yearEl.classList.add("year");
    typeEl.classList.add(movie.Type === "movie" ? "type-movie" : "type-series");
    typeEl.textContent = movie.Type;
    infoEl.append(titleEl, yearEl, typeEl);
    aEl.append(imgEl, infoEl);
    liEl.append(aEl);

    return liEl;
  });

  // search 버튼 눌러서 데이터 불러올 때 이전 요소 삭제
  if (isFirst) {
    resultDiv.innerHTML = "";
    moviesEl.innerHTML = "";
  }
  moviesEl.append(...liEls);
  resultDiv.append(totalEl, moviesEl);
  popup();

  // 무한스크롤 가능하게
  loaded = true;
}
// 무한스크롤 구현
window.addEventListener("scroll", function () {
  if (
    window.scrollY >=
    document.documentElement.scrollHeight - window.innerHeight
  ) {
    if (loaded) {
      count += 1;
      getMovies(title, year, count);
    }
  }
});

// 카드 클릭했을 때 모달창 등장 및 document scoll 처리, to-top 버튼 숨김
const body = document.querySelector("body");
const modalWrapper = document.createElement("div");
const modalOverlayEl = document.createElement("div");
const modalEl = document.createElement("div");

modalWrapper.id = "modal";
modalEl.classList.add("modal-container");
modalOverlayEl.classList.add("modal-overlay");

// 모달 창 띄우기
function popup() {
  const cardEl = moviesEl.querySelectorAll("li");

  for (let i = 0; i < cardEl.length; i++) {
    cardEl[i].addEventListener("click", (e) => {
      const movieId = cardEl[i].dataset.id;

      e.preventDefault();

      modalEl.innerHTML = "";
      modalEl.append(loaderDiv);
      modalWrapper.append(modalOverlayEl, modalEl);
      wrap.append(modalWrapper);
      body.classList.add("stop-scrolling");
      toTopEl.classList.add("hide");
      getMovieInfo(movieId);
    });
  }
}

// 영화에 대한 상세 정보 가져오기
async function getMovieInfo(movieId) {
  await fetch(`https://omdbapi.com/?apikey=7035c60c&i=${movieId}&plot=full`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setMovieInfo(data);
    });
}

// 가져온 상세 정보 모달 창에 셋팅
function setMovieInfo(movie) {
  // 이미지 크기 변경
  const background = document.createElement("div");
  const url =
    movie.Poster === "N/A"
      ? require("../images/no_images.png")
      : movie.Poster.replace("X300", "X600");

  // 생성할 요소들
  const infoInnerEl = document.createElement("div");
  const h2El = document.createElement("h2");
  const innerLEl = document.createElement("div");
  const innerREl = document.createElement("div");
  const infoListEl = document.createElement("div");
  const genreListEl = document.createElement("span");
  const yearEl = document.createElement("span");
  const timeEl = document.createElement("span");
  const directorEl = document.createElement("span");
  const rateEl = document.createElement("span");
  const plotEl = document.createElement("p");
  const castEl = document.createElement("div");
  const closeBtn = document.createElement("div");

  // 디자인을 위한 클래스 부여
  innerLEl.classList.add("inner-left");
  innerREl.classList.add("inner-right");
  background.classList.add("background");
  infoInnerEl.classList.add("info-inner");
  infoListEl.classList.add("info-list");
  genreListEl.classList.add("genre-list");
  plotEl.classList.add("plot");
  rateEl.classList.add("rate");
  castEl.classList.add("cast");
  closeBtn.classList.add("close-btn");

  // 요소에 들어갈 내용 세팅
  innerLEl.style.backgroundImage = `url(${url})`;
  h2El.textContent = movie.Title;
  yearEl.textContent = movie.Year;
  timeEl.textContent = movie.Runtime.replace("min", "minutes");
  directorEl.textContent = movie.Director;
  genreListEl.textContent = movie.Genre;
  plotEl.textContent = movie.Plot === "N/A" ? "" : movie.Plot;
  rateEl.innerHTML = `<span>&#9733;</span> ${movie.imdbRating}`;
  castEl.innerHTML = `<h3>Casts</h3><p>${movie.Actors}</p>`;
  closeBtn.innerHTML = `<span class="material-symbols-outlined">
  close
  </span>`;

  infoListEl.append(yearEl, timeEl, directorEl);
  innerREl.append(h2El, infoListEl, genreListEl, rateEl, plotEl, castEl);

  infoInnerEl.append(innerLEl, innerREl);

  modalEl.innerHTML = "";
  modalEl.append(background, infoInnerEl, closeBtn);

  // 모달 창 밖 영역 클릭하면 모달창 꺼지게 하기
  modalOverlayEl.addEventListener("click", function () {
    wrap.removeChild(modalWrapper);
    body.classList.remove("stop-scrolling");
    toTopEl.classList.remove("hide");
  });

  // esc 키 누르면 모달창 꺼지게 하기
  window.addEventListener("keyup", function (e) {
    if (e.key === "Escape") {
      wrap.removeChild(modalWrapper);
      body.classList.remove("stop-scrolling");
      toTopEl.classList.remove("hide");
    }
  });

  // closeBtn 누르면 모달창 꺼지게 하기
  closeBtn.addEventListener("click", function () {
    wrap.removeChild(modalWrapper);
    body.classList.remove("stop-scrolling");
    toTopEl.classList.remove("hide");
  });
}

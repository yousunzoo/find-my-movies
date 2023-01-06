// 페이지 접속 시 배너 클래스 추가
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
let title, year;
const loaderEl = document.createElement("div");
loaderEl.classList.add("loader");
const noResultEl = document.createElement("p");
noResultEl.classList.add("no-result");
noResultEl.textContent = "검색 키워드를 입력해주세요!";
const moreBtn = document.createElement("button");
moreBtn.classList.add("more");
moreBtn.textContent = "더보기";

SearchEl.addEventListener("click", function (e) {
  e.preventDefault();
  title = inputEl.value;
  year = selectEl.value;
  if (title === "") {
    resultDiv.append(noResultEl);
    return;
  } else {
    count = 1;
    resultDiv.innerHTML = "";
    resultDiv.append(loaderEl);
    getMovies(title, year, count, true);
  }
});

// 영화 API 받아오기

let movies = [];
let totalResults;
let totalPages;

async function getMovies(title, year, count, isFirst) {
  const s = `&s=${title}`;
  const y = year === "All Years" ? "" : `&y=${year}`;
  const page = `&page=${count}`;
  await fetch(`https://www.omdbapi.com/?apikey=d2f6bdf1${s}${y}${page}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.Response === "True") {
        movies = data.Search;
        totalResults = data.totalResults;
        totalPages =
          totalResults % 10 === 0
            ? totalResults / 10
            : parseInt(totalResults / 10) + 1;
        setMovies(isFirst);
      } else {
        noResultEl.textContent =
          title.length < 3
            ? `3글자 이상 입력해주세요.`
            : `"${title}"을 포함하는 영화가 없습니다.`;
        resultDiv.innerHTML = "";
        resultDiv.append(noResultEl);
      }
    });
}

// 받아온 JSON 데이터 출력
const totalEl = document.createElement("p");
totalEl.classList.add("total");

const moviesEl = document.createElement("ul");
moviesEl.classList.add("movie-list");

// 받아온 데이터 카드 섹션에 붙여넣기
function setMovies(isFirst) {
  totalEl.innerHTML = `총 <span>${totalResults}</span>개의 검색결과가 있습니다.`;

  const liEls = movies.map((movie) => {
    const liEl = document.createElement("li");
    const aEl = document.createElement("a");
    const imgEl = document.createElement("img");
    const infoEl = document.createElement("div");
    const titleEl = document.createElement("h2");
    const yearEl = document.createElement("span");
    const typeEl = document.createElement("span");
    aEl.href = "javascript:void(0)";
    imgEl.src =
      movie.Poster === "N/A" ? require("/images/no_images.png") : movie.Poster;
    imgEl.alt = movie.Title;
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

  if (isFirst) {
    resultDiv.innerHTML = "";
    moviesEl.innerHTML = "";
  }

  moviesEl.append(...liEls);
  resultDiv.append(totalEl, moviesEl, moreBtn);
  popup();
}

// 더보기 버튼 클릭시 데이터 더 불러오기
const noMoreEl = document.createElement("p");
noMoreEl.textContent = "더 이상의 검색 결과가 없습니다!";
noMoreEl.classList.add("no-more");

moreBtn.addEventListener("click", function (e) {
  e.preventDefault();
  count += 1;
  if (count > totalPages) {
    moreBtn.remove();
    resultDiv.append(noMoreEl);
    return;
  } else {
    getMovies(title, year, count, false);
    return count;
  }
});

function popup() {
  // 카드 클릭했을 때 모달창 등장 및 document scoll 처리
  const body = document.querySelector("body");
  const cardEl = moviesEl.querySelectorAll("li");
  const modalWrapper = document.createElement("div");
  modalWrapper.id = "modal";
  const modalEl = document.createElement("div");
  modalEl.classList.add("modal-container");

  for (let i = 0; i < cardEl.length; i++) {
    cardEl[i].addEventListener("click", (e) => {
      e.preventDefault();
      console.log(i);
      modalWrapper.append(modalEl);
      wrap.append(modalWrapper);
      body.classList.add("stop-scrolling");
    });
  }
  modalWrapper.addEventListener("click", function () {
    wrap.removeChild(modalWrapper);
    body.classList.remove("stop-scrolling");
  });
}

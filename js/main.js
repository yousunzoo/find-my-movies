// variables
const bannerEl = document.querySelector(".banner");

const resultDiv = document.querySelector(".result");
const yearsEl = document.querySelector("#years");
const nowYear = new Date().getFullYear();
const inputEl = document.querySelector("input");
const selectEl = document.querySelector("select");
const SearchEl = document.querySelector(".search__btn");

let count = 1;
let title, year;
const loaderEl = document.createElement("div");
loaderEl.classList.add("loader");
const noResultEl = document.createElement("p");
noResultEl.classList.add("no-result");
noResultEl.textContent = "검색 키워드를 입력해주세요!";

// 페이지 접속 시 배너 클래스 추가

window.onload = function () {
  bannerEl.classList.add("loaded");
};

// select 옵션에 현재 연도로부터 50년 이전까지 연도 별 option 넣기

for (let i = nowYear; i >= nowYear - 50; i--) {
  let yearEl = document.createElement("option");
  yearEl.value = i;
  yearEl.textContent = i;
  yearsEl.appendChild(yearEl);
}

// search 버튼 누르면 inputEl, selectEl value 가져와서 getMovies에 넣기
// loading 중일 때 .loader 삽입, fetch되면 .loader 제거

SearchEl.addEventListener("click", function (e) {
  e.preventDefault();
  title = inputEl.value;
  year = selectEl.value;
  if (title === "") {
    resultDiv.append(noResultEl);
    return;
  } else {
    resultDiv.innerHTML = "";
    resultDiv.append(loaderEl);
    getMovies(title, year, count, true);
  }
});

// 영화 API 받아오기

let movies = [];
let totalResults;

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
        setMovies(isFirst);
      } else {
        noResultEl.textContent = `"${title}"을 포함하는 영화가 없습니다.`;
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
    const imgEl = document.createElement("img");
    const infoEl = document.createElement("div");
    const titleEl = document.createElement("h2");
    const yearEl = document.createElement("span");
    const typeEl = document.createElement("span");
    imgEl.src =
      movie.Poster === "N/A" ? require("/images/no_images.png") : movie.Poster;
    imgEl.alt = movie.Title;
    titleEl.textContent = movie.Title;
    yearEl.textContent = movie.Year;
    yearEl.classList.add("year");
    typeEl.classList.add(movie.Type === "movie" ? "type-movie" : "type-series");
    typeEl.textContent = movie.Type;
    infoEl.append(titleEl, yearEl, typeEl);
    liEl.append(imgEl, infoEl);

    return liEl;
  });

  if (isFirst) {
    resultDiv.innerHTML = "";
    moviesEl.innerHTML = "";
  }

  moviesEl.append(...liEls);
  resultDiv.append(totalEl, moviesEl);
}

// 더보기 버튼 클릭시 데이터 더 불러오기
const moreBtn = document.querySelector(".more");
const noMoreEl = document.createElement("p");
noMoreEl.textContent = "더 이상의 검색 결과가 없습니다!";
noMoreEl.classList.add("no-more");

moreBtn.addEventListener("click", function (e) {
  e.preventDefault();
  count += 1;
  if (count > movies.length / 10 + 1) {
    resultDiv.append(noMoreEl);
    return;
  } else {
    getMovies(title, year, count, false);
    return count;
  }
});

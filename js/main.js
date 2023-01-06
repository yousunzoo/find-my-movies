// 페이지 접속 시 배너 클래스 추가
const bannerEl = document.querySelector(".banner");

window.onload = function () {
  bannerEl.classList.add("loaded");
};

// select 옵션에 현재 연도로부터 50년 이전까지 연도 별 option 넣기
const yearsEl = document.querySelector("#years");
const year = new Date().getFullYear();

for (let i = year; i >= year - 50; i--) {
  let yearEl = document.createElement("option");
  yearEl.value = i;
  yearEl.textContent = i;
  yearsEl.appendChild(yearEl);
}

const inputEl = document.querySelector("input");
const selectEl = document.querySelector("select");
const SearchEl = document.querySelector(".search__btn");

// search 버튼 누르면 inputEl, selectEl value 가져와서 getMovies에 넣기
SearchEl.addEventListener("click", function (e) {
  e.preventDefault();
  const title = inputEl.value;
  const year = selectEl.value;
  getMovies(title, year, true);
});

// 영화 API 받아오기

let movies = [];
let totalResults;

async function getMovies(title, year, isFirst) {
  const s = `&s=${title}`;
  const y = year === "All Years" ? "" : `&y=${year}`;
  await fetch(`https://www.omdbapi.com/?apikey=d2f6bdf1${s}${y}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.Response === "True") {
        movies = data.Search;
        totalResults = data.totalResults;
        setMovies(isFirst);
      }
      return data.Error;
    });
}

// 받아온 JSON 데이터 출력
const resultDiv = document.querySelector(".result");
const totalEl = document.createElement("p");
totalEl.classList.add("total");

const moviesEl = document.createElement("ul");
moviesEl.classList.add("movie-list");

function setMovies(isFirst) {
  totalEl.innerHTML = `총 <span>${totalResults}</span>개의 검색결과가 있습니다.`;

  const liEls = movies.map((movie) => {
    const liEl = document.createElement("li");
    const imgEl = document.createElement("img");
    const infoEl = document.createElement("div");
    const titleEl = document.createElement("h2");
    const yearEl = document.createElement("span");
    const typeEl = document.createElement("span");
    console.log(movie.Poster);
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
  }

  resultDiv.append(totalEl, moviesEl);
  moviesEl.append(...liEls);
}

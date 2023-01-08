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
let getData;
let title, year;
const loaderEl = document.createElement("div");
loaderEl.classList.add("loader");
const noResultEl = document.createElement("p");
noResultEl.classList.add("no-result");
noResultEl.textContent = "검색 키워드를 입력해주세요!";
const moreBtn = document.createElement("button");
moreBtn.classList.add("more");
moreBtn.textContent = "더보기";

SearchEl.addEventListener("click", async function (e) {
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
    await getMovies(title, year, count, true);
    if (getData.Response === "True" && totalPages > 1) {
      count++;
      getMovies(title, year, count, false);
    }
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
        getData = data;
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
    liEl.dataset.id = movie.imdbID;
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
  resultDiv.append(totalEl, moviesEl);
  if (totalPages > 1) {
    resultDiv.append(moreBtn);
  }
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

// 카드 클릭했을 때 모달창 등장 및 document scoll 처리
const body = document.querySelector("body");
const modalWrapper = document.createElement("div");
modalWrapper.id = "modal";
const modalEl = document.createElement("div");
modalEl.classList.add("modal-container");

function popup() {
  const cardEl = moviesEl.querySelectorAll("li");

  for (let i = 0; i < cardEl.length; i++) {
    cardEl[i].addEventListener("click", (e) => {
      const movieId = cardEl[i].dataset.id;

      e.preventDefault();

      modalEl.innerHTML = "";
      modalEl.append(loaderEl);
      modalWrapper.append(modalEl);
      wrap.append(modalWrapper);
      body.classList.add("stop-scrolling");

      getMovieInfo(movieId);
    });
  }
  modalWrapper.addEventListener("click", function () {
    wrap.removeChild(modalWrapper);
    body.classList.remove("stop-scrolling");
  });
}

async function getMovieInfo(movieId) {
  await fetch(`https://omdbapi.com/?apikey=7035c60c&i=${movieId}&plot=full`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setMovieInfo(data);
    });
}

function setMovieInfo(movie) {
  // 이미지 고해상도 출력
  const background = document.createElement("div");
  const url =
    movie.Poster === "N/A"
      ? require("/images/no_images.png")
      : movie.Poster.replace("X300", "X640");

  const infoInnerEl = document.createElement("div");
  const imgEl = document.createElement("img");
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

  innerLEl.classList.add("inner-left");
  innerREl.classList.add("inner-right");
  background.classList.add("background");
  infoInnerEl.classList.add("info-inner");
  infoListEl.classList.add("info-list");
  genreListEl.classList.add("genre-list");
  plotEl.classList.add("plot");
  rateEl.classList.add("rate");
  castEl.classList.add("cast");

  imgEl.src = url;
  h2El.textContent = movie.Title;
  yearEl.textContent = movie.Year;
  timeEl.textContent = movie.Runtime.replace("min", "minutes");
  directorEl.textContent = movie.Director;
  genreListEl.textContent = movie.Genre;
  plotEl.textContent = movie.Plot === "N/A" ? "" : movie.Plot;
  rateEl.innerHTML = `<span>&#9733;</span> ${movie.imdbRating}`;
  castEl.innerHTML = `<h3>Casts</h3><p>${movie.Actors}</p>`;
  innerLEl.append(imgEl);
  infoListEl.append(yearEl, timeEl, directorEl);
  innerREl.append(h2El, infoListEl, genreListEl, rateEl, plotEl, castEl);

  infoInnerEl.append(innerLEl, innerREl);

  modalEl.innerHTML = "";
  modalEl.append(background, infoInnerEl);
}

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
const detectorEl = document.createElement("div");
detectorEl.classList.add("scroll-detecting");
resultDiv.append(detectorEl);

let count = 1;
let getData;
let title, year;
const loaderDiv = document.createElement("div");
const loaderEl = document.createElement("div");
loaderDiv.classList.add("loader-container");
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
    loaderDiv.append(loaderEl);
    resultDiv.append(loaderDiv);
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
        totalPages = Math.ceil(totalResults / 10);
        setMovies(isFirst, data);
        getData = data;
      } else if (isFirst === true) {
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
  // resultDiv.removeChild(detectorEl);
  moviesEl.append(...liEls);
  resultDiv.append(totalEl, moviesEl, detectorEl);
  popup();

  const detector = document.querySelector(".scroll-detecting");

  const io = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.intersectionRatio > 0)) {
      count++;

      getMovies(title, year, count, false);
      return count;
    }
  });

  io.observe(detector);
}

// intersectionObserver로 무한 스크롤 구현

/** 더보기 버튼 클릭시 데이터 더 불러오기
 *     const noMoreEl = document.createElement("p");
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
 */

// 카드 클릭했을 때 모달창 등장 및 document scoll 처리, to-top 버튼 숨김
const body = document.querySelector("body");
const modalWrapper = document.createElement("div");
const modalOverlayEl = document.createElement("div");
const modalEl = document.createElement("div");

modalWrapper.id = "modal";
modalEl.classList.add("modal-container");
modalOverlayEl.classList.add("modal-overlay");

function popup() {
  const cardEl = moviesEl.querySelectorAll("li");

  for (let i = 0; i < cardEl.length; i++) {
    cardEl[i].addEventListener("click", (e) => {
      const movieId = cardEl[i].dataset.id;

      e.preventDefault();

      modalEl.innerHTML = "";
      modalEl.append(loaderEl);
      modalWrapper.append(modalOverlayEl, modalEl);
      wrap.append(modalWrapper);
      body.classList.add("stop-scrolling");
      toTopEl.classList.add("hide");
      getMovieInfo(movieId);
    });
  }

  // 모달 창 밖 영역 클릭하면 모달창 꺼지게 하기
  modalOverlayEl.addEventListener("click", function () {
    wrap.removeChild(modalWrapper);
    body.classList.remove("stop-scrolling");
    toTopEl.classList.remove("hide");
  });

  // esc 버튼 누르면 모달창 꺼지게 하기
  window.addEventListener("keyup", function (e) {
    if (e.key === "Escape") {
      wrap.removeChild(modalWrapper);
      body.classList.remove("stop-scrolling");
      toTopEl.classList.remove("hide");
    }
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

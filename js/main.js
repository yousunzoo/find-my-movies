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

// search 버튼 누르면 API 받아오기

const inputEl = document.querySelector("input");
const selectEl = document.querySelector("select");
const SearchEl = document.querySelector(".search__btn");
SearchEl.addEventListener("click", function (e) {
  e.preventDefault();
});

// 영화 API 받아오기
async function getMovies(title, year) {
  const s = `$s=${title}`;
  const y = `$y=${year}`;
  await fetch(`https://omdbapi.com/?apikey=7035c60c${s}${y}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => console.log(data));
}

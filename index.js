/*
 * Author: Apache X692 Attack Helicopter
 * Created on: 19/06/2024
 */
const quoteHtml = `<div class="border bg-body m-3 p-3 rounded shadow-sm">
  <div class="d-flex align-items-top">
    <div class="text-secondary" style="font-size: 70px; line-height: 0.8; margin-right: 5px;">
      “
    </div>
    <h4>%QUOTE%</h4>
  </div>
  <div class="text-end">
    <em>&nbsp;－ %AUTHOR%</em>
  </div>
</div>`

const url = "https://dummyjson.com/quotes"
const limit = 20;

let skip = 200;
let storedData = [];

let contentWrapperElement = document.getElementById("content");
let footerMessageElement = document.getElementById("footer-message");

function isBottomOfPage() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    return scrollTop + clientHeight >= scrollHeight - 5;
}

async function getData() {
    try {
        var request = await fetch(`${url}?limit=${limit}&skip=${skip}`);

        if (!request.ok) {
            throw new Error();
        }

        const data = await request.json();
        return data;
    } catch (error) {
        console.error(error);
        footerMessageElement.innerText = "A network error occured while fetching the data.";
        throw error;
    }
}

async function displayData(jsonData) {
    for (index = 0; index < limit; index++) {
        const quote = jsonData["quotes"][index]["quote"];
        const author = jsonData["quotes"][index]["author"];

        contentWrapperElement.innerHTML += quoteHtml
            .replace("%QUOTE%", quote)
            .replace("%AUTHOR%", author);
        storedData.push(jsonData["quotes"][index]);
    }
    console.log(storedData);
    skip += limit;
}

function handleScroll() {
    if (isBottomOfPage()) {
        const jsonData = await getData();

        displayData(jsonData);
    }
}


function setTheme() {
    const isDarkThemePreferred = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    document.documentElement.setAttribute(
        "data-bs-theme", isDarkThemePreferred ? "dark" : "light"
    );
    document.body.className = "bg-" + (isDarkThemePreferred ? "black" : "light");
}

setTheme();
window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", setTheme);

displayData(await getData());
window.addEventListener("scroll", handleScroll);

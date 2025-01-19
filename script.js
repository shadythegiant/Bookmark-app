"use strict";
const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

//

let bookmarks = [];

// functions
// --------------------------

// basic functionality

function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

function closeModal() {
  modal.classList.remove("show-modal");
}
// --------------
// validate form
function validate(nameValue, urlValue) {
  const expression =
    /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address.");
    return false;
  }
  // Valid
  return true;
}

//
// Build Bookmarks
function buildBookmarks() {
  // Remove all bookmark elements
  bookmarksContainer.textContent = "";
  // Build items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Delete Bookmark
function deleteBookmark(url) {
  // Loop through the bookmarks array
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmark", JSON.stringify(bookmarks));
  fetchBookmarks();
}
// fetch bookmarks from local storage
function fetchBookmarks() {
  // get bookmarks if available in localstorage

  if (localStorage.getItem("bookmark")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmark"));
  } else {
    bookmarks = [
      {
        name: "css tricks",
        url: "https://css-tricks.com/snippets/css/complete-guide-grid/ ",
      },
    ];

    localStorage.setItem("bookmark", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}
// store form data

function storeFormData(e) {
  e.preventDefault();
  const name = websiteNameEl.value;
  let url = websiteUrlEl.value;

  if (!url.includes("http://", "https://")) {
    url = `https://${url}`;
  }

  // Validate
  if (!validate(name, url)) {
    return false;
  }

  //

  const bookmark = {
    name: name,
    url: url,
  };

  bookmarks.push(bookmark);
  localStorage.setItem("bookmark", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
  console.log(bookmarks);
}

// Event Listeners
// ----------------------------

modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) =>
  e.target === modal ? closeModal() : false
);

bookmarkForm.addEventListener("submit", storeFormData);

// on load

fetchBookmarks();

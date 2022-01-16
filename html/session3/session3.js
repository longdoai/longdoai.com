window.onscroll = function () {
  var scrollY = this.scrollY;
  var pageTitle = document.querySelector(".page-title");
  if (scrollY > 100) {
    if (!pageTitle.classList.contains("active")) {
      pageTitle.classList.add("active");
    }
  } else {
    pageTitle.classList.remove("active");
  }
};

var anchors = document.querySelectorAll('.page-title a[href]');

anchors.forEach(anchor => {
    var element = document.querySelector(anchor.getAttribute('href'));
    anchor.onclick = (e) => {
        e.preventDefault();
        window.scrollTo(0, element.offsetTop - 150)
    }
})

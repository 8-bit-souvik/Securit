
window.onload = function () {
    let linkLog = document.querySelector(".link-log")
    let linkID = document.querySelector(".link-ID")
  
    if (document.querySelector(".name").innerText) {
        linkLog.style.display = "none";
        linkID.style.display = "";
 
    }

    if (screen.width < "770") {
        document.querySelector("#toggle-box").style.display = "none"
    }

  };

  document.querySelector(".navbar-toggle").addEventListener("click", () => {
      if (document.querySelector("#toggle-box").style.display == "none") {
        document.querySelector("#toggle-box").style.display = ""
      } else {
        document.querySelector("#toggle-box").style.display = "none"
      }
  })
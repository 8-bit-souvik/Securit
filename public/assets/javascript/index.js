
window.onload = function () {
    let linkLog = document.querySelector(".link-log")
    let linkID = document.querySelector(".link-ID")
  
   var active = document.cookie.split(';')
   active = active[0].split('=');
    if (active[1]) {
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
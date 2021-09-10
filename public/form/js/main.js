
function sPwd() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
    document.querySelector(".sPwd").src = "./../public/form/images/eye-solid.svg"
  } else {
    x.type = "password";
    document.querySelector(".sPwd").src = "./../public/form/images/eye-slash-solid.svg"
  }
}



window.onload = function () {
  let registerform = document.querySelector("#register-form")
  let otpform = document.querySelector("#otp-form")

 var active = document.cookie.split(';')
 active = active[1].split('=');
  if (active[1] == 0) {
    registerform.style.display = "none";
    otpform.style.display = "";
  }
};

document.querySelector("#otp").addEventListener("focus", () => {
  document.querySelector("#otp").type="number"
})

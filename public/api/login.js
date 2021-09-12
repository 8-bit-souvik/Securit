var user = {
  login: function() {
      let username = document.querySelector("#username").value
      let password = document.querySelector("#password").value
      fetch("user/signin", {
        "method": "POST",
        "headers": {
            "key": "12345",
            "content-type": "application/json"
        },
        "body": JSON.stringify({
           username: username,
           password: password
        })
    })
    .then((Response) => {
        console.log();
        if (Response.status == 200) {
            window.location.href = '/home'
        } else {
            return Response.json();
        }
    })
    .then((getData) => {
        var alertMsg = document.querySelector("#alert-msg");
        alertMsg.innerText = getData.msg;
        console.log(getData);
    }).catch((err) => {
          console.log(err);
      });
  }
}

document.querySelector("#submit").addEventListener("click", (e) => {
    e.preventDefault()
    document.querySelector("#alert-msg").innerHTML = " <div class='loader'></div>";
    user.login()
});

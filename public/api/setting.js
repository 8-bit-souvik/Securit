var user = {
    update: function () {
        let name = document.querySelector("#name").value
        let email = document.querySelector("#email").value
        let password = document.querySelector("#password-input").value
        // let newPassword = document.querySelector("#password").value
        fetch("user/update", {
            "method": "PUT",
            "headers": {
                "key": "12345",
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                name: name,
                email: email,
                password: password,
                //  newPassword: newPassword
            })
        })
            .then((Response) => {
                console.log();
                if (Response.status == 200) {
                    window.location.href = '/setting'
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
    },

    logout: function () {
        fetch("user/signout/all", {
            "method": "POST"
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

document.querySelector("#submit-changes").addEventListener("click", (e) => {
    e.preventDefault()
    //   document.querySelector("#alert-msg").innerHTML = " <div class='loader'></div>";
    user.update()
});

document.querySelector("#logout-from-all-devices").addEventListener("click", (e) => {
    e.preventDefault()
    user.logout()
});

var user = {
    signup: function () {
        let username = document.querySelector("#userID").value
        let uname = document.querySelector("#name").value
        let email = document.querySelector("#email").value
        let password = document.querySelector("#password").value
        //   console.log(username);
        //   console.log(password);
        fetch("user/signup", {
            "method": "POST",
            "headers": {
                "key": "12345",
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                username: username,
                password: password,
                email: email,
                uname: uname
            })
        })
            .then((Response) => {
                if (Response.status == 200) {
                    window.location.href = '/register'
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

    otpSubmit: function () {
        let otp = document.querySelector("#otp").value

        fetch("user/otp/activate", {
            "method": "POST",
            "headers": {
                "key": "12345",
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                userOTP: otp
            })
        })
            .then((Response) => {
                console.log();
                if (Response.status === 200) {
                    window.location.href = '/home'
                } else {
                    return Response.json();
                }
            })
            .then((getData) => {
                var alertMsg2 = document.querySelector("#alert-msg2");
                alertMsg2.innerText = getData.msg;
            }).catch((err) => {
                console.log(err);
            });
    },

    otpResend: function () {
        fetch("user/otp/resend", {
            "method": "POST",
            "headers": {
                "key": "12345",
                "content-type": "application/json"
            },
        })
            .then((Response) => {
                console.log();
                return Response.json();
            })
            .then((getData) => {
                document.querySelector("#alert-msg2").innerHTML = getData.msg;
            }).catch((err) => {
                console.log(err);
            });
    },

    logout: function () {
        fetch("user/signout", {
            "method": "GET"
        })
            .then((Response) => {
                console.log();
                return Response.json();
            })
            .then((getData) => {
                window.location.href = '/'
            }).catch((err) => {
                console.log(err);
                window.location.href = '/'
            });
    }
}

document.querySelector("#data-submit").addEventListener("click", (e) => {
    e.preventDefault()
    user.signup()
    document.querySelector("#alert-msg").innerHTML = " <div class='loader'></div>";
});


document.querySelector("#otp-submit").addEventListener("click", (e) => {
    e.preventDefault()
    document.querySelector("#alert-msg2").innerHTML = " <div class='loader'></div>";
    user.otpSubmit()
});


document.querySelector("#otp-resend").addEventListener("click", (e) => {
    e.preventDefault()
    document.querySelector("#alert-msg2").innerHTML = " <div class='loader'></div>";
    user.otpResend()
});

document.querySelector("#logout").addEventListener("click", (e) => {
    e.preventDefault()
    document.querySelector("#alert-msg2").innerHTML = " <div class='loader'></div>";
    user.logout()
})

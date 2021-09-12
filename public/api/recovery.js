window.onload = () => {
    var identityForm = document.querySelector("#identity-form");
    var recoveryForm = document.querySelector("#recovery-form");

    var active = document.cookie.split(';')
    active = active[0].split('=');
    if (active[0] == 'OTPauthorization') {
        console.log(active[0]);
        identityForm.style.display = "none";
        recoveryForm.style.display = "";
    } else {
        console.log(active[0]);
        identityForm.style.display = "";
        recoveryForm.style.display = "none";
    }

}


var recover = {
    sendEmail: () => {
        var userID = document.querySelector("#userID").value;
        var recOTP = document.querySelector("#recOTP").value;
        fetch("user/forgetpassword/otp/request", {
            "method": "POST",
            "headers": {
                "key": "12345",
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                username: userID
            })
        })
            .then((response) => {
                console.log(response);

                var userID = document.querySelector("#userID");
                var OTPfield = document.querySelector("#OTP-field");
                var alertMsg = document.querySelector("#alert-msg");
                var IDsubmit = document.querySelector("#ID-submit");

                if (response.status == 200) {
                    OTPfield.style.display = ""
                    IDsubmit.style.display = "none"
                    userID.readOnly = true;
                }
                return response.json()
            })
            .then((result) => {
                var alertMsg = document.querySelector("#alert-msg");
                alertMsg.innerText = result.msg;
            })
            .catch((err) => {
                var alertMsg = document.querySelector("#alert-msg");
                alertMsg.innerText = err;
            });
    },

    sendOTP: () => {
        var userID = document.querySelector("#userID").value;
        var recOTP = document.querySelector("#recOTP").value;
        fetch("user/forgetpassword/otp/send", {
            "method": "POST",
            "headers": {
                "key": "12345",
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                username: userID,
                userOTP: parseInt(recOTP)
            })
        }).then((response) => {
            console.log(response);

            if (response.status == 200) {
                window.location.href = "/recovery"
            }
            return response.json()
        })
            .then((result) => {
                var alertMsg = document.querySelector("#alert-msg");
                alertMsg.innerText = result.msg;
            })
            .catch((err) => {
                var alertMsg = document.querySelector("#alert-msg");
                alertMsg.innerText = err;
            });
    },

    resetPassword: () => {
        var pswd1 = document.querySelector("#pswd1").value;
        var pswd2 = document.querySelector("#pswd2").value;

        if (pswd1 === pswd2) {
            fetch("user/forgetpassword/newpassword", {
                "method": "POST",
                "headers": {
                    "key": "12345",
                    "content-type": "application/json"
                },
                "body": JSON.stringify({
                    newPassword: pswd1
                })
            }).then((response) => {
                console.log(response);

                if (response.status == 200) {
                    window.location.href = "/home"
                }
                return response.json()
            })
                .then((result) => {
                    var alertMsg = document.querySelector("#alert-msg2");
                    alertMsg.innerText = result.msg;
                })
                .catch((err) => {
                    var alertMsg = document.querySelector("#alert-msg2");
                    alertMsg.innerText = err;
                });
        } else {
            document.querySelector("#alert-msg2").innerText = "password in both field must be same";
        }

    }
}


document.querySelector("#ID-submit").addEventListener("click", (e) => {
    e.preventDefault();
    var userID = document.querySelector("#userID");
    if (userID.value == "") {
        document.querySelector("#alert-msg").innerText = "please enter your email"
    } else {
        recover.sendEmail()
        document.querySelector("#alert-msg").innerHTML = " <div class='loader'></div>";
    }
})


document.querySelector("#OTP-submit").addEventListener("click", (e) => {
    e.preventDefault();
    var recOTP = document.querySelector("#recOTP");
    if (recOTP.value == "") {
        document.querySelector("#alert-msg").innerText = "please enter OTP"
    } else {
        recover.sendOTP()
        document.querySelector("#alert-msg").innerHTML = " <div class='loader'></div>";
    }
})


document.querySelector("#password-submit").addEventListener("click", (e) => {
    e.preventDefault();
    var pswd1 = document.querySelector("#pswd1");
    var alertMsg = document.querySelector("#alert-msg2");
    if (pswd1.value == "") {
        alertMsg.innerText = "please enter a new password"
    } else {
        alertMsg.innerText = "";
        document.querySelector("#alert-msg2").innerHTML = " <div class='loader'></div>";
        recover.resetPassword()
    }
})
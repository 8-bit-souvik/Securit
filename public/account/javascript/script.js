document.querySelector(".collapsible").addEventListener("click", function () {
    var navbar = document.querySelector("#nav");
    if (navbar.style.left == '0px') {
        navbar.style.left = '-225px'
        navbar.querySelector("#arrow").src = "./../public/account/icons/angle-right-solid.svg"
    } else {
        navbar.style.left = '0px'
        navbar.querySelector("#arrow").src = "./../public/account/icons/angle-left-solid.svg"
    }
})

var user = {

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

document.querySelectorAll("#logout")[0].addEventListener("click", (e) => {
    e.preventDefault()
    user.logout()
})
document.querySelectorAll("#logout")[1].addEventListener("click", (e) => {
    e.preventDefault()
    user.logout()
})
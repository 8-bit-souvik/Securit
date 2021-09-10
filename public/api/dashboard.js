
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
                window.location.href = '/login'
            }).catch((err) => {
                console.log(err);
                window.location.href = '/login'
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


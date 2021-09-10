const table = {
    changeTab: function () {
        tab = document.querySelector("#tab").children

    },

    general: function () {
        document.querySelector(".general").style.display = "flex"
        document.querySelector(".security").style.display = "none"
        document.querySelector(".service").style.display = "none"
        document.querySelector(".theme").style.display = "none"

        document.querySelector("#general").style.backgroundColor = "rgb(203, 205, 224)";
        document.querySelector("#security").style.backgroundColor = "rgb(174, 174, 211)";
        document.querySelector("#service").style.backgroundColor = "rgb(174, 174, 211)";
        document.querySelector("#theme").style.backgroundColor = "rgb(174, 174, 211)";
    },

    security: function () {
        document.querySelector(".general").style.display = "none"
        document.querySelector(".security").style.display = "flex"
        document.querySelector(".service").style.display = "none"
        document.querySelector(".theme").style.display = "none"
        
        document.querySelector("#general").style.backgroundColor = "rgb(174, 174, 211)";
        document.querySelector("#security").style.backgroundColor = "rgb(203, 205, 224)";
        document.querySelector("#service").style.backgroundColor = "rgb(174, 174, 211)";
        document.querySelector("#theme").style.backgroundColor = "rgb(174, 174, 211)";
    },

    service: function () {
        document.querySelector(".general").style.display = "none"
        document.querySelector(".security").style.display = "none"
        document.querySelector(".service").style.display = "flex"
        document.querySelector(".theme").style.display = "none"
        
        document.querySelector("#general").style.backgroundColor = "rgb(174, 174, 211)";
        document.querySelector("#security").style.backgroundColor = "rgb(174, 174, 211)";
        document.querySelector("#service").style.backgroundColor = "rgb(203, 205, 224)";
        document.querySelector("#theme").style.backgroundColor = "rgb(174, 174, 211)";
    },

    theme: function () {
        document.querySelector(".general").style.display = "none"
        document.querySelector(".security").style.display = "none"
        document.querySelector(".service").style.display = "none"
        document.querySelector(".theme").style.display = "flex"
        
        document.querySelector("#general").style.backgroundColor = "rgb(174, 174, 211)";
        document.querySelector("#security").style.backgroundColor = "rgb(174, 174, 211)";
        document.querySelector("#service").style.backgroundColor = "rgb(174, 174, 211)";
        document.querySelector("#theme").style.backgroundColor = "rgb(203, 205, 224)";
    }

}


document.querySelector("#general").addEventListener("click", function () {
    table.general()
})

document.querySelector("#security").addEventListener("click", function () {
    table.security()
})

document.querySelector("#service").addEventListener("click", function () {
    table.service()
})

document.querySelector("#theme").addEventListener("click", function () {
    table.theme()
})

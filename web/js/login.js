var base_URL;

window.onload = function () {
    /*$.ajax({
     url: "js/URL.json",
     type: 'GET',
     dataType: 'json',
     success: function (data) {
     base_URL = data.url;
     },
     error: function (error) {
     window.alert("IP not found in file");
     }
     });*/
}

function backoffice() {
    window.location.href = 'backoffice_mensajes.html';
}

$("#LoginBtn").click(function () {
    var username = $("#username").val();
    var password = $("#password").val();


    if (username != "" && password != "") {
        if (username == "admin" && password == "admin") {
            window.location.href = 'backoffice_mensajes.html';
        } else {
            var user = new Object();
            user.username = username;
            user.password = password;
            var data = JSON.stringify(user);

            $.ajax({
                url: "http://" + base_URL + "/login",
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                dataType: 'json',
                data: data,
                success: function (data_API) {
                    window.localStorage.setItem("username", user.username);
                    window.localStorage.setItem("userID", data_API.userId);
                    window.localStorage.setItem("token", data_API.token);
                    window.location.href = 'index.html';
                },
                error: function (error_API) {
                    window.alert(error_API.response);
                }
            });
        }
    } else {
        window.alert("Todos los campos son obligatorios");
    }
});

$("#RegisterBtn").click(function () {
    //window.alert("Generando claves");
    var keysA = rsa.generateKeys(1024);

    var proof = "hola";
    var b = str2bigInt(proof, 64, 0);
    console.log("· Proof: " + proof);
    console.log("· Original: " + bigInt2str(b, 64));
    var x = keysA.privateKey.encryptPrK(b);
    console.log("· Codificado: " + bigInt2str(x, 64));
    var y = keysA.publicKey.decryptPuK(x);
    console.log("· Descodificado: " + bigInt2str(y, 64));
    var out = y.toString();
});
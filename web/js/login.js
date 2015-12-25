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
    var keysUser = rsa.generateKeys(1024);
    var keysVA = rsa.generateKeys(2048);

    var publicKey = keysUser.publicKey.bits + "_" + bigInt2str(keysUser.publicKey.e, 10) + "_" + bigInt2str(keysUser.publicKey.n, 10);
    console.log("Message: " + publicKey);
    // Clave pública cegada
    var r = randTruePrime(512);
    var blindMsg = mod(mult(str2bigInt(publicKey, 64, 0), powMod(r, keysVA.publicKey.e, keysVA.publicKey.n)), keysVA.publicKey.n);
    console.log("Blind Message: " + bigInt2str(blindMsg, 64));
    // Cifrado cegado con clave privada
    var blindEnc = keysVA.privateKey.encryptPrK(blindMsg);
    console.log("Encrypted Blind Message: " + bigInt2str(blindEnc, 64));
    // Cifrado descegado
    var unblindedEnc = mult(blindEnc, inverseMod(r, keysVA.publicKey.n));
    console.log("Encrypted Message: " + bigInt2str(unblindedEnc, 64));
    // Descifrado
    var Dec = keysVA.publicKey.decryptPuK(unblindedEnc);
    console.log("Message: " + bigInt2str(Dec, 64));


    /*console.log('\n\nTesting RSA blind encryption\n');
     r = bignum.rand(keys.publicKey.n);
     var blindMsg = m.mul(r.powm(keys.publicKey.e, keys.publicKey.n)).mod(keys.publicKey.n);
     console.log('blind msg   m·r^e mod n:', '\n', blindMsg.toBuffer().toString('base64'), '\n');

     var bc = keys.privateKey.encrypt(blindMsg);
     console.log('(blind) encryption with private:', '\n', bc.toBuffer().toString('base64'), '\n');

     c = bc.mul(r.invertm(keys.publicKey.n));
     console.log('(unblinded) valid encryption    *1/r mod n:', '\n', c.toBuffer().toString('base64'), '\n');

     d = keys.publicKey.decrypt(c);
     console.log('decryption with public:', '\n', d.toBuffer().toString(), '\n');*/


    /*var proof = "hola";
     var b = str2bigInt(proof, 64, 0);
     console.log("· Proof: " + proof);
     console.log("· Original: " + bigInt2str(b, 64));
     var x = keysUser.privateKey.encryptPrK(b);
     console.log("· Codificado: " + bigInt2str(x, 64));
     var y = keysUser.publicKey.decryptPuK(x);
     console.log("· Descodificado: " + bigInt2str(y, 64));
     var out = y.toString();*/

    var k = new Object();
    k.content = bigInt2str(blindMsg, 64);
    var data = JSON.stringify(k);
    console.log(data);

    $.ajax({
        url: "http://localhost:3000/keys",
        type: 'POST',
        crossDomain: true,
        contentType: 'application/json',
        data: data,
        success: function (data_API) {
            console.log(data_API);
            console.log(data_API.publicKey);
        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
});
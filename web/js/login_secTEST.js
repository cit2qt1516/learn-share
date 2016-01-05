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
    var keysUser = rsa.generateKeys(1024);

    // Obtener identidad anonima - FIRMA CIEGA
    $.ajax({
        url: "http://localhost:3000/keys/RSA",
        type: 'GET',
        crossDomain: true,
        contentType: 'application/json',
        success: function (data_API) {
            // Kpu servidor
            var bits = data_API.split("_")[0];
            var n = data_API.split("_")[1];
            var e = data_API.split("_")[2];
            var KpuVA = new rsa.publicKey(parseInt(bits), str2bigInt(n, 10), str2bigInt(e, 10));

            // Token de la Kpu del usuario
            var publicKey = keysUser.publicKey.bits + "ABABAB" + bigInt2str(keysUser.publicKey.e, 10) + "ABABAB" + bigInt2str(keysUser.publicKey.n, 10);
            // Kpu cegada
            var r = randTruePrime(512);
            var blindMsg = mod(mult(str2bigInt(publicKey, 16, 0), powMod(r, KpuVA.e, KpuVA.n)), KpuVA.n);

            var k = new Object();
            k.content = bigInt2str(blindMsg, 16);
            var data = JSON.stringify(k);

            // Obtener token encriptado y descegar
            $.ajax({
                url: "http://localhost:3000/keys/blind1",
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                dataType: 'json',
                data: data,
                success: function (data_blindEnc) {
                    //var info = data_blindEnc.split("\"")[1];
                    var info = data_blindEnc.bc;
                    var PO = data_blindEnc.PO;
                    var kPu = data_blindEnc.kPu;
                    var user = data_blindEnc.user;
                    var blindEnc = str2bigInt(info, 16);
                    var unblindedEnc = mult(blindEnc, inverseMod(r, KpuVA.n));

                    var kPuServer = new rsa.publicKey(str2bigInt(kPu.split("_")[0], 10), str2bigInt(kPu.split("_")[1], 10), str2bigInt(kPu.split("_")[2], 10));
                    var POdec = kPuServer.decryptPuK(str2bigInt(PO, 10));
                    // Si el hash de la información y la PO desencriptada son iguales -> OK
                    if (SHA256_hash(user + info).toUpperCase() === bigInt2str(POdec, 16))
                        console.log("Step 1 Non-Repudiation -> SUCCESSFUL");
                    else
                        console.log("Step 1 Non-Repudiation -> FAILED");

                    var user2 = "david"; // CAMBIAR POR EL USERNAME DEL USUARIO ACTUAL
                    var obj = new Object();
                    obj.bc = info;
                    obj.PR = bigInt2str(keysUser.privateKey.encryptPrK(str2bigInt(SHA256_hash(user2 + info), 16)), 16);
                    obj.kPu = publicKey;
                    obj.user = user2;
                    var dat = JSON.stringify(obj);
                    $.ajax({
                        url: "http://localhost:3000/keys/NR",
                        type: 'POST',
                        crossDomain: true,
                        contentType: 'application/json',
                        dataType: 'json',
                        data: dat,
                        success: function (NR) {
                            var r = NR.r;
                            var PO = NR.PO;
                            var kPu = NR.kPu;
                            var user = NR.user;

                            var kPuServer = new rsa.publicKey(str2bigInt(kPu.split("_")[0], 10), str2bigInt(kPu.split("_")[1], 10), str2bigInt(kPu.split("_")[2], 10));
                            var POdec = kPuServer.decryptPuK(str2bigInt(PO, 10));
                            if (SHA256_hash(user + r).toUpperCase() === bigInt2str(POdec, 16))
                                console.log("Step 3 Non-Repudiation -> SUCCESSFUL");
                            else
                                console.log("Step 3 Non-Repudiation -> FAILED");

                            var user2 = "david"; // CAMBIAR POR EL USERNAME DEL USUARIO ACTUAL
                            var obj = new Object();
                            obj.r = r;
                            obj.PR = bigInt2str(keysUser.privateKey.encryptPrK(str2bigInt(SHA256_hash(user2 + r), 16)), 16);
                            obj.kPu = publicKey;
                            obj.user = user2;
                            var dat = JSON.stringify(obj);

                            $.ajax({
                                url: "http://localhost:3000/keys/NRend",
                                type: 'POST',
                                crossDomain: true,
                                contentType: 'application/json',
                                dataType: 'json',
                                data: dat,
                                success: function (NR) {
                                    console.log(NR);

                                    // Encriptar voto con Kpu (Paillier) de la mesa
                                    $.ajax({
                                        url: "http://localhost:3000/keys/Paillier",
                                        type: 'GET',
                                        crossDomain: true,
                                        contentType: 'application/json',
                                        success: function (data_API1) {
                                            // Kpu servidor
                                            var bits = data_API1.split("_")[0];
                                            var n = data_API1.split("_")[1];
                                            var n2 = data_API1.split("_")[2];
                                            var g = data_API1.split("_")[3];
                                            var KpuM = new paillier._publicKey(parseInt(bits), str2bigInt(n, 10), str2bigInt(n2, 10), str2bigInt(g, 10));

                                            // Votar
                                            $.ajax({
                                                url: "http://localhost:3000/teacher/juan",
                                                type: 'GET',
                                                crossDomain: true,
                                                dataType: "json",
                                                contentType: 'application/json',
                                                success: function (data) {
                                                    var teacher = data;
                                                    var id = teacher.id;
                                                    console.log("ID profesor: " + id);
                                                    var v = Math.pow(2, (id * 6));
                                                    var vPaillier = KpuM.encrypt(v.toString());

                                                    var r = vPaillier.r;
                                                    var sign = keysUser.privateKey.encryptPrK(r);
                                                    var sign1 = keysUser.publicKey.decryptPuK(sign);

                                                    var vote = new Object();
                                                    vote.voteC = bigInt2str(vPaillier.c, 10);
                                                    vote.voteR = bigInt2str(vPaillier.r, 10);
                                                    vote.sign = bigInt2str(sign, 10);
                                                    vote.token = bigInt2str(unblindedEnc, 16);
                                                    var data1 = JSON.stringify(vote);

                                                    $.ajax({
                                                        url: "http://localhost:3000/votes",
                                                        type: 'POST',
                                                        crossDomain: true,
                                                        contentType: 'application/json',
                                                        data: data1,
                                                        success: function (data2) {
                                                            console.log(data2);
                                                        },
                                                        error: function () {
                                                            window.alert("NO FUNCIONA");
                                                        }
                                                    });
                                                },
                                                error: function () {
                                                    window.alert("NO FUNCIONA");
                                                }
                                            });
                                        },
                                        error: function () {
                                            window.alert("NO FUNCIONA");
                                        }
                                    });
                                },
                                error: function () {
                                    window.alert("NO FUNCIONA");
                                }
                            });
                        },
                        error: function () {
                            window.alert("NO FUNCIONA");
                        }
                    });
                },
                error: function () {
                    window.alert("NO FUNCIONA");
                }
            });
        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
});

$("#RegisterBtn").click(function () {
    /*var keysUser = rsa.generateKeys(1024);
     var keysVA = rsa.generateKeys(2048);
     var publicKey = keysUser.publicKey.bits + "ABABAB" + bigInt2str(keysUser.publicKey.e, 10) + "ABABAB" + bigInt2str(keysUser.publicKey.n, 10);
     console.log("Message: " + publicKey);
     // Clave pública cegada
     var r = randTruePrime(512);
     var blindMsg = mod(mult(str2bigInt(publicKey, 16, 0), powMod(r, keysVA.publicKey.e, keysVA.publicKey.n)), keysVA.publicKey.n);
     console.log("Blind Message: " + bigInt2str(blindMsg, 16));
     // Cifrado cegado con clave privada
     var blindEnc = keysVA.privateKey.encryptPrK(blindMsg);
     console.log("Encrypted Blind Message: " + bigInt2str(blindEnc, 16));
     // Cifrado descegado
     var unblindedEnc = mult(blindEnc, inverseMod(r, keysVA.publicKey.n));
     console.log("Encrypted Message: " + bigInt2str(unblindedEnc, 16));
     // Descifrado
     var Dec = keysVA.publicKey.decryptPuK(unblindedEnc);
     console.log("Message: " + bigInt2str(Dec, 16));*/


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

    var keysUser = rsa.generateKeys(1024);

    $.ajax({
        url: "http://localhost:3000/keys/RSA",
        type: 'GET',
        crossDomain: true,
        contentType: 'application/json',
        success: function (data_API) {
            // Kpu servidor
            var bits = data_API.split("_")[0];
            var n = data_API.split("_")[1];
            var e = data_API.split("_")[2];
            var KpuVA = new rsa.publicKey(parseInt(bits), str2bigInt(n, 10), str2bigInt(e, 10));

            // Token de la Kpu del usuario
            var publicKey = keysUser.publicKey.bits + "ABABAB" + bigInt2str(keysUser.publicKey.e, 10) + "ABABAB" + bigInt2str(keysUser.publicKey.n, 10);
            // Kpu cegada
            var r = randTruePrime(512);
            var blindMsg = mod(mult(str2bigInt(publicKey, 16, 0), powMod(r, KpuVA.e, KpuVA.n)), KpuVA.n);

            var k = new Object();
            k.content = bigInt2str(blindMsg, 16);
            var data = JSON.stringify(k);

            $.ajax({
                url: "http://localhost:3000/keys/blind1",
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json',
                data: data,
                success: function (data_blindEnc) {
                    var info = data_blindEnc.split("\"")[1];
                    var blindEnc = str2bigInt(info, 16);
                    var unblindedEnc = mult(blindEnc, inverseMod(r, KpuVA.n));

                    var obj = new Object();
                    obj.content = bigInt2str(unblindedEnc, 16);
                    var data1 = JSON.stringify(obj);

                    $.ajax({
                        url: "http://localhost:3000/keys/blind2",
                        type: 'POST',
                        crossDomain: true,
                        contentType: 'application/json',
                        data: data1,
                        success: function (data_blindEnc) {
                            console.log(data_blindEnc);
                        },
                        error: function () {
                            window.alert("NO FUNCIONA");
                        }
                    });
                },
                error: function () {
                    window.alert("NO FUNCIONA");
                }
            });
        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
});
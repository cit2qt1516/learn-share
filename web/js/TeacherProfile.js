function getProfile() {
    //TODO poner las cookies bien para jugar
    document.cookie = "teacherUsername=juan"

    // GET
    $.ajax({
        url: "http://localhost:3000/teacher/" + getCookie("teacherUsername"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            $("#user_profile").text('');

            $('<h3> <strong> Nombre: </strong>' + data.name + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Username: </strong>' + data.username + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Email: </strong>' + data.email + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Asignaturas: </strong>' + data.subjects + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Votos: </strong>' + data.votes + '</h3>').appendTo($('#teacher_profile'));

        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });

    $.ajax({
        url: "http://localhost:3000/comments/" + getCookie("teacherUsername"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            $('<hr>').appendTo($('#teacher_profile'));
            $('<h2> <strong> COMENTARIOS </strong>').appendTo($('#teacher_profile'));

            for (var i = 0; i < data.length; i++) {
                $('<h3> <strong>' + data[i].student + '</strong> ' + data[i].time + '</h2>').appendTo($('#teacher_profile'));
                $('<p>' + data[i].content + '</p>').appendTo($('#teacher_profile'));

            }
        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
}

function postComment() {
    var k = new Object();
    k.content = $('#comment').val();
    k.student = "david";
    k.teacher = "juan"
    var data = JSON.stringify(k);

    $.ajax({
        url: "http://localhost:3000/comments",
        type: 'POST',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        data: data,
        success: function (data) {
            location.reload();
        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
}

function vote() {
    var keysUser = new Object;

    $.ajax({
        url: "http://localhost:3000/keys/david", // CAMBIAR POR EL USERNAME DEL USUARIO ACTUAL
        type: 'GET',
        crossDomain: true,
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            if (data === "The user does not have a key") {
                keysUser = rsa.generateKeys(1024);

                var k = new Object();
                k.bits = keysUser.publicKey.bits;
                k.n = bigInt2str(keysUser.publicKey.n, 10);
                k.e = bigInt2str(keysUser.publicKey.e, 10);
                k.p = bigInt2str(keysUser.privateKey.p, 10);
                k.q = bigInt2str(keysUser.privateKey.q, 10);
                k.d = bigInt2str(keysUser.privateKey.d, 10);
                var d = JSON.stringify(k);

                $.ajax({
                    url: "http://localhost:3000/keys/david", // CAMBIAR POR EL USERNAME DEL USUARIO ACTUAL
                    type: 'POST',
                    crossDomain: true,
                    contentType: 'application/json',
                    dataType: 'json',
                    data: d,
                    success: function (data) {
                        console.log(data);
                    },
                    error: function () {
                        window.alert("Error al guardar la clave");
                    }
                });
            } else {
                console.log("Ya tiene clave");
                var bits = data.bits;
                var n = str2bigInt(data.n, 10);
                var e = str2bigInt(data.e, 10);
                var p = str2bigInt(data.p, 10);
                var q = str2bigInt(data.q, 10);
                var d = str2bigInt(data.d, 10);
                keysUser.publicKey = new rsa.publicKey(bits, n, e);
                keysUser.privateKey = new rsa.privateKey(p, q, d, keysUser.publicKey);
                console.log("0 -> " + keysUser);
            }

            console.log("0 -> " + keysUser);

            // Obtener identidad anonima - FIRMA CIEGA
            $.ajax({
                url: "http://localhost:3000/keys/RSA",
                type: 'GET',
                crossDomain: true,
                contentType: 'application/json',
                success: function (data_API) {

                    console.log("1 -> " + keysUser);
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
                                                        url: "http://localhost:3000/teacher/raquel",
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

        },
        error: function () {
            window.alert("Error en la obtención de claves del usuario");
        }
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        {
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            {
            }
        }
    }
    return "";
}
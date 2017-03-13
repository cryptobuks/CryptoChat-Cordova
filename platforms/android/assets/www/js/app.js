window.fn = {};
var configuration;
var tsmPhone;
var socket;
var username;
var password;
var ringSound = new Audio('sounds/ring.mp3');
var session;
var remoteAudio = new window.Audio();
socket = new JsSIP.WebSocketInterface('wss://webrtc.sipmeeting.com:443');
var isStarted = 0;
var startTime = 0;
var isReadyInt = 0;
document.addEventListener("deviceready", onDeviceReady, false);
var content = document.querySelector('ons-splitter-content');

document.addEventListener('init', function(event) {
    var page = event.target;
    if (page.id == "ringout") {
        $('#callTo').html("Calling: " + localStorage.getItem("calling"));
    }
    if (page.id == "ring") {
        $('#callFrom').html("Calling: " + localStorage.getItem("calling"));
    }
});

function onDeviceReady() {
    window.screen.orientation.lock('portrait');
    var permissions = cordova.plugins.permissions;
    permissions.requestPermission(permissions.MODIFY_AUDIO_SETTINGS, null, null);
    permissions.requestPermission(permissions.RECORD_AUDIO, null, null);
    permissions.requestPermission(permissions.CAMERA, null, null);
}

window.fn.open = function() {
    var menu = document.getElementById('menu');
    menu.open();
};

window.fn.load = function(page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page)
        .then(menu.close.bind(menu));
};

function showLogin() {
    var loginModal = document.getElementById('loginModal');
    loginModal.show();
    createAccountModal.hide();
}

function createAccount() {
    var loginModal = document.getElementById('loginModal');
    loginModal.hide();
    var createAccountModal = document.getElementById('createAccountModal');
    createAccountModal.show();
}


$(document).ready(function() {
    if (localStorage.getItem("accountInfo") === "undefined") {
        loginModal.show();
        return;
    } else if (localStorage.getItem("accountInfo") === "undefined") {
        loginModal.show();
        return;
    }
    if (!localStorage.getItem("accountInfo")) {
        loginModal.show();
        return;
    } else if (!localStorage.getItem("accountInfo")) {
        loginModal.show();
        return;
    }
    login();
});

function login() {
    $("#loginError").hide();
    if ($("#username").val() != "") {
        username = $("#username").val();
        password = $("#password").val();
    } else {
        if (JSON.parse(localStorage.getItem("accountInfo")).username !== undefined) {
            username = JSON.parse(localStorage.getItem("accountInfo")).username;
            password = JSON.parse(localStorage.getItem("accountInfo")).password;
        } else {
            username = "";
            password = "";
        }
    }
    if (username != "" && password != "") {
        var configuration = {
            sockets: [socket],
            uri: 'sip:' + username + '@webrtc.sipmeeting.com',
            password: password
        };
        var smPhone = new JsSIP.UA(configuration);
        started(smPhone);
        tsmPhone = smPhone;
        smPhone.stop();
        smPhone.start();
    } else {
        $("#loginError").html("<br />Invalid Username Or Password");
        $("#loginError").show();
    }
}

function started(smPhone) {
    isStarted = 1;
    smPhone.on('registrationFailed', function(e) {
        localStorage.setItem("accountInfo", '');
        loginModal.show();
    });

    smPhone.on('registered', function(e) {
        localStorage.setItem("accountInfo", '{"username" : "' + username + '","password" : "' + password + '", "txtPassword" : "' + password + '"}');
        loginModal.hide();
        createAccountModal.hide();
    });

    smPhone.on('unregistered', function(e) {});

    smPhone.on('connected', function(e) {});

    smPhone.on('disconnected', function(e) {});

    smPhone.on('progress', function(e) {});

    smPhone.on('newRTCSession', function(e) {
        session = e.session;
        newCall(session);
    });
}

function logout() {
    localStorage.setItem("accountInfo", "");
    var menu = document.getElementById('menu');
    menu.close();
    username = $("#username").val("");
    password = $("#password").val("");
    tsmPhone.unregister();
    loginModal.show();
}

function callNow() {
    var who = $("#userToCall").val();
    if (who != "") {
        var eventHandlers = {
            'progress': function(e) {
                console.log('call is in progress');
                console.log(e);
            },
            'failed': function(e) {
                var content = document.querySelector('ons-splitter-content');
                content.load('home.html');
            },
            'ended': function(e) {
                var content = document.querySelector('ons-splitter-content');
                content.load('home.html');
            },
            'confirmed': function(e) {
                console.log('call confirmed');
            },
        };

        var options = {
            'eventHandlers': eventHandlers,
            'mediaConstraints': {
                'audio': true,
                'video': false
            }
        };
        session = tsmPhone.call('sip:' + who + '@webrtc.sipmeeting.com', options);
    }
}

function newCall(session) {
    if (session.direction == "outgoing") {
        var content = document.querySelector('ons-splitter-content');
        content.load('ringout.html');
        localStorage.setItem("calling", $('#userToCall').val());
        //$( '#callTo' ).html($( '#userToCall').val());
    }
    session.on("accepted", function(e) {
        console.log("Confirmed");
        console.log(e);
    });
    session.on("addstream", function(e) {
        remoteAudio.src = window.URL.createObjectURL(e.stream);
        remoteAudio.play();
        AudioToggle.setAudioMode(AudioToggle.NORMAL);
    });
    session.on("progress", function() {
        if (session.direction == "incoming") {
            console.log("PROGRESS!!!!!!");
            var content = document.querySelector('ons-splitter-content');
            content.load('ring.html');
            console.log("^^^^^^^^^^^^^^^^^^^^^^^");
            console.log(session);
            console.log(session.remote_identity.uri.user);
            localStorage.setItem("calling", session.remote_identity.uri.user);
        }

        //ring();
        navigator.proximity.enableSensor();
    });
    session.on("accepted", function(e) {
        var content = document.querySelector('ons-splitter-content');
        content.load('answer.html');
        //ring();
    });
    session.on("failed", function() {
        console.log("Failed");
        if (session.direction == "incoming") {
            var content = document.querySelector('ons-splitter-content');
            content.load('home.html');
        }
        navigator.proximity.disableSensor();
    });
    session.on("ended", function() {
        console.log("Ended");
        if (session.direction == "incoming") {
            var content = document.querySelector('ons-splitter-content');
            content.load('home.html');
        }
        navigator.proximity.disableSensor();
    });
}
/*
function ring() {
    ringSound.play();
}

function stopRing() {
    ringSound.pause();
    ringSound.currentTime = 0;
}
*/


function createAccountNow() {
    var userName = $("#crtusername").val();
    var password1 = $("#crtpassword1").val();
    var password2 = $("#crtpassword2").val();
    $("#createError").hide();
    if (password1.trim() == "") {
        $("#createError").html("<br />Your Password Cannot Be Blank");
        $("#createError").show();
        return;
    }
    if (password1 != password2) {
        $("#createError").html("<br />Your Passwords Do Not Match");
        $("#createError").show();
        return;
    }
    $.ajax({
        url: "https://webrtc.sipmeeting.com:80/api.php",
        type: 'POST',
        contentType: 'application/json',
        data: '{"command": "createAccount", "userName" : "' + userName + '", "password" : "' + password1 + '"}',
        success: function(data) {
            data = JSON.parse(data);
            if (data.error > 0) {
                $("#createError").html("<br />" + data.errormsg);
                $("#createError").show();
                return;
            }
            if (data.error == 0) {
                localStorage.setItem("accountInfo", '{"username" : "' + userName + '","password" : "' + password1 + '", "txtPassword" : "' + password1 + '"}');
                $("#createError").hide();
                username = userName;
                txtpassword = password1;
                login();
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function answerCall() {
    var callOptions = {
        mediaConstraints: {
            audio: true,
            video: false
        }
    };
    session.answer(callOptions);
    var content = document.querySelector('ons-splitter-content');
    content.load('answer.html');
    var d = new Date();
    var startTime = Math.round(d.getTime() / 1000);
}


function cancelCall() {
    session.terminate();
}

function endCall() {
    session.terminate();
}

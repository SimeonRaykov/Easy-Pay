$(function () {
    if (localStorage.getItem('username')) {
        notification('success', 'Welcome Back');

        setTimeout(function () {
            location.href = '../html/table.html';
        }, 350);
    }
});

let loginEvent = (function () {
    $('body > div > form > input[type=button]:nth-child(4)').on('click', () => {
        let username = $('body > div > form > input[type=text]:nth-child(2)').val();
        let password = $('body > div > form > input[type=password]:nth-child(3)').val();
        loginUser(username, password);
    });
})();

function loginUser(username, password) {

    $.ajax({
        type: "POST",
        url: 'http://192.168.1.107/datavend/api.php',
        data: {
            mode: 'login',
            username,
            password
        },
        dataType: "json",
        success: function (data, textStatus) {
            callback(data);
        },
        error: () => {
            notification('error');
        }
    });
};

function callback(data) {

    if (data['status'] === 'success') {
        notification('success', 'Login successful');
        let currUser = $('body > div > form > input[type=text]:nth-child(2)').val();
        localStorage.setItem('username', currUser);
        setTimeout(function () {
            location.href = '../html/table.html';
        }, 350);
    } else if (data['status'] === 'error') {
        notification('error', data['data']);
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
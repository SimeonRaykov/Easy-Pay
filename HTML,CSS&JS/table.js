;
(function getInvoices() {

    $.ajax({
        url: 'http://192.168.1.107/datavend/api.php',
        method: 'POST',
        dataType: 'json',
        data: {
            mode: 'list',
            date_from: '10.11.2019'
        },
        success: function (data) {
            let i = 0;
            console.log(data)
            for (let el in data) {
                i += 1;
                let currRow = $('<tr>').attr('role', 'row');
                if (i % 2 == 0) {
                    currRow.addClass('even');
                } else {
                    currRow.addClass('odd');
                }
                currRow
                    .append($('<td>' + data[el]['DOCUMENT_NUMBER'] + '</td>'))
                    .append($('<td>' + data[el]['DOCUMENT_DATE'] + '</td>'))
                    .append($('<td>' + data[el]['CLIENT_NAME'] + '</td>'))
                    .append($('<td>' + data[el]['CLIENT_ADDRESS'] + '</td>'))
                    .append($('<td>' + data[el]['DOCUMENT_NUMBER'] + ('</td>'))
                        .append($('</tr>')));
                currRow.appendTo($('#tBody'));
            }
            $('#myTable').DataTable();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })
}());

(function logOffEvent() {
    $('#logOffBtn').on('click', () => {
        //TODO
        //  loginNotification('success', 'Logout Successful');

        setTimeout(function () {
            location.href = 'file:///C:/Users/suppo/Desktop/Table%20Easy%20Pay/git/login.html';
        }, 350);

        localStorage.removeItem('username');
    })
}());

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
;

(function getInvoicesByDate() {
    let date_from = $('body > main > div > form > div:nth-child(1) > input[type=date]').val();
    let to_date = $('body > main > div > form > div:nth-child(2) > input[type=date]').val();

    if (date_from == '' && to_date == '') {
        (function setDefaultDates() {
            let currDate = new Date();
            let currDay = currDate.getDate();
            if (currDay < 10) {
                currDay = `0${currDay}`;
            }
            $('body > main > div > form > div:nth-child(1) > input[type=date]').val(`${currDate.getFullYear()}-${currDate.getMonth()}-01`);
            $('body > main > div > form > div:nth-child(2) > input[type=date]').val(`${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDay}`);
            getInvoices();

        }());
    }

}());

function getInvoices() {

    let url = location.href;
    let date_from = url.substring(url.indexOf('?') + 11);
    date_from = date_from.substring(0, 10);

    let to_date = url.substring(url.indexOf('?') + 30);

    let defaultVal = false;

    // Check default dates
    let currDate = new Date();

    if (date_from.includes('/')) {
        date_from = `01-${currDate.getMonth()}-${currDate.getFullYear()}`;
        $('body > main > div > form > div:nth-child(1) > input[type=date]').val(`${currDate.getFullYear()}-${currDate.getMonth()}-01`);
        defaultVal = true;
    } else if (to_date.includes('/')) {
        to_date = `${currDate.getDate()}-${currDate.getMonth()+1}-${currDate.getFullYear()}`;
        $('body > main > div > form > div:nth-child(2) > input[type=date]').val(`${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()}`);
        defaultVal = true;
    }

    $.ajax({
        url: 'http://192.168.1.107/datavend/api.php',
        method: 'POST',
        dataType: 'json',
        data: {
            mode: 'list',
            date_from,
            to_date
        },
        success: function (data) {
            callback(data);
            if (!defaultVal) {
                fixVisualData();
            }
            defaultVal = false;
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })
};

function callback(data) {
    let i = 0;

    for (let el in data) {
        let numberDoc = data[el]['DOCUMENT_NUMBER'];
        i += 1;
        let currRow = $('<tr>').attr('role', 'row');
        if (i % 2 == 0) {
            currRow.addClass('even');
        } else {
            currRow.addClass('odd');
        }
        currRow

            .append($('<td>' + truncateZeroes(numberDoc) + '</td>'))
            .append($('<td>' + data[el]['DOCUMENT_DATE'] + '</td>'))
            .append($('<td>' + data[el]['CLIENT_NAME'] + '</td>'))
            .append($('<td>' + data[el]['CLIENT_ADDRESS'] + '</td>'))
            .append($('<td><a href="detail.html?offerNum=' + truncateZeroes(numberDoc) + '"><button type="button" class="btn btn-success">Детайли</button></a></td>'))
            .append($('<td><button type="button" class="btn btn-warning">Издаване</button></td>'))
            .append($('</tr>'));
        currRow.appendTo($('#tBody'));
    }
    $('#myTable').DataTable();
}

function fixVisualData() {
    let url = location.href;
    let date_from = url.substring(url.indexOf('?') + 11);
    date_from = date_from.substring(0, 10);

    let to_date = url.substring(url.indexOf('?') + 30);

    $('body > main > div > form > div:nth-child(1) > input[type=date]').val(date_from);
    $('body > main > div > form > div:nth-child(2) > input[type=date]').val(to_date);

}

(function logOffEvent() {
    $('#logOffBtn').on('click', () => {

        setTimeout(function () {
            location.href = 'file:///C:/Users/suppo/Desktop/Table%20Easy%20Pay/git/html/login.html';
        }, 350);
        notification('success', 'Logout Successful');
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

function truncateZeroes(number) {
    let a = number.replace(/(\.[0-9]*?)0+$/, "$1");
    return a.replace(/\.$/, "");
}
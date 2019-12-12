;
(function getInvoicesByDate() {
    let date_from = $('body > main > div > form > div:nth-child(1) > input[type=date]').val();
    let to_date = $('body > main > div > form > div:nth-child(2) > input[type=date]').val();

    if (date_from == '' || to_date == '') {
        (function setDefaultDates() {
            let currDate = new Date();
            let currDay = currDate.getDate();
            if (currDay < 10) {
                currDay = `0${currDay}`;
            }

            let currMonth = currDate.getMonth() + 1;
            if (currMonth < 10) {
                currMonth = `0${currMonth}`;
            }
            $('body > main > div > form > div:nth-child(1) > input[type=date]').val(`${currDate.getFullYear()}-${currDate.getMonth()}-01`);
            $('body > main > div > form > div:nth-child(2) > input[type=date]').val(`${currDate.getFullYear()}-${currMonth}-${currDay}`);
            getInvoices();

        }());
    }

}());

function getInvoices() {
    loading();
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
    }

    if (to_date.includes('le')) {
        to_date = `${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()}`;
        //    $('body > main > div > form > div:nth-child(2) > input[type=date]').val(`${currDate.getFullYear()}-${currDate.getDate()}-0${currDate.getMonth()+1}`);
        defaultVal = true;
    }

    $.ajax({
        url: 'http://192.168.1.107/datavend/api.php',
        method: 'POST',
        dataType: 'json',
        data: {
            mode: 'list',
            date_from,
            date_to: to_date
        },
        success: function (data) {
            callback(data);
            clearNotification();
            if (!defaultVal) {
                fixVisualData();
            } else {
                defaultVal = false;
            }

        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })
};

function callback(data) {
    let i = 0;
    let loaded = false;

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
            .append($(`<td><button type="button" class="btn btn-warning publishNum" data-toggle="modal" data-id="${truncateZeroes(numberDoc)}" data-target="#exampleModalCenter">Издаване</button></td>`))
            .append($('</tr>'));
        currRow.appendTo($('#tBody'));

    }
    $('#myTable').DataTable();
}

function validateData(data) {
    getEasyPayCodeVisual(data.data['pay_code']);
    console.log(data);
    if (data.status === 'success') {
        notification('success', 'Everything good');
    } else if (data.status === 'error') {
        getEasyPayCodeVisual(data.data['pay_code']);
        notification('error', data['message']);
    }
}

function loading() {
    notification('info', 'Loading...');
}

function getEasyPayCodeVisual(easyPayCode) {
    $('#exampleModalLongTitle').text(`Вашият номер за плащане е: ${easyPayCode}`);
}

(function postEmailEvent() {
    $('#exampleModalCenter > div > div > div.modal-footer > button.btn.btn-warning').on('click', (e) => sendEmailToDB());
}());

function sendEmailToDB() {

    let email = $('#exampleModalCenter > div > div > div.modal-body > div > input').val();

    $.ajax({
        url: 'http://192.168.1.107/datavend/api.php',
        method: 'POST',
        dataType: 'json',
        data: {
            mode: 'generateAndSave',
            email: email
        },
        success: function (data) {},
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
};

$(document).ready(function () {

    $('#exampleModalCenter').on('shown.bs.modal', function (event) {
        loading();
        let triggerElement = $(event.relatedTarget); // Button that triggered the modal
        let dataID = triggerElement['0'].getAttribute('data-id');
        GenerateEasyPayCode(dataID);
    });

});

function GenerateEasyPayCode(offerNum) {
    $.ajax({
        type: "POST",
        url: 'http://192.168.1.107/datavend/api.php',
        data: {
            mode: 'listDetails',
            offerNum: offerNum
        },
        dataType: "json",
        success: function (data, textStatus) {
            CalcCode(data);
        },
        error: () => {
            notification('error');
        }
    });

    function CalcCode(data) {

        const KIN = 'D128375091';
        const key = '3UH9ZJ2VO2PCRTX0C9QXJHYLSGZB05W3P937PZDNUO8LTTFV6JGXPF4X8K0N3DDX';

        let DOCUMENT_NUMBER = data['DOCUMENT_NUMBER'];
        let DOCUMENT_SUM = data['SUM'];

        let EXP_DATE = new Date();
        EXP_DATE.setDate(EXP_DATE.getDate() + 7);

        let requestString = `MIN=${KIN}\nINVOICE=${truncateZeroes(DOCUMENT_NUMBER)}\nAMOUNT=${truncateZeroes(DOCUMENT_SUM)}\nEXP_TIME=${EXP_DATE.getDate()}.${EXP_DATE.getMonth()+1}.${EXP_DATE.getFullYear()}\nMERCHANT=Дейтавенд ООД\nIBAN=12345\nBIC=54321\nPSTATEMENT=testStatement\nSTATEMENT=testDescription\nOBLIG_PERSON=${data['CLIENT_NAME']}\nBULSTAT=${data['BULSTAT']}\nDOC_NO=${truncateZeroes(DOCUMENT_NUMBER)}\nDOC_DATE=${data['DOCUMENT_DATE']}\nDATA_BEGIN=123\nDATA_END=123`;
        const Encoded64String = window.btoa(unescape(encodeURIComponent(requestString)));

        // const hash1 = CryptoJS.SHA1(requestString);
        const hash = CryptoJS.HmacSHA1(Encoded64String, key);
        const hmacHashed = hash.toString(CryptoJS.enc.Hex);

        //Connect to PHP api
        $.ajax({
            url: 'http://192.168.1.107/datavend/api.php',
            method: 'POST',
            dataType: 'json',
            data: {
                mode: 'generateAndSave',
                document_number: truncateZeroes(DOCUMENT_NUMBER),
                encoded: Encoded64String,
                checksum: hmacHashed
            },
            success: function (data) {
                validateData(data);
            },
            error: function (jqXhr, textStatus, errorThrown) {
                notification('error', errorThrown);
                $('#exampleModalLongTitle').text('Error');
            }
        });
    }
}

(function fixVisualsOnModal() {

    $(document.body).click(function () {
        clearNotification();
        clearEasyPayMsg();
    });
}());

function clearEasyPayMsg() {
    if (!($('#exampleModalCenter').is(':visible'))) {
        $('#exampleModalLongTitle').text('Вашият номер за плащане е: ');
    }
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
            location.href = '../html/login.html';
        }, 350);
        notification('success', 'Logout Successful');
        localStorage.removeItem('username');
    })
}());

function clearNotification() {
    toastr.clear();
}

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
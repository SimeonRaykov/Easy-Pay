$(document).ready(function () {
    $("#exampleModalCenter").on("hidden.bs.modal", function () {
        location.reload();
    });

    $('body > header > div:nth-child(1) > div.row > button.btn.btn-warning.offset-md-3').on('click', () => {
        $('#myModal').modal('show');
        loading();
        // let triggerElement = $(event.relatedTarget); // Button that triggered the modal
        let dataID = getUrlParameter('offerNum');
        GenerateEasyPayCode(dataID);
    })
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

function getEasyPayCodeVisual(easyPayCode) {
    $('#exampleModalLongTitle').text(`Вашият номер за плащане е: ${easyPayCode}`);
}

function changeIssueBtnText(paymentIssue) {
    if (paymentIssue == 0) {
        $('body > header > div:nth-child(1) > div.row > button.btn.btn-warning.offset-md-3').text('Виж още');
    }
};

function validateData(data) {
    getEasyPayCodeVisual(data.data['pay_code']);
    if (data.status === 'success') {
        notification('success', 'Everything good');
    } else if (data.status === 'error') {
        getEasyPayCodeVisual(data.data['pay_code']);
        notification('error', data['message']);
    }
}

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

(function fixVisualsOnModal() {
    $(document.body).click(function () {
        clearNotification();
        clearEasyPayMsg();
    });
}());

function writeEmailInput() {
    let email = $('body > header > div:nth-child(1) > div.row > button.btn.btn-warning.offset-md-3').attr('data-email');
    $('#exampleModalCenter > div > div > div.modal-body > div > input').val(email);
}

(function logOffEvent() {
    $('#logOffBtn').on('click', () => {

        notification('success', 'Logout Successful');
        setTimeout(function () {
            window.location.href = '../html/login.html';
        }, 350);

        localStorage.removeItem('username');
    })
}());

(function detailsEvent() {
    $('#goBackBtn').on('click', () => {
        notification('info', 'Loading..');
        setTimeout(function () {
            location.href = '../html/table.html';
        }, 350);
    })
}());

(function getDetails() {
    notification('info', 'Loading..');
    let url = location.href;
    let offerNum = url.substring(url.indexOf('?') + 10);

    $.ajax({
        type: "POST",
        url: 'http://192.168.1.107/datavend/api.php',
        data: {
            mode: 'listDetails',
            offerNum
        },
        dataType: "json",
        success: function (data, textStatus) {
            callback(data);
            writeEmailInput();
            clearNotification();
        },
        error: () => {
            notification('error');
        }
    });
}());

function callback(data) {
    let DOCUMENT_NUMBER = data['DOCUMENT_NUMBER'];
    DOCUMENT_NUMBER = (+DOCUMENT_NUMBER).toFixed(0);
    changeIssueBtnText(data.payment_issued, data.EMAIL);
    $('body > header > div:nth-child(1) > div.row > button.btn.btn-warning.offset-md-3').attr('data-email', data.EMAIL);

    let DOCUMENT_SUM = data['SUM'];
    $('body > header > div:nth-child(1) > div > div:nth-child(1) > input').val(truncateZeroes(DOCUMENT_NUMBER));
    $('body > header > div:nth-child(1) > div > div:nth-child(2) > input').val(data['DOCUMENT_DATE']);
    $('body > header > div:nth-child(1) > div > div:nth-child(3) > input').val(data['CLIENT_NAME']);
    $('body > header > div:nth-child(1) > div > div:nth-child(4) > input').val(data['CLIENT_ADDRESS']);
    $('body > header > div:nth-child(1) > div > div:nth-child(5) > input').val(data['PAYMENT_DUE']);
    $('body > header > div:nth-child(1) > div > div:nth-child(6) > input').val(truncateZeroes(DOCUMENT_SUM));

    let i = 1;
    for (let item of data['items']) {
        let currRow = $('<tr>').attr('role', 'row');

        if (i % 2 == 0) {
            currRow.addClass('even');
        } else {
            currRow.addClass('odd');
        }
        currRow
            .append($('<td>' + (item['ITEM_NAME']) + '</td>'))
            .append($('<td>' + truncateZeroes(item['ITEM_NUMBER']) + '</td>'))
            .append($('<td>' + (item['ITEM_DESCRIPTION']) + '</td>'))
            .append($('<td>' + truncateZeroes(item['ITEM_PRICE']) + '</td>'))
            .append($('<td>' + truncateZeroes(item['ITEM_QTY']) + '</td>'))
            .append($('<td>' + truncateZeroes(item['ITEM_TOTAL']) + '</td>'))
            .append($('</tr>'));
        currRow.appendTo($('#table_details'));
    }

    $('#table_details').DataTable();

}

function truncateZeroes(number) {
    let a = number.replace(/(\.[0-9]*?)0+$/, "$1");
    return a.replace(/\.$/, "");
}


function loading() {
    notification('info', 'Loading...');
}

function clearNotification() {
    toastr.clear();
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
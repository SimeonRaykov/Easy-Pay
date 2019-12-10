(function logOffEvent() {
    $('#logOffBtn').on('click', () => {

        notification('success', 'Logout Successful');
        setTimeout(function () {
            window.location.href = 'file:///C:/Users/suppo/Desktop/Table%20Easy%20Pay/git/html/login.html';
        }, 350);

        localStorage.removeItem('username');
    })
}());

(function detailsEvent() {
    $('#goBackBtn').on('click', () => {
        notification('info', 'Loading..');
        setTimeout(function () {
            location.href = 'file:///C:/Users/suppo/Desktop/Table%20Easy%20Pay/git/html/table.html';
        }, 350);
    })
}())

(function getDetails() {

    let url = location.href;
    let offerNum = url.substring(url.indexOf('?') + 10);

    $.ajax({
        type: "POST",
        url: 'http://192.168.1.107/datavend/api.php',
        data: {
            mode: 'listDetails',
            offerNum: offerNum
        },
        dataType: "json",
        success: function (data, textStatus) {
            callback(data);
        },
        error: () => {
            notification('error');
        }
    });
}());

function callback(data) {
    let DOCUMENT_NUMBER = data['DOCUMENT_NUMBER'];
    DOCUMENT_NUMBER = (+DOCUMENT_NUMBER).toFixed(0);

    let DOCUMENT_SUM = data['SUM'];
    $('body > header > div:nth-child(1) > div > div:nth-child(1) > input').val(truncateZeroes(DOCUMENT_NUMBER));
    $('body > header > div:nth-child(1) > div > div:nth-child(2) > input').val(data['DOCUMENT_DATE']);
    $('body > header > div:nth-child(1) > div > div:nth-child(3) > input').val(data['CLIENT_NAME']);
    $('body > header > div:nth-child(1) > div > div:nth-child(4) > input').val(data['CLIENT_ADDRESS']);
    $('body > header > div:nth-child(1) > div > div:nth-child(5) > input').val(data['PAYMENT_DUE']);
    $('body > header > div:nth-child(1) > div > div:nth-child(6) > input').val(truncateZeroes(DOCUMENT_SUM));
    console.log(data);

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
(function logOffEvent() {
    $('#logOffBtn').on('click', () => {

        notification('success', 'Logout Successful');
        notification('info', 'Loading..');
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
        location.href = 'file:///C:/Users/suppo/Desktop/Table%20Easy%20Pay/git/html/table.html?date_from=&date_to=';
    }, 350);
    })
}())
;
(function () {
  registerBtnEvent();

  if (localStorage.getItem('username')) {

    notification('success', 'Welcome Back');

    setTimeout(function () {
      location.href = '../html/table.html';
    }, 350);
  }
}());


function registerUser(username, password) {
  $.ajax({
    type: "POST",
    url: 'http://192.168.1.107/datavend/api.php',
    data: {
      mode: 'register',
      username,
      password
    },
    dataType: "json",
    success: function (data, textStatus) {
      callback(data, textStatus);
    },
    error: () => {
      notification('error');
    }
  });
};

function registerBtnEvent() {
  $('body > div > form > input[type=button]:nth-child(5)').on('click', function () {
    let username = $('body > div > form > input[type=text]:nth-child(2)').val();
    let password = $('body > div > form > input[type=password]:nth-child(3)').val();
    let confirmPass = $('body > div > form > input[type=password]:nth-child(4)').val();
    validateForm(username, password, confirmPass);
    registerUser(username, password);
  })
};

function callback(data) {
  if (data['status'] === 'success') {
    notification('success', 'Register successful');

    let currUser = $('body > div > form > input[type=text]:nth-child(2)').val();
    localStorage.setItem('username', currUser);
    setTimeout(function () {
      location.href = '../html/table.html';
    }, 350);
  } else if (data['status'] === 'error') {
    notification('error', data['data']);
  }
}

function validateForm(u, p1, p2) {

  if (p1 != p2) {
    alert('Passwords do not match');
    throw new Error("Passwords do not match, try to register again.");
  }

  if (u == '' || p1 == '' || p2 == '') {
    alert('Invalid input');
    throw new Error('Invalid input');
  }


  if (u.length < 3) {
    alert('Username must be at least 3 characters');
    throw new Error('Username must be at least 3 characters');
  }

  if (p1.length < 3) {
    alert('Password must be at least 3 characters');
    throw new Error('Password must be at least 3 characters');
  }
}
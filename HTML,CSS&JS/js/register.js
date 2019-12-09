;
(function () {
  registerBtnEvent();

  if (localStorage.getItem('username')) {

     notification('success', 'Welcome Back');

    setTimeout(function () {
      location.href = 'file:///C:/Users/suppo/Desktop/Table%20Easy%20Pay/git/html/table.html?date_from=&date_to=';
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
      callback();
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
    validateForm(password, confirmPass);
    registerUser(username, password);
  })
};

function callback() {

  notification('success', 'Register successful');

  let currUser = $('body > div > form > input[type=text]:nth-child(2)').val();
  localStorage.setItem('username', currUser);
  setTimeout(function () {
    location.href = 'file:///C:/Users/suppo/Desktop/Table%20Easy%20Pay/git/html/table.html';
  }, 350);

}

function validateForm(p1, p2) {

  //TODO
  //Add more validations

  if (p1 != p2) {
    alert('Passwords do not match');
    throw new Error("Passwords do not match, try to register again.");
  }
}
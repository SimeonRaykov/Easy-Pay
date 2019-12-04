;
$('body > div > form > input[type=button]:nth-child(5)').on("click",validateForm);

function validateForm() {
  if($('input[type=password]:nth-child(3)').val() !=
   $('input[type=password]:nth-child(4)').val()){
    alert('Passwords do not match');
  }
}



 function notification(type, msg) {

     toastr.options = {
         "closeButton": false,
         "debug": false,
         "newestOnTop": false,
         "progressBar": false,
         "positionClass": "toast-top-right",
         "preventDuplicates": false,
         "onclick": null,
         "showDuration": "1000",
         "hideDuration": "1000",
         "timeOut": "0",
         "extendedTimeOut": "0",
         "showEasing": "swing",
         "hideEasing": "linear",
         "showMethod": "fadeIn",
         "hideMethod": "fadeOut"
     }

     if (type === 'success') {
         toastr.success(msg);
     } else if (type === 'error') {
         toastr.error(msg);
     } else if (type == 'info') {
         toastr.options['positionClass'] = 'toast-top-left';
         toastr.info(msg);
     }
 };
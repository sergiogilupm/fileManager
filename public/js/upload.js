$( document ).ready(function() {
    var fileList = [];
    $('#selectedFiles').hide();
    disableUploadButton();
});

$('.selection-btn').on('click', function (){
    $('#upload-input').click();
});

$('.upload-btn').on('click', function (){
    var files = $('#upload-input').get(0).files;
    //var files = fileList;
    var numberOfFiles = files.length === 1 ? "1 file" : files.length + " files";
    var accepted = confirm(numberOfFiles + " will be uploaded. Do you want to proceed?");
    if (accepted) {
      $('.progress-bar').text('0%');
      $('.progress-bar').width('0%');
      uploadFiles(files);
    }
});

function disableUploadButton() {
  $('#fileUploadBtn').attr("disabled", "disabled");
}

function uploadFiles(files) {
  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    formData.append('uploads[]', file, file.name);
  }

  $.ajax({
    url: '/upload',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(data) {
        console.log('Update success' + data);
            disableUploadButton();
    },
    xhr: function() {
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', function(evt) {
        if (evt.lengthComputable) {
          // calculate the percentage of upload completed
          var percentComplete = evt.loaded / evt.total;
          percentComplete = parseInt(percentComplete * 100);

          // update the Bootstrap progress bar with the new percentage
          $('.progress-bar').text(percentComplete + '%');
          $('.progress-bar').width(percentComplete + '%');

          // once the upload reaches 100%, set the progress bar text to done
          if (percentComplete === 100) {
            $('.progress-bar').html('Upload completed');
          }
        }
      }, false);
      return xhr;
    }
  });
}

function clearSelectedFiles() {
  $('#selectedFiles div').remove();
  $('#selectedFiles').append('<div>');
  $('#selectedFiles').hide();
  disableUploadButton();
}

$('#upload-input').on('change', function(){
  clearSelectedFiles();
  var files = $(this).get(0).files;
  if (files.length > 0){
    $('#selectedFiles').show();
    for (var i = 0; i < files.length; i++) {
      let file = files[i];
      let fileIcon = '<small><span class="glyphicon glyphicon-open-file"/></small>';
      let newFile = '<div>' + fileIcon + file.name +'</div>';
      $('#selectedFiles').append(newFile);
    }
    $('#fileUploadBtn').removeAttr("disabled");
  }
});

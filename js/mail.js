
function getUserData() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_json.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText;

    return hostipInfo;
}

function sendMail() {
    $.ajax({
      type: 'POST',
      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
      data: {
        'key': 'h-SzYgBzRMi41kQRFAoqrw',
        'message': {
          'from_email': 'lbittencs@gmail.com',
          'to': [
              {
                'email': 'lbittencs@gmail.com',
                'name': 'Lucas',
                'type': 'to'
              }
            ],
          'autotext': 'true',
          'subject': 'Alguém visitou!!!',
          'html': getUserData()
        }
      }
     }).done(function(response) {
       console.log(response); // if you're into that sorta thing
     });
}

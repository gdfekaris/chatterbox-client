$(document).ready(function () {
  $.ajax({
    url: `http://parse.rpt.hackreactor.com/chatterbox/classes/messages`,
    type: `GET`,
    error: function () {
      $('#chats').html('<p>An error has occurred</p>');
    },
    dataType: 'json',
    success: function (data) {
      console.log(data);
      let rooms = {};

      for (var i = data.results.length - 1; i >= 0; i--) {
        var $message = $(`<div class="chat ${data.results[i].roomname}">`).html(
          `<span class="username">${data.results[i].username}:</span>
            <span class="messageText">${data.results[i].text}</span>`
        );
        if (!rooms[data.results[i].roomname]) {
          rooms[data.results[i].roomname] = data.results[i].roomname;
        }
        $('#chats').append($message);
      }

      for (var key in rooms) {
        var $option = $(`<option>${rooms[key]}</option>`);
        $('#dropDown').append($option);
      }

      $('.username').on('click', function () {
        console.log(`added friend!`);
      });
    }
  });
});

$(document).on('change', '#dropDown', function () {
  var $selected = $(`#dropDown option:selected`);
  var $selectedText = $selected.text();
  // console.log($selectedText);
});

/* post to chat button/functionality */
$(document).on('click', '.postButton', function () {
  let $text = $('#textField').val();
  let userName = window.location.search.slice(10);
  let roomName = $(`#dropDown option:selected`).text();

  var message = {
    username: userName,
    text: $text,
    roomname: roomName
  };

  $.ajax({
    type: "POST",
    url: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      data['username'] = message.username;
      data['roomname'] = message.roomname;
      data['text'] = message.text;
      console.log('chatterbox: Message sent');
      //console.log('success function input data:', data);
      console.log('results:', results);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });

  // console.log(message)
  $('#textField').val('');
});


// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function(data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function(data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message', data);
//   }
// }); // YOUR CODE HERE:

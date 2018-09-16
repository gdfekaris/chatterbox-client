$(document).ready(function() {
  $.ajax({
    url: `http://parse.rpt.hackreactor.com/chatterbox/classes/messages?order=-createdAt&limit=250`,
    type: `GET`,
    error: function() {
      $('#chats').html('<p>An error has occurred</p>');
    },
    dataType: 'json',
    success: function(data) {
      console.log(data);
      let rooms = {};
      for (var i = 0; i < data.results.length; i++) {
        if (
          !xssTest(data.results[i].text) &&
          !xssTest(data.results[i].roomname) &&
          !xssTest(data.results[i].username)
        ) {
          var $message = $(
            `<div class="chat ${data.results[i].roomname} ${
              data.results[i].username
            }">`
          ).html(`<span class="username">${data.results[i].username}:</span>
            <span class="messageText">${data.results[i].text}</span>`);
          if (!rooms[data.results[i].roomname]) {
            rooms[data.results[i].roomname] = data.results[i].roomname;
          }

          $('#chats').append($message);
        }
      }

      for (var key in rooms) {
        var $option = $(`<option>${rooms[key]}</option>`);
        $('#dropDown').append($option);
      }
    }
  });
});

/* XSS attack test --> returns true if the string is evil */
function xssTest(str) {
  if (str) {
    return str.startsWith('<') || str.startsWith('&') || str.startsWith(' ');
  } else {
    return false;
  }
}

/* Drop Down Menu functionality */
$(document).on('change', '#dropDown', function() {
  var $selected = $(`#dropDown option:selected`);
  var $selectedText = $selected.text();

  if ($selectedText === 'Create New Room') {
    $('.createRoomField').css('visibility', 'visible');
    $('.createRoomButton').css('visibility', 'visible');
  } else if ($selectedText === 'All Rooms') {
    $('.chat').show();
    var toDo = 'do something';
  } else {
    $('.chat').hide();
    $(`.${$selectedText}`).show();
  }
});

/* Create new room functionality */
$(document).on('click', '.createRoomButton', function() {
  const newRoomText = $('.newRoom').val();
  const newRoom = `<option>${newRoomText}</option>`;
  $('#dropDown').append(newRoom);
  $('.newRoom').val('');
  $('.createRoomField').css('visibility', 'hidden');
  $('.createRoomButton').css('visibility', 'hidden');
});

const usernameFormatter = function(string) {
  let result = string.slice(10);
  let regex = /%20/gi;
  if (result.includes('%20')) {
    return result.replace(regex, ' ');
  }
  return result;
};

/* Post to chat functionality */
$(document).on('click', '.postButton', function() {
  let $text = $('#textField').val();
  let userName = usernameFormatter(window.location.search);
  let roomName = $(`#dropDown option:selected`).text();

  var message = {
    username: userName,
    text: $text,
    roomname: roomName
  };
  console.log(userName);

  $.ajax({
    type: 'POST',
    url: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      data['username'] = message.username;
      data['roomname'] = message.roomname;
      data['text'] = message.text;
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
  $('#textField').val('');
});

/* "Adding friend" functionality */
$(document).on('click', '.username', function() {
  console.log(`added friend!`);
});

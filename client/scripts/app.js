const App = function() {
  this.server =
    'http://parse.rpt.hackreactor.com/chatterbox/classes/messages?order=-createdAt&limit=250';
};

App.prototype.init = function() {
  $.ajax({
    url: this.server,
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
          const roomClass = classFormatter(data.results[i].roomname);
          const nameClass = classFormatter(data.results[i].username);
          var $message = $(`<div class="chat ${roomClass} ${nameClass}">`)
            .html(`<span class="username ${nameClass}">${
            data.results[i].username
          }:</span>
              <span class="messageText">${data.results[i].text}</span>`);
          if (!rooms[data.results[i].roomname]) {
            rooms[data.results[i].roomname] = data.results[i].roomname;
          }

          $('#chats').append($message);
        }
      }

      for (var key in rooms) {
        var $option = $(`<option>${rooms[key]}</option>`);
        $('#roomSelect').append($option);
      }
    }
  });
};

App.prototype.send = function(message) {
  $.ajax({
    type: 'POST',
    url: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.fetch = function() {
  $.ajax({
    url: this.server,
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
        $('#roomSelect').append($option);
      }
    }
  });
};

App.prototype.clearMessages = function() {
  $('#chats').empty();
};

App.prototype.renderMessage = function() {
  let $text = $('#textField').val();
  let userName = usernameFormatter(window.location.search);
  let roomName = $(`#roomSelect option:selected`).text();

  var $message = $(`<div class="chat ${roomName} ${userName}">`)
    .html(`<span class="username">${userName}:</span>
      <span class="messageText">${$text}</span>`);

  $('#chats').prepend($message);

  var message = {
    username: userName,
    text: $text,
    roomname: roomName
  };

  this.send(message);
};

App.prototype.renderRoom = function(newRoomText) {
  const newRoom = `<option>${newRoomText}</option>`;
  $('#roomSelect').prepend(newRoom);
};

App.prototype.handleSubmit = function() {
  app.renderMessage();
};

App.prototype.handleUsernameClick = function() {};

$(document).ready(function() {
  app.init();
});

let app = new App();

/* XSS attack test --> returns true if the string is evil */
function xssTest(str) {
  if (str) {
    return str.includes('<') || str.startsWith('&') || str.startsWith(' ');
  } else {
    return false;
  }
}

/* Drop Down Menu functionality */
$(document).on('change', '#roomSelect', function() {
  var $selected = $(`#roomSelect option:selected`);
  var $selectedText = $selected.text();
  const newRoomClass = classFormatter($selectedText);
  const roomClassFinal = charEscaper(newRoomClass);
  if ($selectedText === 'Create New Room') {
    $('.createRoomField').css('visibility', 'visible');
    $('.createRoomButton').css('visibility', 'visible');
  } else if ($selectedText === 'All Rooms') {
    $('.chat').show();
    var toDo = 'do something';
  } else {
    $('.chat').hide();
    $(`.${roomClassFinal}`).show();
  }
});

/* Create new room functionality */
$(document).on('click', '.createRoomButton', function() {
  const newRoomText = $('.newRoom').val();
  app.renderRoom(newRoomText);
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

function classFormatter(string) {
  let result;
  let regex = / /gi;
  if (string) {
    result = string;
  } else {
    return;
  }
  if (result.includes(' ')) {
    return result.replace(regex, '_');
  }
  return result;
}

/* escapes certain characters */
function charEscaper(string) {
  let result;
  if (string) {
    result = string;
  } else {
    return;
  }
  if (result.includes(`'`)) {
    let position = result.indexOf(`'`);
    result = result.substr(0, position) + '\\' + result.substr(position);
  }
  if (result.startsWith(`.`)) {
    result = '\\' + result;
  }
  return result;
}

/* Post to chat functionality */
$(document).on('click', '.postButton', function() {
  app.handleSubmit();
  $('#textField').val('');
});

/*
  var $selected = $(`#roomSelect option:selected`);
  var $selectedText = $selected.text();
  const newRoomClass = classFormatter($selectedText);
  const roomClassFinal = charEscaper(newRoomClass);
  if ($selectedText === 'Create New Room') {
    $('.createRoomField').css('visibility', 'visible');
    $('.createRoomButton').css('visibility', 'visible');
  } else if ($selectedText === 'All Rooms') {
    $('.chat').show();
    var toDo = 'do something';
  } else {
    $('.chat').hide();
    $(`.${roomClassFinal}`).show();
  }

*/

/* "Adding friend" functionality */
$(document).on('click', '.chat', function() {
  const friend = event.target.className.slice(9);
  $('.chat').hide();
  $(`.${friend}`).show();
  app.handleUsernameClick();
});

$(document).on('click', '.refreshButton', function() {
  location.reload();
});

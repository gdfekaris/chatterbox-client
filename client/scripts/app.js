$(document).ready(function() {
  $.ajax({
    url: `http://parse.rpt.hackreactor.com/chatterbox/classes/messages`,
    type: `GET`,
    error: function() {
      $('#chats').html('<p>An error has occurred</p>');
    },
    dataType: 'json',
    success: function(data) {
      console.log(data);
      //let rooms = {};

      for (var i = data.results.length - 1; i >= 0; i--) {
        var $message = $(`<div class="chat ${data.results[i].roomname}">`).html(
          `<span class="username">${data.results[i].username}:</span>
            <span class="messageText">${data.results[i].text}</span>`
        );
        // var $description = $(`<p class=${data.results[i].roomname}>`).text(
        //   data.results[i].text
        // );

        // if (!rooms[data.results[i].roomname]) {
        //   rooms[data.results[i].roomname] = data.results[i].roomname)
        // }s
        console.log('CLASS =', $message.className);
        $('#chats').append($message);
        //.append($description);
      }

      $('.username').on('click', function() {
        console.log(`added friend!`);
      });
    }
  });
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

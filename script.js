AWS.config.region = 'ap-southeast-1'; // Replace with your desired AWS region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'ap-southeast-1:6f709d43-8ef1-4489-b87f-38edd5694ba0' // Replace with your Cognito Identity Pool ID
});

var lexRuntimeV2 = new AWS.LexRuntimeV2();
var userId = localStorage.getItem('lexUserId');

if (!userId) {
  userId = generateRandomUserId();
  localStorage.setItem('lexUserId', userId);
}



function generateRandomUserId() {
  return uuidv4(); // Generate a random UUID v4
}

function sendUserInput() {
  var userInput = document.getElementById('userInput').value;
  var params = {
    botAliasId: 'TSTALIASID', // Replace with your bot alias ID
    botId: '7G2QVHSURX', // Replace with your bot ID
    localeId: 'en_US', // Replace with the desired locale ID
    sessionId: userId,
    text: userInput
  };
  

  lexRuntimeV2.recognizeText(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      var chatContainer = document.getElementById('chatContainer');
      var interpretations = data.interpretations;
      var messages = data.messages;

      // Display user message
      var userMessage = '<div class="message userMessage">' + userInput + '</div>';
      chatContainer.innerHTML += userMessage;

      document.querySelectorAll('.userMessage').forEach((e) => {
        e.style.backgroundColor = '#ccc';
      })

      
      // Process bot messages
      var uniqueMessages = {}; // Object to store unique messages
      for (var i = 0; i < interpretations.length; i++) {
        var intent = interpretations[i].intent;
        if (intent.name !== 'FallbackIntent') {
          for (var j = 0; j < messages.length; j++) {
            if (messages[j].interpretationId === intent.interpretationId) {
              var message = messages[j].content;
              var messageType = messages[j].contentType;
              if (messageType === 'PlainText') {
                uniqueMessages[message] = true; // Store unique messages in the object
              }
            }
          }
        }
      }

      // Display unique bot messages
      Object.keys(uniqueMessages).forEach(function (message) {
        var formattedMessage = '<div class="message botMessage">' + message + '</div>';
        chatContainer.innerHTML += formattedMessage;
      });

      // Clear the user input field
      document.getElementById('userInput').value = '';

      // Scroll to the bottom of the chat container
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
}

function resetConversation() {
  var chatContainer = document.getElementById('chatContainer');
  chatContainer.innerHTML = ''; // Clear chat container

  // Reset user session
  userId = generateRandomUserId();
  localStorage.setItem('lexUserId', userId);

  // Clear the user input field
  document.getElementById('userInput').value = '';

  // Scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
function checkEnter(event) {
  console.log(event);
  if (event.key === 'Enter') {
    console.log('abc');
      sendUserInput();
  }
}
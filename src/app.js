/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var ajax = require('ajax');
var UI = require('ui');
var Vector2 = require('vector2');


var splashWindow = new UI.Window();

//Create the background
var rectangle = new UI.Rect({
  position: new Vector2(0,0),
  size: new Vector2(144,168),
   backgroundColor:'blueMoon'
});
splashWindow.add(rectangle);

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0,30),
  size: new Vector2(144,80),
  text: 'Check My Server',
  font:'GOTHIC_28_BOLD',
  color:'white',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'clear'
});
splashWindow.add(text);

//   var image = new UI.Image({
//     position: new Vector2(58, 84),
//     size: new Vector2(28, 28),
//     image: 'images/server.png'
//   });
//   splashWindow.add(image);
splashWindow.show();
// splashWindow.on('click', 'select', start);

setTimeout( function() {
  var menuItems = [];
  menuItems[0] = {
    title: 'http://lazaronihost.ddns.net',
      subtitle: 'Last checked 3d ago. On.'
  };
  
  menuItems[1] = {
    title: 'http://google.com',
      subtitle: 'Last checked 1h ago. On.'
  };
  
  menuItems[2] = {
    title: 'http://192.168.1.0/',
      subtitle: 'Last checked 1h ago. On.'
  };
  
  var hostsMenu = new UI.Menu({
    sections: [{
      title: 'Hosts',
      items: menuItems
    }],
    highlightBackgroundColor: "blueMoon"
  });
  hostsMenu.show();
  // Whenever the user selects an option
  hostsMenu.on('select', function(e){
    
    var splashCard = new UI.Card({
      title:'Request Sent',
      subtitle:e.item.subtitle,
      body:'Waiting for host\'s response'
    });
    splashCard.show();
    
    //As Google is always up we will first make a call to Google to see
    // if we are having access to the internet.
    var googleIsUp = false;
    var hostIsUp = false;
    var hostError = false;
    ajax(
      {
        url: "https://www.google.co.uk/",
        type:'string'
      },
      function(data){
        googleIsUp = true;
        console.log('Google is responding!');
      },
      function(error){
//         errorCard();
        console.log(error);
      });
    
    // As ajax is asynchronous we can make the call to the Host straight after
    // and don't have to wait for Google's response to do it.
    ajax(
      {
        url:e.item.title,
        type:'string' //We expect a string because we are not interested in what the server
                      // will return, only that it will return something at all, whatever it is.
      },
      function(data) { //Yes! The host returned something. It is up.
        hostIsUp = true;
        var detailCard = new UI.Card({
          title:'Online',
          subtitle:e.item.title,
          body: 'Host is up and running!'
        });
        splashCard.hide();
        detailCard.show();
      },
      function(error){ //Ops, the host probably returned something shady.
        console.log(error);
        hostError = true;
        var detailCard = new UI.Card({
          title:'Sup host?',
          subtitle:e.item.title,
          body: 'Your host may be up but there was an error in the request: '+ error,
          scrollable: true
        });
        splashCard.hide();
        detailCard.show();
      }
    );
    
    //Now let's wait and see if the host will answer in the next three seconds
    setTimeout( function() {
      // If the host answered a nice card is already being displayed so we only have to deal
      // with the case when it didn't answer.
      if(!hostIsUp && !hostError){
        if(googleIsUp){ //Well, Google answered but the host didn't. The host is not online.
          detailCard = new UI.Card({
            title:'Host Down',
            subtitle:e.item.title,
            body: 'Your host is offline. I tried to talk to him but it wouldn\'t answer me back.',
            scrollable: true
          });
          splashCard.hide();
          detailCard.show();
        }
        else{ // Google also didn't respond. So we are probably the ones offline.
         detailCard = new UI.Card({
            title:'We\'re offline',
            subtitle:e.item.title,
            body: 'Uh, we are offline. Our studies were unconclusive because the phone doesn\'t seem to be doing it\'s job. Wake it up and try again',
            scrollable: true
          });
          splashCard.hide();
          detailCard.show();
        }
      }
    } , 5000);    
  });
}, 1000);
  



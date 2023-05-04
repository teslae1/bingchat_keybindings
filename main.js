
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'y') {
        var cibMessage = tryFindCibMessage();
        if(cibMessage == null)
            return;

        tryFlashBackgroundOfMessageToCopy(cibMessage);
        copyMessageToClipboard(cibMessage);
    }
});

function tryFindCibMessage(){
   let cibserpChildren = document
       .getElementsByTagName('cib-serp')[0]
       .shadowRoot
       .children;
   let cibconvChildren = Array.from(cibserpChildren)
       .find((e) => e.id == 'cib-conversation-main')
       .shadowRoot
       .children;
   let scroller = cibconvChildren[0];
   let scrollerPos = scroller.children[0];
   let content  = Array.from(scrollerPos.children)
   .find(e => e.className == 'content');
   let mainChat = Array.from(content.children)
   .find(e => e.id == 'cib-chat-main');
   let chatTurns = Array.from(mainChat.children)
   .filter(e =>  e.tagName == 'CIB-CHAT-TURN');
   let latestChatTurn = chatTurns[chatTurns.length - 1];
   let responseMessageOfTurn = Array.from(latestChatTurn.shadowRoot.children)
   .find(e => e.className == 'response-message-group');
   if(responseMessageOfTurn == null)
       return;

   return Array.from(responseMessageOfTurn.shadowRoot.children)
    .find(e => {
        return Array.from(e.attributes).some(a => a.name == 'type' && a.value == 'text');
    });
}

function tryFlashBackgroundOfMessageToCopy(msg)
{
    try{
        msg.style.backgroundColor = 'rgb(255, 255, 255, 0)';
        setTimeout(() => {
            msg.style.backgroundColor = 'rgb(255, 255, 255, 1)';
        }, 100);
    }
    catch{}
}

function copyMessageToClipboard(cibMessage)
{
   let cibFeedback = Array.from(cibMessage.shadowRoot.children)
   .find(e => e.tagName == 'CIB-FEEDBACK');
   let feedbackcontainer = cibFeedback.shadowRoot.children[0];
   let moreBtn = Array.from(feedbackcontainer.children)
   .find(e => e.className == 'more');
   //dispatch mouse click event 
   moreBtn.dispatchEvent(new MouseEvent('click', {
       view: window,
       bubbles: true,
       cancelable: true
   }));

   setTimeout(function() {
       let overflow = cibFeedback.shadowRoot.children[1];

       let copyBtn = overflow.children[0];
       copyBtn.click();
       copyBtn.dispatchEvent(new MouseEvent('click', {
       view: window,
       bubbles: true,
       cancelable: true
   }));

   //close again
   moreBtn.dispatchEvent(new MouseEvent('click', {
       view: window,
       bubbles: true,
       cancelable: true
   }));

   }, 100);
}



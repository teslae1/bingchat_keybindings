
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'y') {
        var cibMessage = tryFindCibMessage();
        if(cibMessage == null)
            return;

        tryFlashBackgroundOfMessageToCopy(cibMessage);
        copyMessageToClipboard(cibMessage);
    }
    else if(event.key == 'Escape'){
        var search = findSearchBar();
        if(search == null)
            return;

        search.blur();
    }
    else if(event.ctrlKey && event.key == 'i'){
        var search = findSearchBar();
        if(search == null)
            return;

        search.focus();
    }

    else if(event.ctrlKey && event.key == 'c'){
        NewTopic();
    }
});

function NewTopic(){

   var root = findActionBarRoot();
    if(root == null)
       return;

    let btnContainer = Array.from(root.children)
    .find(x => x.className == 'outside-left-container');
    console.log(btnContainer.children);
    let btnWrapper = btnContainer.children[0];
    let btn = btnWrapper.children[0];
    btn.click();
}

function findSearchBar(){
    let mainContainer = findMainContainer();
    let inputcontainer = Array.from(mainContainer.children)
    .find(x => x.className == 'input-container');
    let searchboxform = Array.from(inputcontainer.children)
    .find(x => x.id == 'searchboxform');
    let label = Array.from(searchboxform.children)
    .find(x => x.tagName == 'LABEL');
    let textarea = Array.from(label.children)
    .find(x => x.tagName == 'TEXTAREA');
    return textarea;
}

function findMainContainer(){
    var root = findActionBarRoot();
    return Array.from(root.children)
    .find(x => x.className == 'main-container');
}

function findActionBarRoot(){
   let cibserpChildren = document
       .getElementsByTagName('cib-serp')[0]
       .shadowRoot
       .children;
    let actionBar = Array.from(cibserpChildren)
    .find(x => x.tagName == 'CIB-ACTION-BAR');
    let actionBarChildren = actionBar.shadowRoot.children;
    return Array.from(actionBarChildren)
    .find(x => x.className == 'root');
}

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



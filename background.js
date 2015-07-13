chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if(request.msg === "REQ:ALL") {
    	var response = {};
    	// sendResponse({msg: "Test2"});
    	chrome.storage.sync.get({}, function(data) {
    		console.log("chrome storage get?");
    		response.OPTION = data.OPTION;
    		response.FILTER_OPTION = data.FILTER_OPTION;
    		response.MUTATE_OPTION = data.MUTATE_OPTION;
    		response.PARAM = data.PARAM;
    		response.STYLE = data.STYLE;
    		response.greeting = "Hello! You called?";

     		sendResponse(response);
		});
    } else if(request.msg === "greeting") {
 		sendResponse({msg: "hi back to you"});
    }
});
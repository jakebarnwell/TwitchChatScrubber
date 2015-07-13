
/*
should NOT apply deletion to when we have the <li ... class = "... notification"
*/
/*
dont apply deletion when by a mod (since could be a bot) or broadcaster (since advertising their stream)?
*/
/*
1 emote might be 100 chars since it's in HTML
*/
/*
<deleted msg> ? May be giving my undefined toLowerCase error
my copyPasta code slowing everything way down after awhile
*/

/*
delete all-caps or most-caps messages
caps --> proper case
special CSS for @username
slow down chat---only show every n-th chat message? or msg/sec or something
msgs that start with ! are commands. Ignore them in copypasta checker? do we ever
delete theM?
align usernames on the right so that chat messages are aligned?
or hide usernames so they're not annoying, or truncate
*/
// have a notifcation thing if you're @message'd. like a ding or a flash.
// change color of people's usernames (by class?)
// hide "deleted messages" or refactor (the ones by Twitch itself)
// option to show marker per delete-reason (probably not)
$(document).ready(function() {
	$(".chat-lines").waitUntilExists(function() {
		$(".chat-lines").ready(function() {
			console.log("Extension is ready!");
			TwitchChatScrubber();
		});
	});
});

function TwitchChatScrubber() {
	loadSettings();
	$(".chat-lines").delegate("div", "DOMNodeInserted", function(e) {
		var node_target = targetToNode(e);

		if(node_target.is(".ember-view")) {
			handle(node_target);	
		}
	});
}

function handle(node_target) {
	var chat_line = nodeToChatline(node_target);
	var message = chatlineToMessage(chat_line);
	var text = messageToText(message); // could give undefined error if msg is deleted
	var textLower = text.toLowerCase();
	var badges = chatlineToBadges(chat_line);

	if(shouldDelete(node_target, chat_line, textLower, badges)) {
		deleteMessage(node_target);
	} else {
		maybeModifyMessage(node_target, chat_line, message, text);
	}
}

function loadSettings() {
	// OPTION = loadOption();
	// FILTER_OPTION = loadFilterOption();
	// MUTATE_OPTION = loadMutateOption();
	// PARAM = loadParam();
	// STYLE = loadStyle();
	// console.log("DEFAULT:");
	// console.log(DEFAULT);
	loadOption();
	OPTION = Default.OPTION;
	FILTER_OPTION = Default.FILTER_OPTION;
	MUTATE_OPTION = Default.MUTATE_OPTION;
	PARAM = Default.PARAM;
	STYLE = Default.STYLE;

	FILTERS = calculateFilters();
	MUTATORS = calculateMutators();
	calculateDynamicStyles();
}

function loadOption() {
	chrome.runtime.sendMessage({msg: "greeting"}, function(response) {
  		console.log(response);
	});
	chrome.runtime.sendMessage({msg: "REQ:ALL"}, function(response) {
  		console.log(response);
	});
	// chrome.extension.sendRequest({localstorage: "email"}, function(response) {
	// var MAIL = response.email;
	// var flags = document.getElementById('flags');
	// if(flags){
	// document.getElementById('flags').innerHTML = prev + 
	// "<a href='http://mvmacd.comlu.com/craigslist.php?user&amp;addr="+MAIL+"'>Email this</a>" 
	// }
	// });
}
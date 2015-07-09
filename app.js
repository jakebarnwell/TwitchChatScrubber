
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

$(document).ready(function() {
	$(".chat-lines").ready(function() {
		TwitchChatScrubber();
	});
});

function TwitchChatScrubber() {
	FILTERS = calculateFilters();
	MUTATORS = calculateMutators();
	PARAM.directedMsg.styles = calculateDirectedMsgStyles();
	// console.log(PARAM.directedMsg.styles);
	$(".chat-lines").delegate("div", "DOMNodeInserted", function(e) {
		var node_target = $(e.target);

		if(node_target.is(".ember-view")) {
			handle(node_target);	
		}
	});
}

function handle(node_target) {
	if(shouldDelete(node_target)) {
		deleteMessage(node_target);
	} else {
		maybeModifyMessage(node_target);
	}
}


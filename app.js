
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
*/

$(document).ready(function() {
	$(".chat-lines").ready(function() {
		TwitchChatScrubber();
	});
});

function TwitchChatScrubber() {
	FILTERS = calculateFilters();
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
	}
}

// TODO deal with URLs/links in chat messages
// TODO emotes should count as 1 character for lengthRestrict
function shouldDelete(node_target) {
	var chat_line = node_target.children(".chat-line");
	var text = chat_line.children(".message").html().toLowerCase(); // could give undefined error if msg is deleted
	var node_badges = chat_line.children(".badges").children(".badge");
	var badges = [];

	// this is a special jquery selection set so can't use <for ... in ...>
	for(var i = 0; i < node_badges.length; i++) {
		badges.push($(node_badges[i]).attr("title"));
	}

	if(!text) {
		return false;
	}

	for(var i = 0; i < FILTERS.length; i++) {
		var filter_result = FILTERS[i].filter(node_target, chat_line, text, badges);
		if(filter_result === DELETE_TRUE) {
			return true;
		} else if(filter_result === DELETE_FALSE) {
			return false;
		}
	}

	//By this point, all filters have run and none have told us to delete the
	// message, so we just keep it:
	return false;
}

function deleteMessage(node_target) {
	node_target.css("background-color", "red");
	console.log(deletion_reason);
	node_target.children(".chat-line").children(".message").append("</br>Deletion reason: " + deletion_reason[$(node_target).attr("id")]);
	delete deletion_reason[$(node_target).attr("id")];

	if(OPTION.deletedMessage.showMarker) {
		$(".chat-lines").append("</hr style=\"{color: red}\">");
	} else {
		;
	}
}
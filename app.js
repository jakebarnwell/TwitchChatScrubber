
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

var SUBSCRIBER = "Subscriber",
	TURBO = "Turbo",
	MODERATOR = "Moderator",
	BROADCASTER = "Broadcaster",
	GLOBALMODERATOR = "Global Moderator",
	ADMIN = "Admin",
	STAFF = "Staff";

var POWER = [MODERATOR, BROADCASTER, GLOBALMODERATOR, ADMIN, STAFF];

var DELETE_TRUE = 1;
var DELETE_FALSE = -1;
var DELETE_UNSURE = 0;
var deletion_reason = {};

var OPTIONS = {
	staffMessagePriority: true,
	notificationPriority: true,
	lengthRestrict: true,
	byAccountStatus: false,
	triggerPhrase: false,
	copyPasta: true
}

var REASON = {
	HIDE_PLEBS: "Hide plebs",
	HIDE_SUBS: "Hide subs",
	LENGTH_RESTRICT: "Length restriction",
	TRIGGER_PHRASE: "Trigger phrase",
	COPY_PASTA: "Copy pasta"
}

var PARAMS = {
	tooLong_threshold: 10,
	triggerPhrase_requireDelimited: true,
	triggerPhrase_phrases: [],
	byAccountStatus_hidePlebs: true,
	byAccountStatus_hideSubs: true,
	copyPasta_lengthThreshold: 10,
	copyPasta_expiration: 1000 * 60 * 1 // 1 minute
}

var ALL_POSSIBLE_FILTERS = {
	staffMessagePriority: {
		filter: filter_byStaff,
		priority: 1
	},
	notificationPriority: {
		filter: filter_notification,
		priority: 2
	},
	lengthRestrict: {
		filter: filter_lengthRestrict,
		priority: 4
	},
	byAccountStatus: {
		filter: filter_byAccountStatus,
		priority: 3
	},
	triggerPhrase: {
		filter: filter_triggerPhrase,
		priority: 5
	},
	copyPasta: {
		filter: filter_copyPasta,
		priority: 6
	}

}

var unorderedFilters = [];

// Adds the appropriate filters into our active filter buffer
for (var key in OPTIONS) {
   	if (OPTIONS.hasOwnProperty(key)) {
   		if(OPTIONS[key] === true) {
   			unorderedFilters.push(ALL_POSSIBLE_FILTERS[key]);
   		}
    }
}

var orderedFilters = unorderedFilters.slice()
function sortFilters(f1, f2) {
	return f1.filter - f2.filter;
}
orderedFilters.sort(sortFilters);

function TwitchChatScrubber() {
	$(".chat-lines").delegate("div", "DOMNodeInserted", function(e) {
		var node_target = $(e.target);
		if(node_target.is(".ember-view")) {
			// var chat_line = node_target.children(".chat-line");
			// var text = chat_line.children(".message").html();
			// var badges = chat_line.children(".badges");

			handle(node_target);	
		}
	});
}

function handle(node_target) {
	if(shouldDelete(node_target)) {
		deleteMessage(node_target);
	}
}

showDeletedMsgMarker = false;
function deleteMessage(node_target) {
	node_target.css("background-color", "red");
	console.log(deletion_reason);
	node_target.children(".chat-line").children(".message").append("</br>Deletion reason: " + deletion_reason[$(node_target).attr("id")]);
	delete deletion_reason[$(node_target).attr("id")];

	if(showDeletedMsgMarker) {
		$(".chat-lines").append("</hr style=\"{color: red}\">");
	} else {
		;
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

	for(var i = 0; i < orderedFilters.length; i++) {
		var filter_result = orderedFilters[i].filter(node_target, chat_line, text, badges);
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





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

// console.log("Here!");
// alert("Here");
$(document).ready(function() {
	console.log("Ready document.");
	// $(".chat-lines").delegate("ul", "load", function() {
	// 	console.log("Chat lines ready!");
	// });
	// setTimeout(function() {$(".chat-lines").hide();}, 10000);
	// console.log($(".chat-lines").children(".chat-line"));
	$(".chat-lines").ready(function() {
		console.log("Chat is ready!");
		// setTimeout(stuff, 10000);
		stuff();
	});
});
function stuff() {
	$(".chat-lines").delegate("div", "DOMNodeInserted", function(e) {
		var node_target = $(e.target);
		console.log($(node_target).children(".chat-line").children(".message").html());
	});
}



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
	tooLong_threshold: 50,
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
		priority: 3
	},
	byAccountStatus: {
		filter: filter_byAccountStatus,
		priority: 4
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

$(".chat-lines").bind("DOMNodeInserted", function(e) {
	var node_target = $(e.target);
	if(node_target.is(".ember-view")) {
		// var chat_line = node_target.children(".chat-line");
		// var text = chat_line.children(".message").html();
		// var badges = chat_line.children(".badges");

		handle(node_target);	
	}
});

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

function filter_notification(node_target, chat_line, text, badges) {
	if(chat_line.hasClass("admin")) {
		return DELETE_FALSE;
	}

	return DELETE_UNSURE;
}

function reduceEmotes(message, toAlt, replacement) {
	var imgs = message.children("img");
	var r = replacement;

	for(var i = 0; i < imgs.length; i++) {
		if(toAlt === true) r = $(imgs[i]).attr("alt");
		$(imgs[i]).replaceWith(r);
	}
}

function stripEmotes(chat_line) {
	var imgs = chat_line.children(".message").children("img");
	for(var i = 0; i < imgs.length; i++) {
		$(imgs[i]).replaceWith("");
	}
}

function hasEmotes(chat_line) {
	return chat_line.children(".message").children("img").length > 0;
}

function filter_byStaff(node_target, chat_line, text, badges) {
	// The poster can have multiple badges. If any of the poster's badges are a staff
	//  badge, we don't delete.
	for(var i = 0; i < badges.length; i++) {
		if(POWER.indexOf(badges[i]) > -1) {
			return DELETE_FALSE;
		}
	}

	// If we get here then the poster does not have a staff badge.
	return DELETE_UNSURE;
}

//TODO turbo?
function filter_byAccountStatus(node_target, chat_line, text, badges) {
	if(PARAMS.byAccountStatus_hidePlebs) {
		if(badges.length === 0) {
			deletion_reason[$(node_target).attr("id")] = REASON.HIDE_PLEBS;
			return DELETE_TRUE;
		}
	}

	// for now, hides anyone who contains a sub badge (including mods etc)
	if(PARAMS.byAccountStatus_hideSubs) {
		if(badges.indexOf(SUBSCRIBER) > -1) {
			deletion_reason[$(node_target).attr("id")] = REASON.HIDE_SUBS;
			return DELETE_TRUE;
		} 
	}

	return DELETE_UNSURE;
}

function filter_lengthRestrict(node_target, chat_line, text, badges) {
	var clone_message = chat_line.children(".message").clone();
	reduceEmotes(clone_message, false, " ");

	var text = $(clone_message).html().toLowerCase();
	if(text.length > PARAMS.tooLong_threshold) {
		deletion_reason[$(node_target).attr("id")] = REASON.LENGTH_RESTRICT;
		console.log(deletion_reason);
		return DELETE_TRUE;
	}

	return DELETE_UNSURE;
}

function filter_triggerPhrase(node_target, chat_line, text, badges) {
	for(var phrase in PARAMS.triggerPhrase_phrases) {
		if(PARAMS.triggerPhrase_requireDelimited) {
			if(text.indexOf(phrase) > -1) {
				deletion_reason[$(node_target).attr("id")] = REASON.TRIGGER_PHRASE;
				return DELETE_TRUE;
			}
		} else {
			// does not work correctly with accented/special chars/letters
			var regex = new RegExp("\\b" + phrase + "\\b");
			if(regex.test(text)) {
				deletion_reason[$(node_target).attr("id")] = REASON.TRIGGER_PHRASE;
				return DELETE_TRUE;
			}
		}
	}
	
	return DELETE_UNSURE;
}

longMessages = [];
/*
each longMessage ele is of the form
{text: String, lastAccess: Time, numOccurrences: Number}
*/

function filter_copyPasta(node_target, chat_line, text, badges) {
	// Replace emotes with their alt texts first before doing copyPasta comparison
	var clone_message = chat_line.children(".message").clone();
	reduceEmotes(clone_message, true);

	var text = $(clone_message).html().toLowerCase();
	console.log("copyPasta check text: ");
	console.log(text);
	// copyPasta only applies to long messages
	if(text.length > PARAMS.copyPasta_lengthThreshold) {
		var logged = isAlreadyLogged(text);
		if(logged) { // then it's already there so it's a copy paste
			console.log("Is logged.");
			deletion_reason[$(node_target).attr("id")] = REASON.COPY_PASTA;
			console.log(deletion_reason);
			return DELETE_TRUE;
		} else { // then add to listing and return false
			addCPListing(text);
			return DELETE_UNSURE;
		}
	}

	return DELETE_UNSURE;
}

function addCPListing(text) {
	var newCPListing = {
		text: text,
		lastAccess: new Date(),
		numOccurrences: 1
	};

	longMessages.push(newCPListing);

	return newCPListing;
}

function isAlreadyLogged(text) {
	var numLongMessages = longMessages.length;

	// mmm hacky for-loops
	for(var i = 0; i < longMessages.length; ) {
		var msg = longMessages[i];
		if(new Date() - msg.lastAccess > PARAMS.copyPasta_expiration) {
			longMessages.splice(i, 1);
			// don't modify i since we removed the current element from
			//  the array, so we're already at the "next" i
			continue;
		}

		var text_distance = CP_distance(text, msg.text);

		// for now, assume we want 80% similarity
		var distThreshold = 0.2;
		// console.log("difference ratio = " + (text_distance/text.length));
		if(text_distance / text.length <= distThreshold) {
			msg.lastAccess = new Date();
			msg.numOccurrences += 1;
			
			return true;
		}

		i++;
	}

	return false;
}

// Copy pasta distance
function CP_distance(key, text) {
	return DL_distance(key, text);
}

// Damerau-Levenshtein Distance
function DL_distance(a, b) {
	var lenA = a.length;
	var lenB = b.length;

	var DL = new Array(lenA + 1);
	for(var i = 0; i <= lenA; i++) {
		DL[i] = new Array(lenB + 1);
	}
	
	for(var i = 0; i <= lenA; i++) {
		for(var j = 0; j <= lenB; j++) {
			if(Math.min(i, j) === 0) {
				DL[i][j] = Math.max(i, j);
			} else {
				// when indexing into the strings themselves we'll be sure to normalize
				//  the index:
				var x = i - 1; var y = j - 1;

				var deletion = DL[i-1][j] + 1;
				var insertion = DL[i][j-1] + 1;
				var substitution = DL[i-1][j-1] + (a[x] === b[y] ? 0 : 1);

				var canTranspose = (i > 1 && j > 1 && a[x] === b[y-1] && a[x-1] === b[y]);
				var transposition = (canTranspose ? (DL[i-2][j-2] + 1) : Infinity);

				DL[i][j] = Math.min(deletion, insertion, substitution, transposition);
			}
		}
	}

	return DL[lenA][lenB];
}






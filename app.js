
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

var SUBSCRIBER = "Subscriber",
	TURBO = "Turbo",
	MODERATOR = "Moderator",
	BROADCASTER = "Broadcaster",
	GLOBALMODERATOR = "Global Moderator",
	ADMIN = "Admin",
	STAFF = "Staff";

var POWER = [MODERATOR, BROADCASTER, GLOBALMODERATOR, ADMIN, STAFF]

$(".chat-lines").bind("DOMNodeInserted", function(e) {
	var target = $(e.target);
	if(target.is("li")) {
		var text = target.children(".message").html();
		var badges = target.children(".badges");

		if(shouldBeDeleted(text, badges, target)) {
			handle_deleteMessage(target);
		}
		
	}
});

showDeletedMsgMarker = false;
function handle_deleteMessage(target) {
	target.css("background-color", "red");

	if(showDeletedMsgMarker) {
		;
	} else {
		;
	}
}

function shouldBeDeleted(text, node_badges, node_target) {
	if(!text) return false;

	// this is a special jquery selection set
	var node_arr_badge = node_badges.children(".badge");
	var badges = [];
	for(var i = 0; i < node_arr_badge.length; i++) {
		badges.push($(node_arr_badge[i]).attr("title"));
	}
	

	text = text.toLowerCase()

	// if it's a notification, never delete it:
	if(notification_p(node_target)) {
		return false;
	}

	// overrides all rules so let's put it first:
	staffPriority = true;
	if(staffPriority && byStaff(badges)) {
		return false;
	}

	// if any of these are satisfied, we delete. 

	// Order least to most expensive in computation.
	lengthRestrict = false;
	if(lengthRestrict && isTooLong(text)) {
		return true;
	}
	// they have the option to hide messages from plebs or from
	//  subs (if the subs have no other authorizations)
	byAccountStatus = false;
	if(byAccountStatus && wrongAccountType(badges)) {
		return true;
	}
	trigger = true;
	if(trigger && hasTriggerPhrase(stripEmotes(text))) {
		return true;
	}
	copyPasta = true;
	if(copyPasta && isCopyPasta(reduceEmotes(text))) {
		return true;
	}

	return false;
}

function notification_p(target) {
	return target.hasClass("notification");
}

var emote_regex_str = "< *img *class=\\\".*\\\" *src=\\\".*\\\" *alt=\\\".*\\\" *title=\\\".*\\\" *>";
function reduceEmotes(text) {
	var emote = new RegExp(emote_regex_str, "gi");
	return text.replace(emote, "E");
}

function stripEmotes(text) {
	var emote = new RegExp(emote_regex_str, "gi");
	return text.replace(emote, "");
}

function hasEmotes(text) {
	var emote = new RegExp(emote_regex_str, "gi");
	return emote.test(text);
}

function byStaff(badges) {
	var staffTypes = [];

	// the poster can have multiple badges. Need to satisfy at least 1.
	for(var i = 0; i < badges.length; i++) {
		if(staffTypes.indexOf(badges[i]) > -1) return true;
	}
	return false;
}

hideMessagesFromPlebs = true;
hideMessagesFromSubs = true; // can contain either/both/neither of sub, pleb
// ignores turbo status

// if badges = [] or badges = ["Subscriber"]
//TODO turbo?
function wrongAccountType(badges) {
	if(hideMessagesFromPlebs) {
		if(badges.length === 0) return true;
	}
	if(hideMessagesFromSubs) {
		if(badges.indexOf(SUBSCRIBER) > -1) {
			for(var i = 0; i < POWER.length; i++) {
				if(badges.indexOf(POWER[i]) > -1) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

	return false;
}
var tooLong_threshold = 100;
function isTooLong(text) {
	if(text.length > tooLong_threshold) return true;
	return false;
}

var triggerPhrases = [];
var trigger_requireDelimited = false;
function hasTriggerPhrase(text) {
	for(var i = 0; i < triggerPhrases.length; i++) {
		if(trigger_requireDelimited) {
			if(text.indexOf(triggerPhrases[i]) > -1) return true;
		} else {
			var w = triggerPhrases[i];
			// does not work correctly with accented/special chars/letters
			var regex = new RegExp("\\b" + w + "\\b");
			if(regex.test(text)) return true;
		}
	} 
	
	return false;
}

longMessages = [];
/*
each longMessage ele is of the form
{text: String, lastAccess: Time, numOccurrences: Number}
*/
var cpLengthThreshold = 100;
function isCopyPasta(text) {
	// copyPasta only applies to long copyPasta messages
	if(text.length > cpLengthThreshold) {
		var logged = isAlreadyLogged(text);
		if(logged) { // then it's already there so it's a copy paste
			console.log("Is logged.");
			return true;
		} else { // then add to listing and return false
			addCPListing(text);
			return false;
		}
	} else {
		return false;
	}
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

CP_expiration = 1000 * 60 * 1; // 1 minute
// CP_expiration = 1000 * 10; // 10 sec for now 
function isAlreadyLogged(text) {


	var numLongMessages = longMessages.length;

	// mmm hacky for-loops
	for(var i = 0; i < longMessages.length; ) {
		var msg = longMessages[i];
		if(new Date() - msg.lastAccess > CP_expiration) {
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

function CP_distance(key, text) {
	return text_distance(key, text);
}

function text_distance(t1, t2) {
	return DL_distance(t1, t2);
}

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






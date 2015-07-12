

function mutate_reduceLinks(node_target, chat_line, message, text) {
	if(OPTION.reduceLinks === CONSTS.LINKPLAINTEXT) {
		reduceLinks(message, true);
	} else if(OPTION.reduceLinks === CONSTS.LINKREMOVE) {
		reduceLinks(message, false, "");
	} else {
		throw new Error("Not a valid reduceLinks option.");
	}
}

function mutate_minimizeCaps(node_target, chat_line, message, text) {
	var len = text.length;
	if(len > PARAM.minimizeCaps.lengthThreshold) {
		var numCaps = text.replace(/[^A-Z]/g, "").length;
		if(1.0*numCaps/len > PARAM.minimizeCaps.percentThreshold) {
			message.css("text-transform","lowercase");
		}
	}
}

function mutate_directedMsg(node_target, chat_line, message, text) {
	var exists = false; // True if a @username was found.
	// console.log("Calling mutate directed msg on:" );
	// console.log(node_target);
	var regexUsername = new RegExp("(^|\\W)@\\w+", "g");
	// Incoming text is of the form "@username" or ".@username" (where the . could
	//  be any non-word-like character):
	var stylizeUsername = function(atUsername) {
		var s;
		var firstChar;
		if(atUsername[0] === "@" && atUsername[1] != "@") {
			s = atUsername;
			firstChar = "";
		} else {
			s = atUsername.slice(1);
			firstChar = atUsername[0];
		}
		if(PARAM.directedMsg.notifyUser === true && s.slice(1) === CONSTS.CLIENTUSERNAME) {
			exists = true;
			node_target.addClass(CLASS.DIRECTEDMSG_SELF_NODE);
			return firstChar + "<span class=\"" + CLASS.DIRECTEDMSG_SELF + "\">" + s + "</span>";
		} else {
			exists = true;
			console.log("We're here, directed message (not self)");
			node_target.addClass(CLASS.DIRECTEDMSG_NODE);
			return firstChar + "<span class=\"" + CLASS.DIRECTEDMSG + "\">" + s + "</span>";
		} //todo when it's self-user, the normal @username styles aren't applied (duh)
	};
	// console.log("Here.");
	// Using the 'mentioning' class is not sufficient, since the 'mentioning' class is
	//  only applied to the first @Occurrence in a message, not all of them, sometimes.
	//  Other times, it doesn't seem to work at all. It's just too unreliable.
	var newText = text.replace(regexUsername, stylizeUsername);
	// console.log("NewText: " + newText);
	message.html(newText);
	if(exists === true) {
		applyNewStyles(node_target, message);
	}
}

function mutate_reduceEmotes(node_target, chat_line, message, text) {
	if(OPTION.reduceEmotes === CONSTS.EMOTEPLAINTEXT) {
		reduceEmotes(message, true);
	} else if(OPTION.reduceEmotes === CONSTS.EMOTEREMOVE) {
		reduceEmotes(message, false, "~EMOTE~");
	} else {
		throw new Error("Not a valid reduceEmotes option.");
	}
} // class is 'mentioning' for @myusername OR if *I* do @username 

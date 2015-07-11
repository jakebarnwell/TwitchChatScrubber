

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
		return firstChar + "<span style=\"" + PARAM.directedMsg.styles + "\" class=\"" + CONSTS.DIRECTEDMSGCLASS + "\">" + s + "</span>";
	};
	// console.log("Here.");
	var newText = text.replace(regexUsername, stylizeUsername);
	// console.log("NewText: " + newText);
	message.html(newText);

}

function mutate_reduceEmotes(node_target, chat_line, message, text) {
	if(OPTION.reduceEmotes === CONSTS.EMOTEPLAINTEXT) {
		reduceEmotes(message, true);
	} else if(OPTION.reduceEmotes === CONSTS.EMOTEREMOVE) {
		reduceEmotes(message, false, "~EMOTE~");
	} else {
		throw new Error("Not a valid reduceEmotes option.");
	}
}
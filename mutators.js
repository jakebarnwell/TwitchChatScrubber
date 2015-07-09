

function mutate_reduceLinks(node_target) {
	var message = node_target.children(".chat-line").children(".message");
	if(OPTION.reduceLinks === CONSTS.LINKPLAINTEXT) {
		reduceLinks(message, true);
	} else if(OPTION.reduceLinks === CONSTS.LINKREMOVE) {
		reduceLinks(message, false, "");
	} else {
		throw new Error("Not a valid reduceLinks option.");
	}
}

function mutate_minimizeCaps(node_target) {
	var text = node_target.children(".chat-line").children(".message").html();
	var len = text.length;
	if(len > PARAM.minimizeCaps.lengthThreshold) {
		var numCaps = text.replace(/[^A-Z]/g, "").length;
		if(1.0*numCaps/len > PARAM.minimizeCaps.percentThreshold) {
			node_target.children(".chat-line").children(".message").css("text-transform","lowercase");
		}
	}
}

function mutate_directedMsg(node_target) {
	console.log("Calling mutate directed msg on:" );
	console.log(node_target);
	var regexUsername = new RegExp("(^|\\W)@\\w+", "g");
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
		return firstChar + "<span style=\"" + PARAM.directedMsg.style + "\" class=\"" + CONSTS.DIRECTEDMSGCLASS + "\">" + s + "</span>";
	};

	var text = node_target.children(".chat-line").children(".message").html();
	var newText = text.replace(regexUsername, stylizeUsername);
	node_target.children(".chat-line").children(".message").html(newText);

}

function mutate_reduceEmotes(node_target) {

}
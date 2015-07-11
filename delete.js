
// TODO emotes should count as 1 character for lengthRestrict
function shouldDelete(node_target, chat_line, text, badges) {
	// incoming text is all lowercase

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
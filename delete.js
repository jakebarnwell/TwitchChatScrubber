
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
	// node_target.css("background-color", "red");
	// console.log(deletion_reason);
	// node_target.children(".chat-line").children(".message").append("</br>Deletion reason: " + deletion_reason[$(node_target).attr("id")]);
	// delete deletion_reason[$(node_target).attr("id")];

	// if(OPTION.deletedMessage.showMarker) {
	// 	$(".chat-lines").append("</hr style=\"{color: red}\">");
	// } else {
	// 	;
	// }
	var chat_line = nodeToChatline(node_target);
	if(OPTION.deletedMessage.showMarker === true) {
		node_target.prepend("<div class=\"rehide-deleted-message\">(Click to re-hide)</div>");
		node_target.children().hide();
		node_target.append("<div class=\"deleted-message-placeholder\">Deleted.</div>");
		node_target.addClass("deleted-node");
		node_target.addClass("deleted-hidden");
	} else {
		// console.log("Deleted message: " + node_target.children(".chat-line").children(".message").html());
		node_target.hide();
	}
}
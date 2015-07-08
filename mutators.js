

function mutate_reduceLinks(node_target) {
	// reduceLinks()
	if(OPTION.reduceLinks === CONSTS.LINKPLAINTEXT) {

	} else if(OPTION.reduceLinks === CONSTS.LINKREMOVE) {

	} else {
		throw new Error("Not a valid REDUCELINKS option.");
	}
	// message, toPlaintext, replacement
}

function mutate_minimizeCaps(node_target) {

}

function mutate_directedMsg(node_target) {

}

function mutate_reduceEmotes(node_target) {

}
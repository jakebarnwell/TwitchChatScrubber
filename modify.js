
function maybeModifyMessage(node_target) {
	// console.log("Here!");
	for(var i = 0; i < MUTATORS.length; i++) {
		// All mutators are in-place, i.e. they work directly on node_target
		MUTATORS[i].mutator(node_target);
	}
}


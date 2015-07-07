longMessages = [];

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
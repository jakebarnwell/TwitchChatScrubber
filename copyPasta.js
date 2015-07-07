CP = {
	longMessages: [],
	addListing: function(text) {
		var newCPListing = {
			text: text,
			lastAccess: new Date(),
			numOccurrences: 1
		};
		CP.longMessages.push(newCPListing);

		return newCPListing;
	},
	alreadyLogged: function(text) {
		var numLongMessages = CP.longMessages.length;

		// mmm hacky for-loops
		for(var i = 0; i < CP.longMessages.length; ) {
			var msg = CP.longMessages[i];
			if(new Date() - msg.lastAccess > PARAM.copyPasta.expiration) {
				CP.longMessages.splice(i, 1);
				// don't modify i since we removed the current element from
				//  the array, so we're already at the "next" i
				continue;
			}

			var text_distance = CP.distance(text, msg.text);

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
	},
	distance: function(key, text) {
		return DL_distance(key, text);
	}
}
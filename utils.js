
function reduceEmotes(message, toAlt, replacement) {
	var imgs = message.children("img");
	var r = replacement;

	for(var i = 0; i < imgs.length; i++) {
		if(toAlt === true) r = $(imgs[i]).attr("alt");
		$(imgs[i]).replaceWith(r);
	}
}

function hasEmotes(chat_line) {
	return chat_line.children(".message").children("img").length > 0;
}

function reduceLinks(message, toPlaintext, replacement) {
	var links = message.children("a");
	var r = replacement;

	for(var i = 0; i < links.length; i++) {
		if(toPlaintext === true) r = $(links[i]).attr("href");
		$(links[i]).replaceWith(r);
	}
}

function hasLinks(chat_line) {
	return chat_line.children(".message").children("a").length > 0;
}

function calculateFilters() {
	var filters = [];

	// Sorts filters based on given priority
	var sortFilters = function(f1, f2) {
		return f1.filter - f2.filter;
	}

	// Adds the appropriate filters into our active filter buffer
	for (var key in FILTER_OPTION) {
	   	if (FILTER_OPTION.hasOwnProperty(key)) {
	   		if(FILTER_OPTION[key] === true) {
	   			filters.push(ALL_POSSIBLE_FILTERS[key]);
	   		}
	    }
	}

	// Order the filters
	filters.sort(sortFilters);

	return filters;
}

function calculateMutators() {
	var mutators = [];

	// Sorts mutators based on given priority
	var sortMutators = function(m1, m2) {
		return m1.mutator - m2.mutator;
	}

	// Adds the appropriate mutators into our active filter buffer
	for (var key in MUTATE_OPTION) {
	   	if (MUTATE_OPTION.hasOwnProperty(key)) {
	   		if(MUTATE_OPTION[key] === true) {
	   			mutators.push(ALL_POSSIBLE_MUTATORS[key]);
	   		}
	    }
	}

	// Order the filters
	mutators.sort(sortMutators);

	return mutators;
}



// Damerau-Levenshtein Distance
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





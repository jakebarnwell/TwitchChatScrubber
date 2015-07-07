
function reduceEmotes(message, toAlt, replacement) {
	var imgs = message.children("img");
	var r = replacement;

	for(var i = 0; i < imgs.length; i++) {
		if(toAlt === true) r = $(imgs[i]).attr("alt");
		$(imgs[i]).replaceWith(r);
	}
}

function stripEmotes(chat_line) {
	var imgs = chat_line.children(".message").children("img");
	for(var i = 0; i < imgs.length; i++) {
		$(imgs[i]).replaceWith("");
	}
}

function hasEmotes(chat_line) {
	return chat_line.children(".message").children("img").length > 0;
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





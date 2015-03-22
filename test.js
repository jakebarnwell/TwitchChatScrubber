


$("#content").bind("DOMNodeInserted", function(e) {
	console.log("Hello!");
});
$("#btn").click(function() {
	$("#content").append("<div>asdf</br></div>");
});


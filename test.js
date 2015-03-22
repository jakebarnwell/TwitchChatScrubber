
var x;

$("#content").bind("DOMNodeInserted", function(e) {
	console.log(e.target);

	x = $(e.target);
	if(x.is("div")) {
		doStuff(x);
	} else {
		alert("added span");
	}
});
$("#btn").click(function() {
	$("#content").append("<div class=\"boo\">asdf</br></div>");
});
$("#btnspan").click(function() {
	$("#content").append("<span class=\"hi\">stuff</br></span>");
});


$(".chat-lines").children().first().hide()

function doStuff(div) {
	console.log(div);
	
}
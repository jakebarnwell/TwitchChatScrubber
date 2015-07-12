

$("body").delegate(".deleted-hidden", "click", function(e) {
	node_target = $(e.currentTarget);
	node_target.addClass("deleted-shown");
	node_target.removeClass("deleted-hidden");
	node_target.children().show();
	node_target.children(".deleted-message-placeholder").hide();
});

$("body").delegate(".rehide-deleted-message", "click", function(e) {
	node_target = $(e.currentTarget).parent();
	node_target.children().hide();
	node_target.children(".deleted-message-placeholder").show();
	node_target.addClass("deleted-hidden");
	node_target.removeClass("deleted-shown");
});


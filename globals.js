

var OPTION = {
	staffMessagePriority: true,
	notificationPriority: true,
	lengthRestrict: false,
	byAccountStatus: false,
	triggerPhrase: false,
	copyPasta: true,

	deletedMessage: {
		showMarker: false
	}
}

var PARAM = {
	lengthRestrict: {
		threshold: 10
	},
	triggerPhrase: {
		delimited: true,
		phrases: []
	},
	byAccountStatus: {
		hidePlebs: true,
		hideSubs: true
	},
	copyPasta: {
		lengthThreshold: 5,
		expiration: 1000 * 60 * 1 // 1 minute
	}
}

var ALL_POSSIBLE_FILTERS = {
	staffMessagePriority: {
		filter: filter_byStaff,
		priority: 1
	},
	notificationPriority: {
		filter: filter_notification,
		priority: 2
	},
	lengthRestrict: {
		filter: filter_lengthRestrict,
		priority: 4
	},
	byAccountStatus: {
		filter: filter_byAccountStatus,
		priority: 3
	},
	triggerPhrase: {
		filter: filter_triggerPhrase,
		priority: 5
	},
	copyPasta: {
		filter: filter_copyPasta,
		priority: 6
	}
}

var REASON = {
	HIDE_PLEBS: "Hide plebs",
	HIDE_SUBS: "Hide subs",
	LENGTH_RESTRICT: "Length restriction",
	TRIGGER_PHRASE: "Trigger phrase",
	COPY_PASTA: "Copy pasta"
}

var SUBSCRIBER = "Subscriber",
	TURBO = "Turbo",
	MODERATOR = "Moderator",
	BROADCASTER = "Broadcaster",
	GLOBALMODERATOR = "Global Moderator",
	ADMIN = "Admin",
	STAFF = "Staff";

var POWER = [MODERATOR, BROADCASTER, GLOBALMODERATOR, ADMIN, STAFF];

var DELETE_TRUE = 1;
var DELETE_FALSE = -1;
var DELETE_UNSURE = 0;

var FILTERS = [];

var deletion_reason = {};

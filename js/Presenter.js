function Presenter(bA) {
	var browserAction = bA;

	var EXTENSION_NAME = "Facebook Status";
	var BROWSER_ACTION_PATH = "img/browserAction/";
	var FILE_EXTENSION = ".png";
	var Icons = {
		DEFAULT: "default",
		ERROR:   "error",
		REQUESTS:      "requests",
		MESSAGES:      "messages",
		NOTIFICATIONS: "notifications"
	};

	var currentIcon = Icons.DEFAULT;

	browserAction.setBadgeBackgroundColor({ color: [250, 62, 62, 230] });

	this.defaultError = (e) => {
		console.error(e);
		error("Unexpected error, check Console for error message and stack trace");
	};
	this.loginError = () => error("Login to Facebook first");
	var error = message => {
		changeIcon(Icons.ERROR, '!');
		changeTitle(message);
	};

	this.resetTitle = () => changeTitle();
	var changeTitle = message => {
		browserAction.setTitle({ title: EXTENSION_NAME + (message ? ': ' + message : '') });
	};

	this.isRequestsIconShown       = () => currentIcon === Icons.REQUESTS;
	this.isMessagesIconShown       = () => currentIcon === Icons.MESSAGES;
	this.isNotificationsIconShown  = () => currentIcon === Icons.NOTIFICATIONS;

	this.resetIcon = () => changeIcon(Icons.DEFAULT, '');
	this.changeToRequestsIcon = count => changeIconWithCount(Icons.REQUESTS, count);
	this.changeToMessagesIcon = count => changeIconWithCount(Icons.MESSAGES, count);
	this.changeToNotificationsIcon = count => changeIconWithCount(Icons.NOTIFICATIONS, count);
	var changeIconWithCount = (icon, count) => {
		if (count) {
			changeIcon(icon, count);
		}
	};
	var changeIcon = (icon, badgeText) => {
		browserAction.setIcon({ path: getPaths(icon) });
		browserAction.setBadgeText({ text: badgeText.toString() });
		currentIcon = icon;
	};
	var getPaths = (name) => {
		return {
			16: getPath(name, 16),
			32: getPath(name, 32),
			19: getPath(name, 19),
			38: getPath(name, 38)
		}
	};
	var getPath = (name, pixels) => BROWSER_ACTION_PATH + name + pixels + FILE_EXTENSION;
}

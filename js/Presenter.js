function Presenter(bA) {
	const browserAction = bA;

	const EXTENSION_NAME = "Facebook Status";
	const BROWSER_ACTION_PATH = "img/browserAction/";
	const FILE_EXTENSION = ".png";
	const Icons = {
		DEFAULT: "default",
		ERROR:   "error",
		REQUESTS:      "requests",
		MESSAGES:      "messages",
		NOTIFICATIONS: "notifications"
	};

	let currentIcon = Icons.DEFAULT;

	browserAction.setBadgeBackgroundColor({ color: [250, 62, 62, 230] });

	this.unexpectedError = e => {
		console.error(e);
		error("Unexpected error, check Console for error message and stack trace");
	};
	this.loginError = () => error("Login to Facebook first");
	const error = message => {
		changeIcon(Icons.ERROR, '!');
		changeTitle(message);
	};

	this.resetTitle = () => changeTitle();
	const changeTitle = message => {
		browserAction.setTitle({ title: EXTENSION_NAME + (message ? `: ${message}` : '') });
	};

	this.isRequestsIconShown       = () => currentIcon === Icons.REQUESTS;
	this.isMessagesIconShown       = () => currentIcon === Icons.MESSAGES;
	this.isNotificationsIconShown  = () => currentIcon === Icons.NOTIFICATIONS;

	this.resetIcon = () => changeIcon(Icons.DEFAULT, '');
	this.changeToRequestsIcon = count => changeIconWithCount(Icons.REQUESTS, count);
	this.changeToMessagesIcon = count => changeIconWithCount(Icons.MESSAGES, count);
	this.changeToNotificationsIcon = count => changeIconWithCount(Icons.NOTIFICATIONS, count);
	const changeIconWithCount = (icon, count) => {
		if (count) {
			changeIcon(icon, count);
		}
	};
	const changeIcon = (icon, badgeText) => {
		browserAction.setIcon({ path: getPaths(icon) });
		browserAction.setBadgeText({ text: badgeText.toString() });
		currentIcon = icon;
	};
	const getPaths = name => {
		return {
			16: getPath(name, 16),
			32: getPath(name, 32),
			19: getPath(name, 19),
			38: getPath(name, 38)
		}
	};
	const getPath = (name, pixels) => BROWSER_ACTION_PATH + name + pixels + FILE_EXTENSION;
}

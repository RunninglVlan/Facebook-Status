function Presenter(bA) {
	var browserAction = bA;

	var EXTENSION_NAME = "Facebook Status";
	var DEFAULT_PATH = "img/default.png", ERROR_PATH = "img/error.png";
	var REQUESTS_PATH      = "img/requests.png";
	var MESSAGES_PATH      = "img/messages.png";
	var NOTIFICATIONS_PATH = "img/notifications.png";

	var currentPath = DEFAULT_PATH;

	browserAction.setBadgeBackgroundColor({ color: [250, 62, 62, 230] });

	this.defaultError = (e) => {
		console.error(e);
		error("Unexpected error, check Console for error message and stack trace");
	};
	this.loginError = () => error("Login to Facebook first");
	var error = message => {
		changeIcon(ERROR_PATH, '!');
		changeTitle(message);
	};

	this.resetTitle = () => changeTitle();
	var changeTitle = message => {
		browserAction.setTitle({ title: EXTENSION_NAME + (message ? ': ' + message : '') });
	};

	this.isRequestsIconShown       = () => currentPath === REQUESTS_PATH;
	this.isMessagesIconShown       = () => currentPath === MESSAGES_PATH;
	this.isNotificationsIconShown  = () => currentPath === NOTIFICATIONS_PATH;

	this.resetIcon = () => changeIcon(DEFAULT_PATH, '');
	this.changeToRequestsIcon = count => changeIcon(REQUESTS_PATH, count);
	this.changeToMessagesIcon = count => changeIcon(MESSAGES_PATH, count);
	this.changeToNotificationsIcon = count => changeIcon(NOTIFICATIONS_PATH, count);
	var changeIcon = (imagePath, badgeText) => {
		browserAction.setIcon({ path: imagePath });
		browserAction.setBadgeText({ text: badgeText.toString() });
		currentPath = imagePath;
	};
}

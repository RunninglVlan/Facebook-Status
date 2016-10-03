// import https://developer.chrome.com/extensions/browserAction

const Presenter = (() => {
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

	let instance, browserAction, currentIcon;

	class Presenter {
		constructor(bA) {
			if (!instance) {
				instance = this;
				browserAction = bA;
				browserAction.setBadgeBackgroundColor({ color: [250, 62, 62, 230] });
				currentIcon = Icons.DEFAULT;
			}
			return instance;
		}

		unexpectedError(e) {
			console.error(e);
			error("Unexpected error, check Console for error message and stack trace");
		}
		loginError() { error("Login to Facebook first"); }

		resetTitle() { changeTitle(); }

		isRequestsIconShown()      { return currentIcon === Icons.REQUESTS; }
		isMessagesIconShown()      { return currentIcon === Icons.MESSAGES; }
		isNotificationsIconShown() { return currentIcon === Icons.NOTIFICATIONS; }

		resetIcon() { changeIcon(Icons.DEFAULT, ''); }
		changeToRequestsIcon(count) { changeIconWithCount(Icons.REQUESTS, count); }
		changeToMessagesIcon(count) { changeIconWithCount(Icons.MESSAGES, count); }
		changeToNotificationsIcon(count) { changeIconWithCount(Icons.NOTIFICATIONS, count); }
	}

	const error = message => {
		changeIcon(Icons.ERROR, '!');
		changeTitle(message);
	};

	const changeTitle = message => {
		browserAction.setTitle({ title: EXTENSION_NAME + (message ? `: ${message}` : '') });
	};

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

	return Presenter;
})();

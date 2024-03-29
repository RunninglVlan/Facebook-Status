﻿// import https://developer.chrome.com/extensions/browserAction

const Presenter = (() => {
	const EXTENSION_NAME = 'Facebook Status';
	const BROWSER_ACTION_PATH = 'img/browserAction/';
	const FILE_EXTENSION = '.png';
	const Icons = {
		DEFAULT: 'default',
		ERROR: 'error',
		REQUESTS: 'requests',
		NOTIFICATIONS: 'notifications'
	};

	let instance, browserAction, currentIcon;

	class Presenter {
		constructor(bA) {
			if (!instance) {
				instance = this;
				browserAction = bA;
				browserAction.setBadgeBackgroundColor({ color: [250, 62, 62, 230] });
				browserAction.setBadgeTextColor({ color: 'white' });
				currentIcon = Icons.DEFAULT;
			}
			return instance;
		}

		unexpectedError(e) {
			console.error(e);
			error('Unexpected error, check Console for error message and stack trace');
		}
		loginError() { error('Login to Facebook first'); }

		resetTitle() { changeTitle(); }

		isRequestsIconShown() { return currentIcon === Icons.REQUESTS; }
		isNotificationsIconShown() { return currentIcon === Icons.NOTIFICATIONS; }

		resetIcon() { changeIcon(Icons.DEFAULT, ''); }
		changeToRequestsIcon(count) { changeIconWithCount(Icons.REQUESTS, count); }
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
		browserAction.setIcon({ path: paths(icon) });
		browserAction.setBadgeText({ text: badgeText.toString() });
		currentIcon = icon;
	};

	const paths = name => {
		return {
			16: path(name, 16),
			32: path(name, 32),
			19: path(name, 19),
			38: path(name, 38)
		}
	};
	const path = (name, pixels) => BROWSER_ACTION_PATH + name + pixels + FILE_EXTENSION;

	return Presenter;
})();

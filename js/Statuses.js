function Statuses() {
	var EXTENSION_NAME = "Facebook Status";
	var STATE_DONE = 4, STATUS_OK  = 200;
	var ICONS_UPDATE_TIME_MS = 5000;
	var MOBILE_URL   = "https://m.facebook.com/";
	this.DESKTOP_URL = "https://www.facebook.com/";
	var DEFAULT_PATH = "img/default.png", ERROR_PATH = "img/error.png";
	var REQUESTS_PATH      = "img/requests.png";
	var MESSAGES_PATH      = "img/messages.png";
	var NOTIFICATIONS_PATH = "img/notifications.png";

	var requestsCount = 0, messagesCount = 0, notificationsCount = 0;
	var xhr = new XMLHttpRequest();
	xhr.timeout = 5000;
	xhr.responseType = "document";
	var iconsUpdateIntervalID;
	var updateIconArray = [];
	var currentPath = DEFAULT_PATH;

	chrome.browserAction.setBadgeBackgroundColor({ color: "#fa3e3e" });

	/**
	 * First tries to select statuses from Mobile site as it's most lightweight.
	 * If it'll fail, tries to select statuses from Desktop site.
	 * If it'll fail too, user might be not logged in, this is checked too.
	 * If user is logged in, there's an unexpected error.
	 * XMLHttpRequest is used instead of Fetch API as latter doesn't return necessary data in response.
	 */
	this.fetch = function (url, parseCallback) {
		requestsCount = messagesCount = notificationsCount = 0;
		if (arguments.length === 0) {
			this.fetch(MOBILE_URL, parseMobile);
		} else {
			xhr.onload = () => {
				if (xhr.readyState === STATE_DONE && xhr.status === STATUS_OK) {
					try {
						window.clearInterval(iconsUpdateIntervalID);
						parseCallback(xhr.response);
						updateIconArray = [];
						updateIcon();
					} catch (e) {
						if (!e.desktop) {
							this.fetch(this.DESKTOP_URL, parseDesktop);
						}
					}
				}
			};
			xhr.open("GET", url);
			xhr.send(null);
		}
	};

	var parseMobile = response => {
		var COUNT_CLASS = "._59tg";
		requestsCount = response.querySelector("#requests_jewel").querySelector(COUNT_CLASS).innerText;
		messagesCount = response.querySelector("#messages_jewel").querySelector(COUNT_CLASS).innerText;
		notificationsCount = response.querySelector("#notifications_jewel").querySelector(COUNT_CLASS).innerText;
	};
	var parseDesktop = response => {
		try {
			requestsCount = response.querySelector("#requestsCountValue").innerText;
			messagesCount = response.querySelector("#mercurymessagesCountValue").innerText;
			notificationsCount = response.querySelector("#notificationsCountValue").innerText;
		} catch (e) {
			chrome.browserAction.setIcon({ path: ERROR_PATH });
			currentPath = ERROR_PATH;
			chrome.browserAction.setBadgeText({ text: '!' });
			var errorMessage = "Unexpected error";
			if (response.querySelector("#login_form")) {
				errorMessage = "Login to Facebook first";
			}
			chrome.browserAction.setTitle({ title: EXTENSION_NAME + ':' + errorMessage });
			// Rethrowing so that updateIcon wouldn't be called
			e.desktop = true;
			throw e;
		}
	};
	var updateIcon = function (imagePath, count) {
		if (arguments.length === 0) {
			chrome.browserAction.setTitle({ title: EXTENSION_NAME });
			if (newRequestsExist()) {
				updateIconArray.push(updateRequestsIcon);
			}
			if (newMessagesExist()) {
				updateIconArray.push(updateMessagesIcon);
			}
			if (newNotificationsExist()) {
				updateIconArray.push(updateNotificationsIcon);
			}
			if (updateIconArray.length === 0) {
				updateIcon(DEFAULT_PATH, '');
			} else if (updateIconArray.length === 1) {
				updateIconArray[0]();
			} else {
				updateIcons();
				iconsUpdateIntervalID = window.setInterval(() => updateIcons(), ICONS_UPDATE_TIME_MS);
			}
		} else if (count !== 0) {
			chrome.browserAction.setIcon({ path: imagePath });
			chrome.browserAction.setBadgeText({ text: count.toString() });
			currentPath = imagePath;
		}
	}.bind(this);
	var updateRequestsIcon = () => {
		updateIcon(REQUESTS_PATH, requestsCount);
	};
	var updateMessagesIcon = () => {
		updateIcon(MESSAGES_PATH, messagesCount);
	};
	var updateNotificationsIcon = () => {
		updateIcon(NOTIFICATIONS_PATH, notificationsCount);
	};
	var newRequestsExist      = () => requestsCount > 0;
	var newMessagesExist      = () => messagesCount > 0;
	var newNotificationsExist = () => notificationsCount > 0;
	var updateIcons = () => {
		var nextFunction = updateIconArray.shift();
		nextFunction();
		updateIconArray.push(nextFunction);
	};

	this.isRequestsIconShown       = () => currentPath === REQUESTS_PATH;
	this.isMessagesIconShown       = () => currentPath === MESSAGES_PATH;
	this.isNotificationsIconShown  = () => currentPath === NOTIFICATIONS_PATH;
}

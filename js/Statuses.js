// import Constants.js

function Statuses() {
	var DEFAULT_PATH = "img/default.png";
	var ERROR_PATH =   "img/error.png";
	var requestsCount = 0;
	var messagesCount = 0;
	var notificationsCount = 0;
	var xhr = new XMLHttpRequest();
	xhr.timeout = Constants.TIME_1S * 5;
	xhr.responseType = "document";
	var intervalID;
	var updateIconArray = [];
	this.currentPath = DEFAULT_PATH;

	/**
	 * First tries to select statuses from Mobile site as it's most lightweight.
	 * If it'll fail, tries to select statuses from Desktop site.
	 * If it'll fail too, user might be not logged in, this is checked too.
	 * If user is logged in, there's an unexpected error.
	 */
	this.fetch = function (url, callback) {
		requestsCount = messagesCount = notificationsCount = 0;
		if (arguments.length === 0) {
			this.fetch(Constants.MOBILE_URL, parseMobile);
		} else {
			xhr.onload = function () {
				if (xhr.readyState === Constants.STATE_DONE && xhr.status === Constants.STATUS_OK) {
					try {
						callback(xhr.response);
						window.clearInterval(intervalID);
						updateIconArray = [];
						updateIcon();
					} catch (e) {
						if (!e.desktop) {
							this.fetch(Constants.DESKTOP_URL, parseDesktop);
						}
					}
				}
			}.bind(this);
			xhr.open("GET", url);
			xhr.send(null);
		}
	};
	var parseMobile = function (response) {
		requestsCount = response.querySelector("#requests_jewel").querySelector("._59tg").innerText;
		messagesCount = response.querySelector("#messages_jewel").querySelector("._59tg").innerText;
		notificationsCount = response.querySelector("#notifications_jewel").querySelector("._59tg").innerText;
	};
	var parseDesktop = function (response) {
		try {
			requestsCount = response.querySelector("#requestsCountValue").innerText;
			messagesCount = response.querySelector("#mercurymessagesCountValue").innerText;
			notificationsCount = response.querySelector("#notificationsCountValue").innerText;
		} catch (e) {
			chrome.browserAction.setIcon({ path: ERROR_PATH });
			chrome.browserAction.setBadgeText({ text: '!' });
			if (response.getElementsByName("email").length === 0) {
				chrome.browserAction.setTitle({ title: Constants.EXTENSION_NAME + ": Unexpected error" });
			} else {
				chrome.browserAction.setTitle({ title: Constants.EXTENSION_NAME + ": Login to Facebook first" });
			}
			// Rethrowing so that updateIcon wouldn't be called
			e.desktop = true;
			throw e;
		}
	};
	var updateIcon = function (imagePath, count) {
		if (arguments.length === 0) {
			chrome.browserAction.setTitle({ title: Constants.EXTENSION_NAME });
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
				intervalID = window.setInterval(function () {
					updateIcons();
				}, Constants.TIME_1S * 5);
			}
		} else {
			chrome.browserAction.setIcon({ path: imagePath });
			chrome.browserAction.setBadgeText({ text: count.toString() });
			this.currentPath = imagePath;
		}
	}.bind(this);
	var updateRequestsIcon = function () {
		updateIcon(Constants.REQUESTS_PATH, requestsCount);
	};
	var updateMessagesIcon = function () {
		updateIcon(Constants.MESSAGES_PATH, messagesCount);
	};
	var updateNotificationsIcon = function () {
		updateIcon(Constants.NOTIFICATIONS_PATH, notificationsCount);
	};
	var updateIcons = function () {
		var nextFunction = updateIconArray.shift();
		nextFunction();
		updateIconArray.push(nextFunction);
	};
	var newRequestsExist = function () {
		return requestsCount > 0;
	};
	var newMessagesExist = function () {
		return messagesCount > 0;
	};
	var newNotificationsExist = function () {
		return notificationsCount > 0;
	};
}

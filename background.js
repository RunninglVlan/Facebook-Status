var Constants = {
	STATE_DONE:  4,
	STATUS_OK:   200,
	TIME_5S:     1000 * 5,
	TIME_30S:    1000 * 30 - 1,
	DESKTOP_URL:"https://www.facebook.com/",
	MOBILE_URL: "https://m.facebook.com/",
	EXTENTION_NAME:    "Facebook Status",
	REQUESTS_PATH:     "img/requests.png",
	MESSAGES_PATH:     "img/messages.png",
	NOTIFICATIONS_PATH:"img/notifications.png"
};

chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.query({ url: Constants.DESKTOP_URL + '*' }, function (tabs) {
		if (tabs.length === 0) {
			var urlToOpen = Constants.DESKTOP_URL;
			if (statuses.currentPath === Constants.REQUESTS_PATH) {
				urlToOpen = "https://www.facebook.com/friends/requests/";
			} else if (statuses.currentPath === Constants.MESSAGES_PATH) {
				urlToOpen = "https://www.facebook.com/messages/";
			} else if (statuses.currentPath === Constants.NOTIFICATIONS_PATH) {
				urlToOpen = "https://www.facebook.com/notifications/";
			}
			chrome.tabs.create({ url: urlToOpen });
		} else {
			chrome.tabs.highlight({ tabs: tabs[0].index });
		}
	});
});

function Statuses() {
	var DEFAULT_PATH = "img/default.png";
	var ERROR_PATH =   "img/error.png";
	var requestsCount = 0;
	var messagesCount = 0;
	var notificationsCount = 0;
	var xhr = new XMLHttpRequest();
	xhr.timeout = Constants.TIME_5S;
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
		requestsCount = response.getElementById("requests_jewel").getElementsByClassName("_59tg")[0].innerText;
		messagesCount = response.getElementById("messages_jewel").getElementsByClassName("_59tg")[0].innerText;
		notificationsCount = response.getElementById("notifications_jewel").getElementsByClassName("_59tg")[0].innerText;
	};
	var parseDesktop = function (response) {
		try {
			requestsCount = response.getElementById("requestsCountValue").innerText;
			messagesCount = response.getElementById("mercurymessagesCountValue").innerText;
			notificationsCount = response.getElementById("notificationsCountValue").innerText;
		} catch (e) {
			chrome.browserAction.setIcon({ path: ERROR_PATH });
			chrome.browserAction.setBadgeText({ text: '!' });
			if (response.getElementsByName("email").length === 0) {
				chrome.browserAction.setTitle({ title: Constants.EXTENTION_NAME + ": Unexpected error" });
			} else {
				chrome.browserAction.setTitle({ title: Constants.EXTENTION_NAME + ": Login to Facebook first" });
			}
			// Rethrowing so that updateIcon wouldn't be called
			e.desktop = true;
			throw e;
		}
	};
	var updateIcon = function (imagePath, count) {
		if (arguments.length === 0) {
			chrome.browserAction.setTitle({ title: Constants.EXTENTION_NAME });
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
				}, Constants.TIME_5S);
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

var statuses = new Statuses();

window.addEventListener("load", function () {
	statuses.fetch();
	window.setInterval(statuses.fetch, Constants.TIME_30S);
}, false);

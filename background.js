// import Statuses.js

var statuses = new Statuses();

window.addEventListener("load", () => {
	var UPDATE_TIME_MS = 1000 * 30 - 1;
	statuses.fetch();
	window.setInterval(() => statuses.fetch(), UPDATE_TIME_MS);
}, false);

chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.query({ url: statuses.DESKTOP_URL + '*' }, tabs => {
		if (tabs.length === 0) {
			var urlToOpen = statuses.DESKTOP_URL;
			if (statuses.isRequestsIconShown()) {
				urlToOpen = "https://www.facebook.com/friends/requests/";
			} else if (statuses.isMessagesIconShown()) {
				urlToOpen = "https://www.facebook.com/messages/";
			} else if (statuses.isNotificationsIconShown()) {
				urlToOpen = "https://www.facebook.com/notifications/";
			}
			chrome.tabs.create({ url: urlToOpen });
		} else {
			chrome.tabs.highlight({ tabs: tabs[0].index });
		}
	});
});

// import Constants.js, Statuses.js

var statuses = new Statuses();

window.addEventListener("load", () => {
	statuses.fetch();
	window.setInterval(() => statuses.fetch(), Constants.TIME_30S);
}, false);

chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.query({ url: Constants.DESKTOP_URL + '*' }, tabs => {
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

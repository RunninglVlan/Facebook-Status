// import Statuses.js, Parser.js, IconUpdater.js, Fetcher.js, Presenter.js

var fetcher, presenter;

window.addEventListener("load", () => {
	var UPDATE_TIME_MS = 1000 * 30 - 1;

	var statuses = new Statuses();
	presenter = new Presenter(chrome.browserAction);
	var parser = new Parser(statuses, presenter);
	var iconUpdater = new IconUpdater(presenter, statuses);
	fetcher = new Fetcher(statuses, parser, iconUpdater);

	fetcher.fetch();
	window.setInterval(() => fetcher.fetch(), UPDATE_TIME_MS);
}, false);

chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.query({ url: fetcher.DESKTOP_URL + '*' }, tabs => {
		if (tabs.length === 0) {
			var urlToOpen = fetcher.DESKTOP_URL;
			if (presenter.isRequestsIconShown()) {
				urlToOpen = "https://www.facebook.com/friends/requests/";
			} else if (presenter.isMessagesIconShown()) {
				urlToOpen = "https://www.facebook.com/messages/";
			} else if (presenter.isNotificationsIconShown()) {
				urlToOpen = "https://www.facebook.com/notifications/";
			}
			chrome.tabs.create({ url: urlToOpen });
		} else {
			chrome.tabs.highlight({ tabs: tabs[0].index });
		}
	});
});

// import Statuses.js, Presenter.js, Parser.js, IconUpdater.js, Fetcher.js

let fetcher, presenter;

window.addEventListener("load", () => {
	const UPDATE_TIME_MS = 1000 * 30;

	const statuses = new Statuses();
	presenter = new Presenter(chrome.browserAction);
	const parser = new Parser(statuses, presenter);
	const iconUpdater = new IconUpdater(statuses, presenter);
	fetcher = new Fetcher(statuses, parser, iconUpdater);

	fetcher.fetch();
	window.setInterval(() => fetcher.fetch(), UPDATE_TIME_MS);
}, false);

chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.query({ url: Fetcher.DESKTOP_URL + '*' }, tabs => {
		if (tabs.length === 0) {
			let urlToOpen = Fetcher.DESKTOP_URL;
			if (presenter.isRequestsIconShown()) {
				urlToOpen += "friends/requests/";
			} else if (presenter.isMessagesIconShown()) {
				urlToOpen += "messages/";
			} else if (presenter.isNotificationsIconShown()) {
				urlToOpen += "notifications/";
			}
			chrome.tabs.create({ url: urlToOpen });
		} else {
			chrome.tabs.highlight({ tabs: tabs[0].index });
		}
	});
});

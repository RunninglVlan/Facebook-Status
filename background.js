importScripts('js/Statuses.js', 'js/Presenter.js', 'js/Parser.js', 'js/IconUpdater.js', 'js/Fetcher.js');

let presenter;

chrome.runtime.onInstalled.addListener(() => {
    const UPDATE_TIME_MS = 1000 * 30;

    const statuses = new Statuses();
    presenter = new Presenter(chrome.action);
    const parser = new Parser(statuses, presenter);
    const iconUpdater = new IconUpdater(statuses, presenter);
    const fetcher = new Fetcher(statuses, parser, iconUpdater);

    fetcher.fetch();
    setInterval(() => fetcher.fetch(), UPDATE_TIME_MS);
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({url: Fetcher.DESKTOP_URL + '*'}, tabs => {
        if (tabs.length === 0) {
            let urlToOpen = Fetcher.DESKTOP_URL;
            if (presenter.isRequestsIconShown()) {
                urlToOpen += 'friends/requests/';
            } else if (presenter.isNotificationsIconShown()) {
                urlToOpen += 'notifications/';
            }
            chrome.tabs.create({url: urlToOpen});
        } else {
            chrome.tabs.highlight({tabs: tabs[0].index});
        }
    });
});

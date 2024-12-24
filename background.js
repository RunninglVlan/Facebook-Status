importScripts('js/Statuses.js', 'js/Presenter.js', 'js/Parser.js', 'js/IconUpdater.js', 'js/Fetcher.js');

let presenter;

const initialize = () => {
    const UPDATE_TIME_MIN = 0.5;

    const statuses = new Statuses();
    presenter = new Presenter(chrome.action);
    const parser = new Parser(statuses, presenter);
    const iconUpdater = new IconUpdater(statuses, presenter);
    const fetcher = new Fetcher(statuses, parser, iconUpdater);

    chrome.alarms.create('fetch', { periodInMinutes: UPDATE_TIME_MIN });

    fetcher.fetch();
    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'fetch') {
            fetcher.fetch();
        }
    });
}

chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);

chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({url: Fetcher.DESKTOP_URL + '*'}, tabs => {
        if (tabs.length === 0) {
            if (!presenter) {
                presenter = new Presenter(chrome.action);
            }
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

// import https://developer.chrome.com/docs/extensions/reference/api/action

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

    let instance, action, currentIcon;

    class Presenter {
        constructor(a) {
            if (!instance) {
                instance = this;
                action = a;
                action.setBadgeBackgroundColor({color: [250, 62, 62, 230]});
                action.setBadgeTextColor({color: 'white'});
                chrome.storage.local.get('currentIcon', result => {
                    currentIcon = result.currentIcon || Icons.DEFAULT;
                });
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
        action.setTitle({title: EXTENSION_NAME + (message ? `: ${message}` : '')});
    };

    const changeIconWithCount = (icon, count) => {
        if (count) {
            changeIcon(icon, count);
        }
    };
    const changeIcon = (icon, badgeText) => {
        action.setIcon({path: paths(icon)});
        action.setBadgeText({text: badgeText.toString()});
        currentIcon = icon;
        chrome.storage.local.set({ currentIcon });
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

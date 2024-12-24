// import Statuses.js, Parser.js, IconUpdater.js

const Fetcher = (() => {
    const STATE_DONE = 4, STATUS_OK = 200;
    const MOBILE_URL = 'https://m.facebook.com/';

    let instance, statuses, parser, iconUpdater;
    const xhr = new XMLHttpRequest();
    xhr.timeout = 5000;
    xhr.responseType = 'document';

    return class {
        static get DESKTOP_URL() { return 'https://www.facebook.com/'; }

        constructor(s, p, iU) {
            if (!instance) {
                instance = this;
                statuses = s;
                parser = p;
                iconUpdater = iU;
            }
            return instance;
        }

        /**
         * First tries to select statuses from Mobile site as it's most lightweight.
         * If it'll fail, tries to select statuses from Desktop site.
         * If it'll fail too, user might be not logged in, this is checked too.
         * If user is logged in, there's an unexpected error.
         * XMLHttpRequest is used instead of Fetch API as latter doesn't return necessary data in response.
         */
        fetch(url = MOBILE_URL) {
            statuses.resetCounts();
            xhr.onload = () => {
                if (xhr.readyState === STATE_DONE && xhr.status === STATUS_OK) {
                    iconUpdater.clearTimer();
                    if (parser.parse(xhr.response)) {
                        iconUpdater.updateIcons();
                    }
                }
            };
            xhr.open('GET', url);
            xhr.send(null);
        }
    }
})();

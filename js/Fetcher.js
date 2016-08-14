// import Statuses.js, Parser.js, IconUpdater.js

function Fetcher(s, p, iU) {
	var statuses = s, parser = p, iconUpdater = iU;

	var STATE_DONE = 4, STATUS_OK  = 200;
	var MOBILE_URL  = "https://m.facebook.com/";
	this.DESKTOP_URL = "https://www.facebook.com/";

	var xhr = new XMLHttpRequest();
	xhr.timeout = 5000;
	xhr.responseType = "document";

	/**
	 * First tries to select statuses from Mobile site as it's most lightweight.
	 * If it'll fail, tries to select statuses from Desktop site.
	 * If it'll fail too, user might be not logged in, this is checked too.
	 * If user is logged in, there's an unexpected error.
	 * XMLHttpRequest is used instead of Fetch API as latter doesn't return necessary data in response.
	 */
	this.fetch = (url = MOBILE_URL, parseCallback = parser.parseMobile) => {
		statuses.resetCounts();
		xhr.onload = () => {
			if (xhr.readyState === STATE_DONE && xhr.status === STATUS_OK) {
				try {
					iconUpdater.clearTimer();
					parseCallback(xhr.response);
					iconUpdater.updateIcons();
				} catch (e) {
					if (!e.desktop) {
						this.fetch(this.DESKTOP_URL, parser.parseDesktop);
					}
				}
			}
		};
		xhr.open("GET", url);
		xhr.send(null);
	};
}

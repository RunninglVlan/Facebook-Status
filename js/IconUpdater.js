// import Statuses.js, Presenter.js

const IconUpdater = (() => {
	const ICONS_UPDATE_TIME_MS = 5000;

	let instance, statuses, presenter;
	let iconsUpdateIntervalID, updateIconArray;

	class IconUpdater {
		constructor(s, p) {
			if (!instance) {
				instance = this;
				statuses = s;
				presenter = p;
			}
			return instance;
		}

		clearTimer() { window.clearInterval(iconsUpdateIntervalID); }
		updateIcons() {
			updateIconArray = [];
			presenter.resetTitle();
			if (statuses.getRequestsCount()) {
				updateIconArray.push(() => {
					presenter.changeToRequestsIcon(statuses.getRequestsCount());
				});
			}
			if (statuses.getMessagesCount()) {
				updateIconArray.push(() => {
					presenter.changeToMessagesIcon(statuses.getMessagesCount());
				});
			}
			if (statuses.getNotificationsCount()) {
				updateIconArray.push(() => {
					presenter.changeToNotificationsIcon(statuses.getNotificationsCount());
				});
			}
			if (updateIconArray.length === 0) {
				presenter.resetIcon();
			} else if (updateIconArray.length === 1) {
				updateIconArray[0]();
			} else {
				nextIcon();
				iconsUpdateIntervalID = window.setInterval(() => nextIcon(), ICONS_UPDATE_TIME_MS);
			}
		}
	}

	const nextIcon = () => {
		const nextFunction = updateIconArray.shift();
		nextFunction();
		updateIconArray.push(nextFunction);
	};

	return IconUpdater;
})();

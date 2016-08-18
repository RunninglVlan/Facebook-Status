// import Presenter.js, Statuses.js

function IconUpdater(p, s) {
	var presenter = p, statuses = s;

	var ICONS_UPDATE_TIME_MS = 5000;

	var iconsUpdateIntervalID;
	var updateIconArray;

	this.clearTimer = () => window.clearInterval(iconsUpdateIntervalID);
	this.updateIcons = () => {
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
	};

	var nextIcon = () => {
		var nextFunction = updateIconArray.shift();
		nextFunction();
		updateIconArray.push(nextFunction);
	};
}

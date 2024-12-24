// import Statuses.js, Presenter.js

const IconUpdater = (() => {
    const ICONS_UPDATE_TIME_MS = 5000;

    let instance, statuses, presenter;
    let iconsUpdateIntervalId, updateIconArray;

    class IconUpdater {
        constructor(s, p) {
            if (!instance) {
                instance = this;
                statuses = s;
                presenter = p;
            }
            return instance;
        }

        clearTimer() { window.clearInterval(iconsUpdateIntervalId); }

        updateIcons() {
            updateIconArray = [];
            presenter.resetTitle();
            if (statuses.requestsCount()) {
                updateIconArray.push(() => {
                    presenter.changeToRequestsIcon(statuses.requestsCount());
                });
            }
            if (statuses.notificationsCount()) {
                updateIconArray.push(() => {
                    presenter.changeToNotificationsIcon(statuses.notificationsCount());
                });
            }
            if (updateIconArray.length === 0) {
                presenter.resetIcon();
            } else if (updateIconArray.length === 1) {
                updateIconArray[0]();
            } else {
                nextIcon();
                iconsUpdateIntervalId = window.setInterval(() => nextIcon(), ICONS_UPDATE_TIME_MS);
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

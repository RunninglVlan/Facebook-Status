const Statuses = (() => {
    let instance;
    let counts = {
        requests: 0, notifications: 0
    };

    return class {
        constructor() {
            if (!instance) {
                instance = this;
            }
            return instance;
        }

        setCounts(c) { counts = c; }

        resetCounts() {
            counts.requests = counts.notifications = 0;
        }

        requestsCount() { return Number(counts.requests); }
        notificationsCount() { return Number(counts.notifications); }
    }
})();

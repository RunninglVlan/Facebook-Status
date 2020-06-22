const Statuses = (() => {
	let instance;
	let counts = {
		requests: 0, messages: 0, notifications: 0
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
			counts.requests = counts.messages = counts.notifications = 0;
		}
		requestsCount() { return Number(counts.requests); }
		messagesCount() { return Number(counts.messages); }
		notificationsCount() { return Number(counts.notifications); }
	}
})();

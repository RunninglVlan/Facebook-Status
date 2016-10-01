function Statuses() {
	let counts = {
		requests: 0, messages: 0, notifications: 0
	};
	this.setCounts = c => counts = c;

	this.resetCounts = () => {
		counts.requests = 0;
		counts.messages = 0;
		counts.notifications = 0;
	};
	this.getRequestsCount = () => Number(counts.requests);
	this.getMessagesCount = () => Number(counts.messages);
	this.getNotificationsCount = () => Number(counts.notifications);
}

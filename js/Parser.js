// import Statuses.js, Presenter.js

function Parser(s, p) {
	var statuses = s, presenter = p;

	var counts = {
		requests: 0, messages: 0, notifications: 0
	};

	this.parseMobile = response => {
		var COUNT_CLASS = "._59tg";
		counts.requests = response.querySelector("#requests_jewel").querySelector(COUNT_CLASS).innerText;
		counts.messages = response.querySelector("#messages_jewel").querySelector(COUNT_CLASS).innerText;
		counts.notifications = response.querySelector("#notifications_jewel").querySelector(COUNT_CLASS).innerText;
		statuses.setCounts(counts);
	};
	this.parseDesktop = response => {
		try {
			counts.requests = response.querySelector("#requestsCountValue").innerText;
			counts.messages = response.querySelector("#mercurymessagesCountValue").innerText;
			counts.notifications = response.querySelector("#notificationsCountValue").innerText;
		} catch (e) {
			if (isLoginPage(response)) {
				presenter.loginError();
			} else {
				presenter.unexpectedError(e);
			}
			e.desktop = true;
			throw e;
		}
		statuses.setCounts(counts);
	};

	var isLoginPage = response => response.querySelector("#login_form");
}

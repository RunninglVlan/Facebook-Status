// import Statuses.js, Presenter.js

const Parser = (() => {
	let instance, statuses, presenter;
	const counts = {
		requests: 0, messages: 0, notifications: 0
	};

	class Parser {
		constructor(s, p) {
			if (!instance) {
				instance = this;
				statuses = s;
				presenter = p;
			}
			return instance;
		}

		parseMobile(response) {
			const COUNT_CLASS = '._59tg';
			counts.requests = response.querySelector('#requests_jewel').querySelector(COUNT_CLASS).innerText;
			counts.messages = response.querySelector('#messages_jewel').querySelector(COUNT_CLASS).innerText;
			counts.notifications = response.querySelector('#notifications_jewel').querySelector(COUNT_CLASS).innerText;
			statuses.setCounts(counts);
		}
		parseDesktop(response) {
			try {
				counts.requests = response.querySelector('#requestsCountValue').innerText;
				counts.messages = response.querySelector('#mercurymessagesCountValue').innerText;
				counts.notifications = response.querySelector('#notificationsCountValue').innerText;
			} catch (e) {
				if (response && isLoginPage(response)) {
					presenter.loginError();
				} else {
					presenter.unexpectedError(e);
				}
				e.desktop = true;
				throw e;
			}
			statuses.setCounts(counts);
		}
	}

	const isLoginPage = response => response.querySelector('#login_form');

	return Parser;
})();

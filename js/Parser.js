// import Statuses.js, Presenter.js

const Parser = (() => {
	let instance, statuses, presenter;
	const counts = {
		requests: 0, notifications: 0
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
			counts.requests = count('#requests_jewel');
			counts.notifications = count('#notifications_jewel');
			statuses.setCounts(counts);

			function count(type) {
				const COUNT_CLASS = '._59tg';
				return response.querySelector(type).querySelector(COUNT_CLASS).innerText;
			}
		}
		parseDesktop(response) {
			try {
				counts.requests = response.querySelector('#requestsCountValue').innerText;
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

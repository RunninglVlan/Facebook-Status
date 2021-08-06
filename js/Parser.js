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

		parse(response) {
			try {
				counts.requests = count('#requests_jewel');
				counts.notifications = count('#notifications_jewel');
			} catch (e) {
				if (response && isLoginPage(response)) {
					presenter.loginError();
				} else {
					presenter.unexpectedError(e);
				}
				return false;
			}
			statuses.setCounts(counts);
			return true;

			function count(type) {
				const COUNT_CLASS = '._59tg';
				return response.querySelector(type).querySelector(COUNT_CLASS).innerText;
			}
		}
	}

	const isLoginPage = response => response.querySelector('#signup-button');

	return Parser;
})();

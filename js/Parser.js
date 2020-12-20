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
			counts.requests = count('friends');
			counts.messages = 0;
			counts.notifications = count('notifications');
			statuses.setCounts(counts);

			function count(type) {
				const insideParentheses = /\(([^)]+)\)/;
				const found = response.querySelector(`nav a[href*='/${type}']`).innerText.match(insideParentheses);
				return found ? found[1] : 0;
			}
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

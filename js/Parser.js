// import Statuses.js, Presenter.js

const Parser = (() => {
    const DIV_START = '<div';
    const DIV_END = '</div>';

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

        /**
         * If parsing fails, we check if user is not logged in.
         * Otherwise, there's an unexpected error.
         */
		parse(response) {
            const divStartIndex = response.search(/<div[^>]*aria-label="Notifications"[^>]*>/);
            if (divStartIndex !== -1) {
                const divContent = this.extractDivContent(response, divStartIndex);
                const match = divContent.match(/<span[^>]*>(\d+)<\/span>/);
                counts.notifications = match ? match[1] : 0;
            } else {
                if (response && isLoginPage(response)) {
                    presenter.loginError();
                } else if (!isLoading(response)) {
                    presenter.unexpectedError(response);
                }
                return false;
            }
            statuses.setCounts(counts);
            return true;
        }

        extractDivContent(text, startIndex) {
            const divStart = text.lastIndexOf(DIV_START, startIndex);
            let divEnd = text.indexOf(DIV_END, startIndex);
            let openDivs = 1;
            let currentIndex = divStart + 5;

            while (openDivs > 0 && divEnd !== -1) {
                const nextOpenDiv = text.indexOf(DIV_START, currentIndex);
                const nextCloseDiv = text.indexOf(DIV_END, currentIndex);

                if (nextCloseDiv !== -1 && (nextOpenDiv === -1 || nextCloseDiv < nextOpenDiv)) {
                    openDivs--;
                    currentIndex = nextCloseDiv + 6;
                } else if (nextOpenDiv !== -1) {
                    openDivs++;
                    currentIndex = nextOpenDiv + 5;
                } else {
                    break;
                }
            }

            if (openDivs === 0) {
                return text.substring(divStart, currentIndex);
            }
            return null;
        }

        findDivEnd(text) {
            let openDivs = 0;
            let currentIndex = 0;

            while (currentIndex < text.length) {
                const nextOpenDiv = text.indexOf(DIV_START, currentIndex);
                const nextCloseDiv = text.indexOf(DIV_END, currentIndex);

                if (nextCloseDiv !== -1 && (nextOpenDiv === -1 || nextCloseDiv < nextOpenDiv)) {
                    openDivs--;
                    currentIndex = nextCloseDiv + 6;
                    if (openDivs === 0) {
                        return currentIndex;
                    }
                } else if (nextOpenDiv !== -1) {
                    openDivs++;
                    currentIndex = nextOpenDiv + 5;
                } else {
                    break;
                }
            }
            return -1;
        };
    }

    const isLoginPage = response => response.match(/name="login"/);
    const isLoading = response => !response.match(/role=/);

    return Parser;
})();

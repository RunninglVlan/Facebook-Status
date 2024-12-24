// import Statuses.js, Parser.js, IconUpdater.js

const Fetcher = (() => {
    const TIMEOUT = 5000;

    let instance, statuses, parser, iconUpdater;

    return class {
        static get DESKTOP_URL() { return 'https://www.facebook.com/'; }

        constructor(s, p, iU) {
            if (!instance) {
                instance = this;
                statuses = s;
                parser = p;
                iconUpdater = iU;
            }
            return instance;
        }

        fetch(url = Fetcher.DESKTOP_URL) {
            statuses.resetCounts();
            fetch(url, {
                signal: AbortSignal.timeout(TIMEOUT),
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'accept-encoding': 'gzip, deflate, br, zstd',
                    'accept-language': 'en-US,en;q=0.9'
                }
            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let responseText = '';
                    let divContent = '';
                    let divFound = false;

                    let readChunk = () => {
                        return reader.read().then(({done, value}) => {
                            if (done) {
                                return divContent || responseText;
                            }
                            responseText += decoder.decode(value, {stream: true});
                            if (!divFound) {
                                const divStartIndex = responseText.indexOf('Account Controls and Settings');
                                if (divStartIndex !== -1) {
                                    divFound = true;
                                    divContent = parser.extractDivContent(responseText, divStartIndex);
                                    if (divContent) {
                                        return divContent;
                                    }
                                }
                            } else {
                                divContent += responseText;
                                const divEndIndex = parser.findDivEnd(divContent);
                                if (divEndIndex !== -1) {
                                    return divContent.substring(0, divEndIndex + 6);
                                }
                            }
                            return readChunk();
                        });
                    }

                    return readChunk();
                })
                .then(responseText => {
                    iconUpdater.clearTimer();
                    if (parser.parse(responseText)) {
                        iconUpdater.updateIcons();
                    }
                })
        }
    }
})();

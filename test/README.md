## How to use stub in manual testing
- Use some CORS enabled WebServer, e.g., Node's _express_ with _cors_ - `node ./test/cors-web-server/index.js`
- Make facebookStub.html be available through http://localhost/test/facebookStub.html
- Add http://localhost/test/facebookStub.html to manifest permissions
- Update URL constants in Fetcher:
  ```js
  const MOBILE_URL = 'http://localhost/test/facebookStub.html';
  static get DESKTOP_URL() { return MOBILE_URL; }
  ```
- Make _#mobile/#login_form_ in facebookStub.html throw Errors to test all states. Update counts

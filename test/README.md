## Visualising response page
When receiving `HTMLDocument response`, e.g. in *Parser.js*, open a window and then inspect it with DevTools:

    var debug = window.open('', '_blank', 'width=800,height=600');
    debug.document.body.innerHTML = response.documentElement.innerHTML;

Unfortunately this doesn't work in Firefox

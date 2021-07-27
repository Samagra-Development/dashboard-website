let innerDoc;

function waitFor(selector, document) {
    return new Promise(function (res, rej) {
        waitForElementToDisplay(selector, 10);
        function waitForElementToDisplay(selector, time) {
            if (document.getElementsByTagName(selector) != null && document.getElementsByTagName(selector).length > 0) {
                res(document.getElementsByTagName(selector));
            }
            else {
                setTimeout(function () {
                    waitForElementToDisplay(selector, time);
                }, time);
            }
        }
    });
}

function waitForByID(selector, document) {
    return new Promise(function (res, rej) {
        waitForElementToDisplay(selector, 10);
        function waitForElementToDisplay(selector, time) {
            if (document.getElementById(selector) != null) {
                res(document.getElementById(selector));
            }
            else {
                setTimeout(function () {
                    waitForElementToDisplay(selector, time);
                }, time);
            }
        }
    });
}

waitForByID("metabaseIframeID", document).then((s) => {
    console.log("Iframe found");
    // setInterval(function () {
    //     var iframe = document.getElementById('metabaseIframeID');
    //     innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    // }, 50);
    waitFor("fieldset", innerDoc).then((s) => {
        console.log("Iframe rendered");
        const node = document.getElementsByTagName("fieldset")[0];
        if(node.ownerDocument !== document) {
            node.style.visibility = "hidden";
        }
    });
});
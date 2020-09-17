const Ajax = Object.create(null);

const fetch = window.fetch;
const json = (response) => response.json();

Ajax.query = function (requestObj) {
    return fetch("/", {
        "method": "POST",
        "body": JSON.stringify(requestObj),
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

export default Object.freeze(Ajax);

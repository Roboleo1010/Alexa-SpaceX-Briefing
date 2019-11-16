const https = require('https');
const helpers = require('./helpers');

exports.handler = (event, context, callback) => {
    getData("https://api.spacexdata.com/v3/launches/next", buildResponse);

    function getData(url, callback) {
        var body = "";

        https.get(url, (response) => {
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                callback(JSON.parse(body));
            });
        });
    }

    function buildResponse(json) {
        try {
            let responseData = {
                "uid": "urn:uuid:1335c695-cfb8-4ebb-abbd-80da344efa6b",
                "updateDate": new Date().toISOString(),
                "titleText": "Nächster SpaceX Start:",
                "mainText": ` Die nächste SpaceX Mission ist ${json.mission_name} am ${helpers.buildDateTimeFromString(json.launch_date_utc)}. Sie wird von einer ${json.rocket.rocket_name} von ${json.launch_site.site_name_long} durchgeführt.`,
                "redirectionUrl": "https://www.spacex.com/"
            };

            const response = {
                statusCode: 200,
                body: JSON.stringify(responseData),
            };

            console.log(response);
            callback(null, response);
        }
        catch (error) {
            const response = {
                statusCode: 500,
                body: error,
            };

            console.log(response);
            callback(null, response);
        }
    }
};
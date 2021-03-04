//
/**
 * This function serves as the configuration when ApplicationContext.js
 * invokes it. As more environments are deemed necessary, they will be
 * added as additional 'env' variables.
 *
 * @param {string} env The environment to configure the site for.
 *
 */
var SiteConfig = function (env, buildNumber) {
    var LocalDev = {
        assetRoot: "http://localhost:9081",
        assetUrlPrefix: "http://localhost:9081/assets",
        lmvUrl: "https://developer.api.autodesk.com/modelderivative/v2/viewers",
        baseUrl: "",
    };

    // Override the env in your env.
    var Dev = {
    };

    var Stage = {
    };

    var Prod = {
    };

    var result = LocalDev;

    switch (env) {
        case "stage":
            result = Object.assign({}, result, Stage);
            break;
        case "dev":
            result = Object.assign({}, result, Dev);
            break;
        case "prod":
            result = Object.assign({}, result, Prod);
            break;
    }

    result.toSCSSEnv = function () {
        var str = "";
        for (var key in result) {
            if (typeof result[key] == "string") {
                str += `$${key}: '${result[key]}'; `;
            }
        }
        return str;
    };
    return result;
};

module.exports = SiteConfig;
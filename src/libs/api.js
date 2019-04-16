/**
 * API Functions
 */
/* global fetch console */

// Consts and Libs
import { AppConfig, APIConfig } from "@constants/";

// Config
const APIURL = APIConfig.apiUrl;
const ENDPOINTS = APIConfig.endpoints;

let USER_AGENT = `${AppConfig.appName}`;

// Enable debug output when in Debug mode
const DEBUG_MODE = AppConfig.DEV;

// Number each API request (used for debugging)
let requestCounter = 0;

/* Helper Functions ==================================================================== */

/**
 * Debug or not to debug
 */
function debug(str, title) {
    if (DEBUG_MODE && (title || str)) {
        if (title) {
            console.log(`=== DEBUG: ${title} ===========================`);
        }
        if (str) {
            console.log(str);
            console.log("%c ...", "color: #CCC");
        }
    }
}

/**
 * Sends requests to the API
 */
function handleError(err) {
    let error = "";
    if (typeof err === "string") {
        error = err;
    } else if (err.message) {
        error = err.message;
    }

    if (!err) {
        error = "Something is wrong!";
    }
    return error;
}

/**
 * Convert param object into query string
 * eg.
 *   {foo: 'hi there', bar: { blah: 123, quux: [1, 2, 3] }}
 *   foo=hi there&bar[blah]=123&bar[quux][0]=1&bar[quux][1]=2&bar[quux][2]=3
 */
function serialize(obj, prefix) {
    const str = [];

    Object.keys(obj).forEach(p => {
        const k = prefix ? `${prefix}[${p}]` : p;
        const v = obj[p];

        str.push(
            v !== null && typeof v === "object" ? serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
        );
    });

    return str.join("&");
}

/**
 * Sends requests to the API
 */
function fetcher(method, endpoint, params, body) {
    return new Promise(async (resolve, reject) => {
        requestCounter += 1;
        const requestNum = requestCounter;

        // After x seconds, let's call it a day!
        const timeoutAfter = 60;
        const apiTimedOut = setTimeout(() => reject("Request Timeout!"), timeoutAfter * 1000);

        if (!method || !endpoint) {
            return reject(new Error("Missing params (AppAPI.fetcher)."));
        }

        // Build request
        const req = {
            method: method.toUpperCase(),
            headers: {
                "User-Agent": USER_AGENT,
            },
        };

        // Add Endpoint Params
        let urlParams = "";
        if (params) {
            // Object - eg. /token?username=this&password=0
            if (typeof params === "object") {
                // Replace matching params in API routes eg. /recipes/{param}/foo
                for (const param in params) {
                    if (endpoint.includes(`{${param}}`)) {
                        endpoint = endpoint.split(`{${param}}`).join(params[param]);
                        delete params[param];
                    }
                }

                // Check if there's still an 'id' prop, /{id}?
                if (params.id !== undefined) {
                    if (typeof params.id === "string" || typeof params.id === "number") {
                        urlParams = `/${params.id}`;
                        delete params.id;
                    }
                }

                // Check if there's still an 'action' prop, /{id}/{action}?
                if (typeof params.action !== "undefined") {
                    if (typeof params.action === "string") {
                        urlParams += `/${params.action}`;
                        delete params.action;
                    }
                }

                // Add the rest of the params as a query string if any left
                Object.keys(params).length > 0 ? (urlParams += `?${serialize(params)}`) : null;

                // String or Number - eg. /recipes/23
            } else if (typeof params === "string" || typeof params === "number") {
                urlParams = `/${params}`;

                // Something else? Just log an error
            } else {
                debug("You provided params, but it wasn't an object!", APIURL + endpoint + urlParams);
            }
        }

        // Add Body
        if (body) {
            if (typeof body === "object") {
                req.body = JSON.stringify(body);
            } else {
                req.body = body;
            }
            req.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }

        const thisUrl = APIURL + endpoint + urlParams;

        debug("", `API Request #${requestNum} to ${thisUrl}`);

        // Make the request
        return fetch(thisUrl, req)
            .then(async rawRes => {
                // API got back to us, clear the timeout
                clearTimeout(apiTimedOut);

                let jsonRes = {};

                try {
                    jsonRes = await rawRes.json();
                } catch (error) {
                    const err = { message: "Invalid Json!" };
                    debug(err);
                }

                // Only continue if the header is successful
                if (rawRes && rawRes.status === 200) {
                    return jsonRes || rawRes;
                }
                throw jsonRes || rawRes;
            })
            .then(res => {
                debug(res, `API Response #${requestNum} from ${thisUrl}`);
                return resolve(res);
            })
            .catch(err => {
                // API got back to us, clear the timeout
                clearTimeout(apiTimedOut);

                debug(err, APIURL + endpoint + urlParams);
                return reject(err);
            });
    });
}

/* Create the API Export ==================================================================== */
/**
 * Build services from Endpoints
 * - So we can call AppAPI.channel.get() for example
 */
const AppAPI = {
    handleError,
};

ENDPOINTS.forEach((endpoint, key) => {
    AppAPI[key] = {
        get: (params, payload) => fetcher("GET", endpoint, params, payload),
        post: (params, payload) => fetcher("POST", endpoint, params, payload),
        patch: (params, payload) => fetcher("PATCH", endpoint, params, payload),
        put: (params, payload) => fetcher("PUT", endpoint, params, payload),
        delete: (params, payload) => fetcher("DELETE", endpoint, params, payload),
    };
});

/* Export ==================================================================== */
export default AppAPI;

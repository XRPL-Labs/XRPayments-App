/**
 * API Config
 */

export default {
    apiUrl: "https://www.xrptipbot.com/xrpayit/api",

    endpoints: new Map([
        // Auth
        ["channel", "/channel:{channel_id}"],
        ["rate", "/channel:{channel_id}/amount:{amount}/currency:{currency}"],
    ]),
};

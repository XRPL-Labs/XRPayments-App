import * as ActionTypes from "./actionTypes";

import AppAPI from "@libs/api";

export const save_settings = settings => ({
    type: ActionTypes.SAVE_SETTINGS,
    payload: settings,
});

export const reset_settings = () => ({
    type: ActionTypes.RESET_SETTINGS,
});

export const get_settings = channel_id => {
    return dispatch => {
        return new Promise(async (resolve, reject) => {
            if (!channel_id) {
                return reject("Empty channel_id");
            }

            return AppAPI.channel
                .get({ channel_id })
                .then(res => {
                    if (res.error === true) {
                        return reject("Invalid Channel Id");
                    }

                    const { destination } = res;

                    dispatch({
                        type: ActionTypes.SAVE_SETTINGS,
                        payload: {
                            ...destination,
                            channel: channel_id,
                        },
                    });

                    return resolve(channel_id);
                })
                .catch(err => reject(err));
        });
    };
};

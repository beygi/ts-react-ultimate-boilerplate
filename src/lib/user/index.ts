/**
 * @module User
 */

import * as _ from "lodash";
import { updateUser } from "../../redux/app/actions";
import { store } from "../../redux/store";
import t from "../../services/trans/i18n";

/**
 * singleton class for representing the current user
 */
export default class USER {
    public static getInstance() {
        if (!this.instance) {
            this.instance = new USER();
        }
        return this.instance;
    }

    private static instance: USER;
    private user: any | null;

    private constructor() {
        // get user object from redux if available
        this.user = store.getState().app.user || null;
    }

    public hasRealmRole(role) {
        return false;
    }

    public UpdateProfile(extra?: {}) {
            store.dispatch(updateUser({ ...extra }));
            this.getCurrent();
    }

    public getCurrent() {
        this.user = store.getState().app.user || null;
        return this.user;
    }

    public getToken() {
        if (this.user) {
            return {
                name: "Authorization",
                value: this.user.token,
                mode: "Bearer",
            };
        }

    }

    /** set user object */
    public setUser(user: any) {
        this.user = user;
    }

    public destroy() {
        this.user = null;
    }

}

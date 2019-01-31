/**
 * @module Tools
 */
import * as _ from "lodash";
import { store } from "../../redux/store";

/**
 * a tool class which is provie useful functions
 */
export default class Tools {
    /** returns sample data from stroe
     *    this function uses redux store to access informations
     */
    public static getDataFromStore(info: string) {
        _.get(store.getState(), `app.data.${info}`, 0);
    }
    public constructor() {
        // empty;
    }
}

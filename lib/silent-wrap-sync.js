'use strict';

import getCreateWrapped from './_get-create-wrapped';


/**
 * Silent version of wrapSync
 * @return {Function} [description]
 */
export default function wrapSync(...args) {
    const createWrapped = getCreateWrapped(true, true);
    const w = createWrapped.call(this, {});
    return w.apply(w, args);
}

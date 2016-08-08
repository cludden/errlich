'use strict';

import getCreateWrapped from './_get-create-wrapped';


/**
 * Silent version of wrap
 * @return {Function}
 */
export default function silentWrap(...args) {
    const createWrapped = getCreateWrapped(false, true);
    const w = createWrapped.call(this, {});
    return w.apply(w, args);
}

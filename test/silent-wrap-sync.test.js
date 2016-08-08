'use strict';

import Errlich from '../lib';
import td from 'testdouble';
import test from 'tape';
import { attempt } from 'lodash';


test('#silentWrap should not call notifiers', function(t) {
    const errlich = new Errlich();
    const notify = td.function();
    errlich.addNotifier(notify);
    const wrapped = errlich.silentWrapSync(403, function() {
        throw new Error('uh oh');
    });
    const err = attempt(wrapped);
    t.error(td.verify(notify(td.matchers.anything()), { times: 0 }), 'should not call notifiers');
    t.equal(err.isBoom, true, 'should be boom error');
    t.equal(err.output.statusCode, 403, 'should have status: 403');
    t.end();
});

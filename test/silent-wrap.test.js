'use strict';

import Errlich from '../lib';
import td from 'testdouble';
import test from 'tape';


test('#silentWrap should not call notifiers', function(t) {
    const errlich = new Errlich();
    const notify = td.function();
    errlich.addNotifier(notify);
    function fail(cb) {
        process.nextTick(cb.bind(null, new Error('uh oh')));
    }
    fail(errlich.silentWrap(403, function(err) {
        t.error(td.verify(notify(td.matchers.anything()), { times: 0 }), 'should not call notifiers');
        t.equal(err.isBoom, true, 'should be boom error');
        t.equal(err.output.statusCode, 403, 'should have status: 403');
        t.end();
    }));
});

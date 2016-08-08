'use strict';

import Errlich from '../lib';
import td from 'testdouble';
import test from 'tape';


const errlich = new Errlich();

test('#notify should be defined', function(t) {
    t.equal(typeof errlich.notify, 'function', 'should be a function');
    t.end();
});

test('#notify should call notifiers with same arguments', function(t) {
    const notify = td.function();
    errlich.addNotifier(notify);
    errlich.notify('a', 'b', 'c');
    t.error(td.verify(notify('a', 'b', 'c')), 'should call notifier with a, b, c');
    errlich.notifiers = [];
    t.end();
});

test('#notify should call all notifiers', function(t) {
    const e = new Error();
    const notifiers = [td.function(), td.function()];
    notifiers.forEach(errlich.addNotifier);
    errlich.notify(e);
    notifiers.forEach(function(notify, i) {
        t.error(td.verify(notify(e)), 'should call notifier(' + i +')');
    });
    errlich.notifiers = [];
    t.end();
});

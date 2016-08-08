'use strict';

import Errlich from '../lib';
import test from 'tape';


const errlich = new Errlich();

test('#addNotifer should exist', function(t) {
    t.equal(typeof errlich.addNotifier, 'function', 'is defined');
    t.end();
});

test('#addNotifer should add functions to notifier array', function(t) {
    function myNotifier() {
        console.error.apply(console, arguments);
    }
    errlich.addNotifier(myNotifier);
    t.equal(errlich.notifiers.length, 1, 'should add notifier');
    errlich.notifiers.pop();
    t.end();
});

test('#addNotifier should skip non function argument', function(t) {
    errlich.addNotifier(1);
    t.equal(errlich.notifiers.length, 0, 'should ignore notifier');
    t.end();
});

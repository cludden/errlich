'use strict';

import Errlich from '../lib';
import test from 'tape';
import _ from 'lodash';


const nonObjects = [1, 'hello', /world/g, new Date()];
nonObjects.forEach(function(nonObject) {
    const desc = typeof nonObject + ' (' + nonObject.toString() + ')';
    test('should ignore "errors" if instantiated with a(n) ' + desc, function(t) {
        const errlich = new Errlich(nonObject);
        t.equal(Object.keys(errlich.errors).length, 1, 'should set initial errors');
        t.end();
    });
});


test('should set valid errors property', function(t) {
    const errors = { myError: { status: 400, title: 'My Super Awesome Title' }};
    const errlich = new Errlich(errors);
    t.deepEqual(errlich.errors.myError, errors.myError, 'should set errors property');
    t.end();
});

test('should ignore/override invalid error definitions', function(t) {
    const errors = {
        non_object: true,
        bad_status: { status: 'hello' },
        invalid_status: { status: 601 }
    };
    const errlich = new Errlich(errors);
    const validated = errlich.errors;
    Object.keys(validated).forEach(function(code) {
        if (code !== 'undefined') {
            const e = validated[code];
            t.equal(e.status, 500, 'should apply default status of 500');
            t.equal(e.title, _.startCase(code), 'should startCase code as default title');
            t.equal(e.code, _.kebabCase(code), 'should kebabCase code as default code');
        }
    });
    t.end();
});

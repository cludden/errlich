'use strict';

import addNotifier from './add-notifier';
import get from './get';
import initialize from './initialize';
import notify from './notify';
import validateErrorDefinitions from './validate-error-definitions';
import silentWrap from './silent-wrap';
import silentWrapSync from './silent-wrap-sync';
import wrap from './wrap';
import wrapSync from './wrap-sync';


class Errlich {
    constructor(errors) {
        this.notifiers = [];

        this.addNotifier = this.addNotifier.bind(this);
        this.get = this.get.bind(this);
        this.initialize = this.initialize.bind(this);
        this.notify = this.notify.bind(this);
        this.validateErrorDefinitions = this.validateErrorDefinitions.bind(this);
        this.silentWrap = this.silentWrap.bind(this);
        this.silentWrapSync = this.silentWrapSync.bind(this);
        this.wrap = this.wrap.bind(this);
        this.wrapSync = this.wrapSync.bind(this);

        this.errors = this.validateErrorDefinitions(errors);
    }
}

Errlich.prototype.addNotifier = addNotifier;
Errlich.prototype.get = get;
Errlich.prototype.initialize = initialize;
Errlich.prototype.notify = notify;
Errlich.prototype.validateErrorDefinitions = validateErrorDefinitions;
Errlich.prototype.silentWrap = silentWrap;
Errlich.prototype.silentWrapSync = silentWrapSync;
Errlich.prototype.wrap = wrap;
Errlich.prototype.wrapSync = wrapSync;

export default Errlich;

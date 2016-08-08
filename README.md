# errlich
a lightweight provider of utility error handling functions for RESTful apis, using [boom](https://github.com/hapijs/boom).



## Install
install
```bash
npm install --save errlich
```



## Getting Started
See below for some common usage patterns.
```javascript
const Errlich = require('errlich');
const errlich = new Errlich();


// install a notifier or two
const logErrors = function(...args) {
    console.error.apply(console, args);
}
const bugsnag = require('bugsnag');
bugsnag.register({ apiKey: '*******************' });
errlich.addNotifier(logErrors);
errlich.addNotifier(bugsnag.notify);


// convert to boom error and call notifiers
Model.find({}, function(err, results) {
    if (err) {
        err = errlich.initialize(err, 500);
        errlich.notify(err);
    }
});


// or better yet, we can intercept callback errors, convert them into
// http friendly boom errors, and pass to our notifiers before passing
// to the original callback
Model.find({}, errlich.wrap(500, function(err, results) {

}));


// for synchronous functions that might throw, we can achieve the same
// functionality as above using #wrapSync
Model.findOne()
.then(errlich.wrapSync(500, function getNestedProp(obj) {
    return obj.nested.prop;
}))
.then(function(data) {
    res.status(200).send({ data });
})
.catch(next);


// you can also predefine any potential known errors and provide custom definitions
const errlich = new Errlich({
    accessTokenMissing: {
        code: 'access-token-missing',
        status: 401,
        title: 'Missing Access Token',
        detail: 'Unable to locate access token'
    },
    cacheError: {
        code: 'cache-error',
        status: 500,
        title: 'Unexpected Cache Error',
        detail: 'There was an unexpected error while retrieving data from the cache'
    }
});
errlich.wrap('accessTokenMissing', myCallback);
```



## API

### *new* Errlich(errors)
Constructor function.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| errors* | Object | error definitions |

###### Example
```javascript
const Errlich = require('errlich');

const errors = {
    accessTokenMissing: {
        status: 400,
        title: 'Missing Access Token',
        code: 'access-token-missing'
    }
};

const errlich = new Errlich(errors);
```
---

### #addNotifier(notifier)
Install a notifier.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| notifier* | Function | notifier function |

###### Example
```javascript
const bugsnag = require('bugsnag');
bugsnag.register({apiKey: '**************'})

errlich.addNotifier(bugsnag.notify);
```
---

### #get(name)
returns the error definition with the specified name or an undefined error definition.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| name* | String | definition key |

###### Example
```javascript
console.log(errlich.get('accessTokenMissing'));
```
---

### #initialize(err, nameOrStatus, msg, properties)
Convert an error into a boom error with additional definition data. See *wrap* for additional functionality.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| err* | Error | the error to convert. if not an Error instance, a new error will instantiated |
| nameOrStatus | Number,String | the name of the error definition or an http status |
| msg | String | custom message/detail to use. if not provided, the existing error message will be used |
| properties | Object | additional data to be included at `err.data` |

###### Returns
Error - the decorated error

###### Example
```javascript
if (err) {
    errlich.initialize(err, 'accessTokenMissing', 'No access token was found on the request', { id: req.id });
}
```
---

### #notify(...args)
Pass an error to all notifiers for handling.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| args* | * | all arguments will be passed to all notifiers |

###### Example
```javascript
if (err) {
    errlich.notify(err);
}
```
---

### #silentWrap(...args)
Same as #wrap, except no notifiers will be called.


---

### #silentWrapSync(...args)
Same as #wrapSync, except no notifiers will be called.


---

### #wrap(...args)
Wrap a callback function. If the callback is called with an error, convert it using the provided data, pass error to all notifiers, and then pass to the original callback. If no callback function is passed as an argument, a curried version of the wrapping function will be returned.

###### Example
```javascript
// convert any error passed by #doSomethingAsync using the "my-error" definition
doSomethingAsync(errlich.wrap('my-error', function(err, data) {
    console.log(err);
}));

// convert any error passed to a generic forbidden error.
doSomethingAsync(errlich.wrap(403, 'Uh oh! not allowed!', function(err, data) {
    console.log(err);
}));

const wrapReqError = errlich.wrap({ req: req.id });
const wrapMyError = wrapReqError('my-error');
doSomethingAsync(wrapMyError('my custom message', function(err, data) {
    console.log(err);
}));
```
---

### #wrapSync(...args)
Wrap a synchronous function that could potentially throw. Convert any error thrown using the provided data, pass error to all notifiers, and then throw the converted error. If no function is passed as an argument, a curried version of the wrapping function will be returned.

###### Example
```javascript
// convert any error passed by #doSomethingAsync using the "my-error" definition
function findMin(values) {
    if (!_.isArray(values) || !values.length) {
        throw new Error('Unable to find min of non/empty array');
    }
    return Math.min.apply(Math, values);
}
Transactions.findByAccountId(id)
.then(errlich.wrapSync(404, findMin))
.then(function(min) {
    res.status(200).send({ min });
})
.catch(next)
```
---



## Testing
run tests
```bash
npm test
```

run coverage
```bash
npm run coverage
```



## Contributing
1. [Fork it](https://github.com/cludden/errlich/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request



## License
Copyright (c) 2016 Chris Ludden. Licensed under the [MIT License](LICENSE.md)

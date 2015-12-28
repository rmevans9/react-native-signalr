var objectAssign = require('./object-assign');
//var debugService = require('../../../ReactComponents/services/debug-service')
module.exports = objectAssign(function(subject){
  let events = subject.events || {};

  if (subject && subject === subject.window)
  return {
    0: subject,
    load: (handler)=> subject.addEventListener('load', handler, false),
    bind: (event, handler)=> subject.addEventListener(event, handler, false),
    unbind: (event, handler)=> subject.removeEventListener(event, handler, false)
  }

  return {
    0: subject,

    unbind(event, handler){
      let handlers = events[event] || [];

      if (handler){
        let idx = handlers.indexOf(handler);
        if (idx !== -1) handlers.splice(idx, 1)
      }
      else handlers = []

      events[event] = handlers
      subject.events = events;

    },
    bind(event, handler){
      let current = events[event] || [];
      events[event] = current.concat(handler)
      subject.events = events;
    },
    triggerHandler(event, args){
      let handlers = events[event] || [];
      handlers.forEach(fn => {
        if(args && args[0] && args[0].type === undefined){
          args = [{ type: event }].concat(args || []);
        }else{
          args = args || [];
        }

        fn.apply(this, args)
      })
    }
  }
},
{
  defaultAjaxHeaders: null,
  ajax : function(options, data) {
    try {
    let fetchOptions = {
      method: options.type,
      headers: this.defaultAjaxHeaders
    };

    if (options.type !== 'GET' && options.type !== 'HEAD' && options.data) {
      let body = Object.keys(options.data).map(function (keyName) {
                            return encodeURIComponent(keyName) + '=' + encodeURIComponent(options.data[keyName])
                          }).join('&');

      fetchOptions.headers = {
        ...fetchOptions.headers,
        'content-type': options.contentType
      }
      fetchOptions.body = body;
    }

    fetch(options.url, fetchOptions).then(response => {
        console.log(options.url);
        console.log(response);
        return options.success && options.success(response._bodyInit ? JSON.parse(response._bodyInit) : '');
      })
      .catch(error => {
        console.log(options);
        console.log(error);
        options.error && options.error(error);
      });
    }
    catch (e) {
      console.log(e)
    }
  },
  each: (arr, cb) => arr.forEach((v, i)=> cb(i, v)),
  inArray : function(arr, item){
    return arr.indexOf(item) !== -1;
  },
  noop(){},
  isFunction: o => typeof o === 'function',
  isArray: arr => Array.isArray(arr),
  type: obj => typeof obj,
  trim: str => str && str.trim(),
  extend: (...args) => objectAssign(...args),
  each: function(arr, cb)  {
    if(Array.isArray(arr)){
      return arr.forEach((v, i)=> cb(i, v));
    }else{
      return Object.keys(arr).forEach((key) => {
        let value = arr[key];
        cb.call(value, key, value);
      })
    }
  },
  isEmptyObject: obj => !obj || Object.keys(obj).length === 0,
  makeArray: arr => [].slice.call(arr, 0),
  Deferred(){
    var resolve, reject;
    var promise = new Promise(function() {
      resolve = arguments[0];
      reject = arguments[1];
    });

    return {
      resolve,
      reject,
      promise: () => {
        var p = {
          done : (fn) => {
            promise.done(fn);
            return p;
          },
          fail : (fn) => {
            promise.catch(fn);
            return p;
          },
          then : (fn, data) => {
            promise.then(fn, data);
            return p;
          }
        };
        return p;
      },
      resolveWith : (proxy, data) => {
        return resolve(data);
      }, rejectWith : (proxy, data) => {
        return reject(data);
      }
    };
  },
  support: {
    cors: true
  }
});

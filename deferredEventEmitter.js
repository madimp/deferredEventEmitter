var Deferred = require('Deferred'),
	EventEmitter = require('events').EventEmitter;

function DeferredEventEmitter(){
	this._doneEmitter = new EventEmitter();
}

module.exports = DeferredEventEmitter;

DeferredEventEmitter.prototype = new EventEmitter();

DeferredEventEmitter.prototype.done = function(event, listener){
	this._doneEmitter.on(event, listener);
};

DeferredEventEmitter.prototype.removeDoneListener = function(event, listener){
	this._doneEmitter.removeListener(event, listener);
};

DeferredEventEmitter.prototype.emit = function(event, args){
	var _this = this;

	var listeners = this.listeners(event),
		arg = Array.prototype.slice.call(arguments),
		deferreds = [];

	if (listeners.length){
		listeners.forEach(function(listener){
			var d = new Deferred();
			deferreds.push(d);
			arg[0] = d.resolve;
			listener.apply(_this, arg);
		});
		Deferred.when.apply(Deferred, deferreds).done(function(){
			_this._doneEmitter.emit(event);
		});
	} else {
		_this._doneEmitter.emit(event);
	}
};

var forever = require('forever');

exports = module.exports = (function() {

	function foreverUI() {}

	foreverUI.prototype.findProcessByUID = function(uid, cb) {
	  return forever.list("", function(err, processes) {
		if (err) return cb(err, null);
		return cb(null, _.find(processes, function(o) {
		  return o.uid === uid;
		}));
	  });
	};

	foreverUI.prototype.findProcIndexByUID = function(uid, cb) {
	  return forever.list("", function(err, processes) {
		var i;
		if ((err) || !(processes)) return cb(err, null);
		i = -1;
		while (processes[++i]) {
		  if (processes[i].uid === uid) return cb(null, i);
		}
		return cb("Process '" + uid + "' not found", null);
	  });
	};

	foreverUI.prototype.info = function(uid, cb) {
	  return this.findProcessByUID(uid, function(err, proc) {
		if (err) return cb(err, null);
		if (!proc) return cb("Undefined proc", null);
		return async.map([proc.logFile, proc.outFile, proc.errFile].filter(function(s) {
		  return s !== void 0;
		}), function(filename, cb) {
		  return fs.readFile(filename, function(err, data) {
			var d;
			d = (data || '').toString().trim();
			if (!d || d === '\n') {
			  return cb(null, [filename, 'Empty log']);
			} else {
			  return cb(null, [filename, ansiparse(d)]);
			}
		  });
		}, function(err, results) {
		  return cb(err, results);
		});
	  });
	};

	foreverUI.prototype.stop = function(uid, cb) {
	  return this.findProcIndexByUID(uid, function(err, index) {
		if (err) return cb(err, null);
		return forever.stop(index).on('stop', function(res) {
		  return cb(null, true);
		}).on('error', function(err) {
		  return cb(err, null);
		});
	  });
	};

	foreverUI.prototype.restart = function(uid, cb) {
	  return this.findProcIndexByUID(uid, function(err, index) {
		if (err) return cb(err, null);
		return forever.restart(index).on('restart', function(res) {
		  return cb(null, true);
		}).on('error', function(err) {
		  return cb(err, null);
		});
	  });
	};

	foreverUI.prototype.start = function(options, cb) {
	  var startScriptParams = new Array();
	  startScriptParams = decodeURIComponent(options).split(" ");
	  Array.prototype.unshift.apply(startScriptParams, ["start"]);
	  child = spawn("forever", startScriptParams);
	  child.unref();
	  return cb(null, this.child);
	};

	return foreverUI;

})();
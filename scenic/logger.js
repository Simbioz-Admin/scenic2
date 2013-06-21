module.exports = function (config, _)
{
  var log = function() {
    var levels = ['error', 'warn', 'debug', 'info'];
    if (levels.indexOf(arguments[0]) >= levels.indexOf(config.debugLevel) ) {
      var message = ": "
      ,   level = arguments[0];

      for(i=1; i<arguments.length; i++) message = message+arguments[i];
      console.log(level, message);
    }
  }

  return log;
}

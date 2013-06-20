module.exports = function (config)
{
  var log = function(level, message) {
    var levels = ['error', 'warn', 'info'];
    if (levels.indexOf(level) >= levels.indexOf(config.debugLevel) ) {
      if (typeof message !== 'string') {
        message = JSON.stringify(message);
      };
      console.log(level+': '+message);
    }
  }

  return log;
}

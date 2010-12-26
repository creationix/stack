function Stack(/*layers*/) {
  var error = Stack.errorHandler,
      handle = error;
  Array.prototype.slice.call(arguments).reverse().forEach(function (layer) {
    var child = handle;
    handle = function (req, res) {
      try {
        layer(req, res, function (err) {
          if (err) { return error(req, res, err); }
          child(req, res);
        });
      } catch (err) {
        error(req, res, err);
      }
    };
  });
  return handle;
}
Stack.errorHandler = function error(req, res, err) {
  if (err) {
    console.error(err.stack + "\n");
    res.writeHead(500, {"Content-Type": "text/plain"});
    res.end(err.stack + "\n");
    return;
  }
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.end("Not Found\n");
};
module.exports = Stack;

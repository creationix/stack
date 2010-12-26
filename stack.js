function Stack(/*layers*/) {
  var handle = Stack.error;
  Array.prototype.slice.call(arguments).reverse().forEach(function (layer) {
    var child = handle;
    handle = function (req, res) {
      try {
        layer(req, res, function (err) {
          if (err) { return Stack.error(req, res, err); }
          child(req, res);
        });
      } catch (err) {
        Stack.error(req, res, err);
      }
    };
  });
  return handle;
}
Stack.errorHandler = function error(req, res, err) {
  if (err) {
    res.writeHead(500, {"Content-Type": "text/plain"});
    res.end(err.stack + "\n");
    return;
  }
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.end("Not Found\n");
};
module.exports = Stack;

# Stack

Stack is a minimal http module system for node.js.

Basically it's the core idea of connect but in a standalone and super minimal stack function.

## Example

  http.createServer(require('stack')(
    require('loggerMiddleware')(),
    require('staticMiddleware')(root, mount),
    //...
  )).listen(8080);

As you can see, it takes a list of handler functions and will chain them up for you.

Each handler needs to be of the form:

    function handler(req, res, next) {
      // Either handle the request here using `req` and `res`
      // or call `next()` to pass control to next layer
      // any exceptions need to be caught and forwarded to `next(err)`
    }

When using external modules a good convention is to make the module be a callble setup function that returns the handler function.  The first example uses modules created after this pattern.

    module.exports = function setup(some, args) {
      // Do server set up stuff here
      return function handle(req, res, next) {
        // Handle a single request here
      };
    };

## What Stack Does

Besides providing this nice linear syntax for defining http handler layers Stack does a few things under the hood.

 - Wraps each layer in a `try..catch` to catch any exceptions that happen at the top level of that layer.
 - Provides a fallthrough error handler function that returns 404 for routes that fall through all the layers and 500 responses for exceptions.
   (In the future, I want to be able to override this function.)
 - Forwards and exceptions passed to any next layer directly to the error handler.  This means layers don't have to worry about errors from previous layers.

## What Stack Does NOT Do

Stack does not provide any middleware layers of any kind.  If you want logging, or static file serving or anything, you have to provide your own handlers.
The reason is two-fold.  First, it keeps Stack nice and small and easy to maintain.  This worked great for my Step library and I think it will work great for Stack.
Second, I found with Connect, that having a central place where all middleware is kept is not good for the community.  People want different things from eachother, and it's impossible to accept patches and feature requests that make everyone happy.  Better I think is to provide a nice system for layering third-party modules and let each module succeed on it's own merit.


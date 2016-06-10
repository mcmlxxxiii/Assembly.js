# Assembly.js

A meta framework for building web app frameworks from reusable feature modules.


## Why

Using a high-level framework is always a trade-off.

- You agree to get features you need/like along with features they have that
  you're not going to use ever.
- Sometimes you like the way one feature works, but dislike the way another
  one does. As a result, you become unhappy with your app code.

So, if you're not satisfied with your framework options, you may want to choose
building your own framework with features you need working exactly in the way
you want them to.

Assembly helps you achive that. With Assembly, you bring together reusable
feature modules into a monolithic framework.


## Pros

- Control over feature initialization order. In an app, this is what is first
  to turn into a mess when some feature should be initialized before another one
  that should be initialized before another one that should be initialized
  before another one, and so on. With Assembly, that's not a problem at all.
  When you decide to include a feature, that's just two lines of code.
- A collection of contrib/ features that are likely to suit you.


## Cons

So far, Assembly.js depends on several things from jQuery, see the compat module
in src/. But if you leverage jQuery in your project, that is not an issue, right?


## Documentation

It is a work in progress. Please refer to the example demo framework code to see
how things work.


## Demo

Here is the [**California Weather Now**](http://mcmlxxxiii.github.io/Assembly.js/demo/)
demo application running online. It is built with the demo framework
which is built with Assembly. Please find everything in demo/ folder.

If you decide to take a deeper look and play with the code on your local
machine, the easiest way to run the app, perhaps, would be
**(1)** to run `python -m SimpleHTTPServer 8000` from the repo root and
**(2)** point your browser to `localhost:8000`.

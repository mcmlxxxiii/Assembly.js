# Assembly.js

A meta framework for building custom web app frameworks with reusable
feature modules.


## Why

Using a high-level framework is always a trade-off.

- You agree to get features you need/like along with features they have that
  you're not going to use ever.
- Sometimes you like the way one feature works, but dislike the way another
  one does. As a result, you become unhappy with your app code.

So, if you're not satisfied with your framework options, you may want to choose
building your own framework with features you need working exactly in the way
you want them to.

Assembly helps you achive that. With Assembly.js, you may bring together
reusable feature modules into a monolithic framework.


## Pros

- You gain granular control over the feature initialization order.
  Usually, in an app that is what's usually the first to turn into a mess.
  One feature needs be initialized before another one that need to be
  initialized before some other that needs to be initialized before some
  third other, and so on. With Assembly, that's not a problem at all.
  Describing a moment for the feature to initialize is just a lines of code.
- A collection of contrib/ features that are very likely to suit your needs.


## Cons

So far, Assembly.js depends on several things from jQuery, see the compat module
in src/. Provided you leverage jQuery in your project, that is not an issue.
For cases when jQuery is not around a less heavy compat module is still to be
developed.


## Documentation

For the time being, it is a work in progress. Please refer to the example
demo framework code to see how things work.


## Demo

Here is the [**California Weather Now**](http://mcmlxxxiii.github.io/Assembly.js/demo/)
demo application running online. It is built with the assembled demo framework.
Please find everything in the `demo/` folder.

If you decide to take a deeper look and play with the code on your local
machine, the easiest way to run the app, perhaps, would be
**(1)** to run `python -m SimpleHTTPServer 8000` from the repo root and
**(2)** point your browser to `localhost:8000`.

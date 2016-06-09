var Router = (function (compat) {

    // Router should not know anything specific about what data in addition to
    // path, pattern, pathParamNames, re, and name do specific routes have.

    function Route(data) {
        if (!compat.isPlainObject(data)) {
            throw new Error('Invalid route (data is not a plain object)!');
        }

        if (typeof data.path !== 'string' &&
            typeof data.pattern !== 'string') {
            throw new Error('Invalid route (neither path, ' +
                            'nor pattern specified)! ' + JSON.stringify(data));
        }

        if (typeof data.path === 'string' &&
            typeof data.pattern === 'string') {
            throw new Error('Invalid route (both path and pattern present). ' +
                            JSON.stringify(data));
        }

        this.name = data.name;

        if (data.path) {
            this.path = Route.normalizePath(data.path);
        }

        if (data.pattern) {
            this.pattern = Route.normalizePath(data.pattern);
            this.re = Route.makeRegExp(this.pattern);
            this.pathParamNames = this.re.pathParamNames;
        }

        // Copy all other properties.
        for (var k in data) {
            if (Route.StandardPropertyNames.indexOf(k) >= 0) continue;
            this[k] = data[k];
        }
    }

    Route.StandardPropertyNames = [
            'path', 'pattern', 're', 'name', 'pathParamNames'];

    Route.makeRegExp = function (pattern) {
        var re;
        var pathParamNames = [];

        if (pattern === '/*') {
            re = '.*';
        } else {
            var paramNamesMatches = pattern.match(/:\w+/g);
            re = pattern;
            re = re.replace(/\//g, '\\/');
            if (paramNamesMatches) {
                for (var i = 0, l = paramNamesMatches.length; i < l; i++) {
                    var param = paramNamesMatches[i];
                    re = re.replace(param, "([\\w\\d\\_]+)");
                    pathParamNames.push(param.substring(1));
                }
            }
        }

        re = '^' + re + '$';
        re = new RegExp(re);
        re.pathParamNames = pathParamNames;

        return re;
    };

    Route.normalizePath = function (path) {
        path = path.replace(/\/+/g, '/');

        if (path[path.length - 1] === '/') {
            path = path.substr(0, path.length - 1);
        }

        if (path === '') {
            path = '/';
        }

        if (path[0] !== '/') {
            path = '/' + path;
        }

        return path;
    };

    Route.prototype.getData = function () {
        return compat.extend(true, {}, this);
    };

    Route.prototype.match = function (path) {
        if (this.path && this.path === path) return true;
        if (this.re && this.re.test(path)) return true;
        return false;
    };

    Route.prototype.constructPath = function (routeParams) {
        var path;
        if (this.path) {
            path = this.path;
        } else if (this.pattern) {
            if (compat.isPlainObject(routeParams)) {
                // TODO interpolation by params name.
            } else {
                path = this.pattern;
                if (arguments.length == this.pathParamNames.length) {
                    for (var i = 0, l = arguments.length; i < l; i++) {
                        path = path.replace(
                            ':' + this.pathParamNames[i],
                            arguments[i].toString());
                    }
                } else {
                    throw new Error('Can not construct path (bad params)!');
                }
            }
        }

        return path;
    };

    function Router() {
        this._routesData = [];
        this._routes = [];
        this._nameMap = {};

        this.initialize = function () {
            delete this.initialize;

            for (var i = 0; i < this._routesData.length; i++) {
                var route = new Route(this._routesData[i]);
                if (route.name) {
                    if (this._nameMap[route.name]) {
                        throw new Error('Duplicate route name ' +
                                        '`' + route.name + '\'!');
                    }
                    this._nameMap[route.name] = route;
                }

                this._routes.push(route);
            }

            delete this._routesData;
        };
    }

    Router.prototype.addRoute = function (routeData) {
        this._routesData.push(routeData);
    };

    Router.prototype.resolvePath = function (path) {
        path = Route.normalizePath(path);

        var route;
        var routePathParams;

        for (var i = 0, l = this._routes.length; i < l;  i++) {
            if (this._routes[i].match(path)) {
                route = this._routes[i];
                routePathParams = {};

                if (route.re) {
                    var match = route.re.exec(path);
                    if (match) {
                        for (var i = 0, l = route.pathParamNames.length;
                                i < l; i++) {

                            var paramName = route.pathParamNames[i];
                            routePathParams[paramName] = match[i + 1];
                        }
                    }
                }

                break;
            }
        }

        return {
            path: path,
            route: route,
            routePathParams: routePathParams
        };
    };

    Router.prototype.constructPath = function (routeName) {
        var args = Array.prototype.slice.apply(arguments);
        var routeName = args.shift().toString();

        // 5 == "Route".length
        if (routeName.substring(routeName.length - 5) === "Route") {
          routeName = routeName.substring(0, routeName.length - 5);
        }

        var route = this._nameMap[routeName];
        if (route instanceof Route) {
            return route.constructPath.apply(route, args);
        } else {
            throw new Error('Unknown route `'+ routeName +'\'!');
        }
        return route;
    };

    return Router;

})(Assembly_Compat);

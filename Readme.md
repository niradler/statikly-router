# statikly-router

file system router, the router will translate folder structure into routes.

generate route for `views/pages/todo/[id].ejs`

```js
const { Router } = require("statikly-router");
const router = new Router({
  path: "views",
});
const routes = await router.scan();
await router.build("api"); //create api/routes.json file to cache routes
```

Route:

```json
{
  "ejs": {
    "root": "/",
    "dir": "/pages/todo",
    "base": "[id].ejs",
    "ext": ".ejs",
    "name": "[id]",
    "cwd": ".../tests/views",
    "path": ".../tests/views/pages/todo/[id].ejs",
    "relative": "/pages/todo/[id].ejs",
    "url": "/pages/todo/:id"
  }
}
```

express usage example:

```js
//server.js
const express = require("express");
const { Router } = require("statikly-router");

const app = express();
const router = new Router({ path: "routes", glob: "**/*.js" });

(async () => {
  try {
    const routes = await router.scan();
    for (const url in routes) {
      const route = require(routes[url].js.path);
      app.get(url, route);
    }

    app.listen(4000);
  } catch (error) {
    console.log(error);
  }
})();
```

```js
//routes/home.js
module.exports = async (req, res) => {
  return res.json({ page: "home" });
};
```

`curl localhost:4000/home`

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

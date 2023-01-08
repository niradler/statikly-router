const { Router } = require("../build/index");

const router = new Router({
  path: "tests/views",
});

test("Router scan", async () => {
  const routes = await router.scan();
  expect(routes).toBeDefined();
  delete routes["/pages/todo/:id"].ejs.cwd
  delete routes["/pages/todo/:id"].ejs.path
  expect(routes["/pages/todo/:id"]).toEqual({
    "ejs": {
      "root": "/",
      "dir": "/pages/todo",
      "base": "[id].ejs",
      "ext": ".ejs",
      "name": "[id]",
      "relative": "/pages/todo/[id].ejs",
      "url": "/pages/todo/:id"
    }
  });
  expect(Object.keys(routes).length).toBe(5);
});

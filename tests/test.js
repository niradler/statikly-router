const { Router } = require("../build/index");

const router = new Router({
  path: "tests/views",
});

test("Router scan", async () => {
  console.time("scan");
  const routes = await router.scan();
  console.timeEnd("scan");
  expect(routes).toBeDefined();

  expect(routes["/pages/:page"]).toBeDefined();
  expect(routes["/pages/:page/data"]).toBeDefined();
  expect(routes["/pages/:page/:id"]).toBeDefined();

  expect(routes["/"].html.base).toBe("index.html")

  expect(routes["/pages/todo/:id"].ejs.base).toBe("[id].ejs")
  expect(routes["/pages/todo/:id"].ejs.url).toBe("/pages/todo/:id")

  delete routes["/pages/todos"].hbs.cwd
  delete routes["/pages/todos"].hbs.path
  expect(routes["/pages/todos"]).toEqual({
    hbs: {
      root: '',
      dir: 'pages',
      base: 'todos.hbs',
      ext: '.hbs',
      name: 'todos',
      url: '/pages/todos'
    }
  });

});

import {
  getFiles,
  pathNormalize,
  toAbsolutePath,
  pathToRoute,
  writeSON,
} from "./helpers";
import type { Route } from "./helpers";

interface RouterOptions {
  glob?: string | undefined;
  path: string;
  querySep?: string;
}

interface Routes {
  [key: string]: {
    [key: string]: Route;
  };
}

export class Router {
  options: RouterOptions;
  constructor(options: RouterOptions) {
    options.glob = options.glob || "**/*(*.html|*.ejs|*.md|*.js|*.hbs)";
    options.querySep = options.querySep || ":";
    options.path = toAbsolutePath(options.path);
    this.options = options;
  }

  async scan(): Promise<Routes> {
    const { glob, path, querySep } = this.options;
    const routes: Routes = {};
    const files = await getFiles(`${pathNormalize(path)}/${glob}`);

    for await (const file of files) {
      const route = pathToRoute(file, path, querySep);
      if (routes[route.url] === undefined) {
        routes[route.url] = {};
      }
      routes[route.url][route.ext.replace(".", "")] = route;
    }

    return routes;
  }

  async build(outputPath: string) {
    const routes = await this.scan();
    await writeSON(toAbsolutePath(outputPath), routes);
  }
}

export default Router;

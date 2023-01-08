import fs from "fs/promises";
import Path from "path";
import glob from "glob";

export const getFiles = (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(pattern, function (error: Error, files: string[]) {
      if (error) reject(error);
      else resolve(files);
    });
  });
};

export const pathNormalize = (path: string): string => {
  return path.replace(/\\/gi, "/");
};

export type Route = {
  url: string;
  cwd: string;
  path: string;
  relative: string;
} & Path.ParsedPath;

const isRouteRoot = (name: string, dir: string): boolean => {
  if (name === "index") return true;
  // if(dir.endsWith(name)) return true TODO: support same name

  return false;
};

const transformRoutePath = (path: string, querySep: string) => {
  const transformRegex = /\[([^}]*)\]/g;
  if (transformRegex.test(path)) {
    return path.replace(transformRegex, (_, s) => `${querySep}${s}`);
  }

  return path;
};

export const pathToRoute = (
  path: string,
  cwd: string,
  querySep: string
): Route => {
  const relative = path.replace(pathNormalize(cwd), "");
  const parsed = Path.parse(relative);
  let url = `${parsed.dir}${
    isRouteRoot(parsed.name, parsed.dir) ? "" : `/${parsed.name}`
  }`;
  url = transformRoutePath(url, querySep);
  const route: Route = {
    ...parsed,
    cwd,
    path,
    relative,
    url,
  };

  return route;
};

export const toAbsolutePath = (path: string, cwd: string = process.cwd()) => {
  if (!path) return;
  return Path.isAbsolute(path) ? path : Path.join(cwd, path);
};

export const generateSecret = (length: number) =>
  new Array(length)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join("");

export const readJSON = async (path: string, cwd: string): Promise<unknown> => {
  const filePath = toAbsolutePath(path, cwd);
  const content = await fs.readFile(filePath, "utf8");

  return JSON.parse(content);
};

export const writeSON = async (
  path: string,
  content: unknown,
  cwd?: string
) => {
  const filePath = Path.join(toAbsolutePath(path, cwd), "routes.json");
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf8");
};

export const fileExists = async (path: string) =>
  !!(await fs.stat(path).catch((e) => false));

export default {
  getFiles,
  pathNormalize,
  pathToRoute,
  toAbsolutePath,
  generateSecret,
  readJSON,
  fileExists,
  writeSON,
};

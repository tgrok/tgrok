import path from "path";
import fs from "fs";
import transpile from "@rollup/plugin-buble";
import resolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import {terser} from "rollup-plugin-terser";
import jscc from "rollup-plugin-jscc";
import workspacesRun from "workspaces-run";
import repo from "./lerna.json";
import image from "@rollup/plugin-image";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Get the JSCC plugin for preprocessing code.
 * @param {boolean} debug Build is for debugging
 */
function preprocessPlugin(debug) {
  return jscc({
    values: {
      _DEBUG: debug,
      _PROD: !debug,
      _VERSION: repo.version,
    }
  });
}

/**
 * Convert a development file name to minified.
 * @param {string} name
 */
function prodName(name) {
  return name.replace(/\.(m)?js$/, ".min.$1js");
}

async function main() {
  const commonPlugins = [
    image(),
    sourcemaps(),
    resolve(),
    commonjs(),
    json(),
    typescript(),
    transpile(),
  ];

  const plugins = [
    preprocessPlugin(true),
    ...commonPlugins
  ];

  const prodPlugins = [
    preprocessPlugin(false),
    ...commonPlugins,
    terser({
      output: {
        comments: (node, comment) => comment.line === 1,
      },
    })
  ];

  const sourcemap = true;
  const results = [];
  const packages = [];

  // Collect the list of packages
  await workspacesRun({cwd: __dirname, orderByDeps: true}, async (pkg) => {
    if (!pkg.config.private) {
      packages.push(pkg);
    }
  });

  packages.forEach((pkg) => {
    const {
      main,
      module,
      dependencies,
      peerDependencies
    } = pkg.config;

    let banner = "";

    // Check for bundle folder
    const external = Object.keys(dependencies || [])
      .concat(Object.keys(peerDependencies || []));
    const basePath = path.relative(__dirname, pkg.dir);
    const freeze = false;
    const entries = ["src/index.ts", "src/index.js"];
    let input;

    for (let i = 0; i < entries.length; i++) {
      input = path.join(basePath, entries[i]);
      if (fs.existsSync(input)) {
        break;
      } else {
        input = null;
      }
    }

    // if there is no entry, skip this package.
    if (!input) {
      return;
    }

    results.push({
      input,
      output: [
        {
          banner,
          file: path.join(basePath, main),
          format: "cjs",
          freeze,
          sourcemap,
          exports: "named",
        },
        {
          banner,
          file: path.join(basePath, module),
          format: "esm",
          freeze,
          sourcemap,
          exports: "named",
        },
      ],
      external,
      plugins,
    });

    if (isProduction) {
      results.push({
        input,
        output: [
          {
            banner,
            file: path.join(basePath, prodName(main)),
            format: "cjs",
            freeze,
            sourcemap,
            exports: "named",
          },
          {
            banner,
            file: path.join(basePath, prodName(module)),
            format: "esm",
            freeze,
            sourcemap,
            exports: "named",
          },
        ],
        external,
        plugins: prodPlugins,
      });
    }
  });

  return results;
}

export default main();

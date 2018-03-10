import path from "path";
//import resolve from "rollup-plugin-node-resolve"; // resolve node_modules/index.js to ES6
//import commonjs from "rollup-plugin-commonjs";    // convert CommonJS -> ES6
//import buble from "rollup-plugin-buble";          // convert ES6 -> ES5
import eslint from "rollup-plugin-eslint";        // ESLint
//import cleanup from "rollup-plugin-cleanup";      // clear comments and empty lines
//import license from "rollup-plugin-license";      // add License header

// --- ES5/ES6/CommonJS/ESModules -> ES6 bundle ---
export default {
  format: "es",
  entry: "index.js",
  dest: "index.mjs",
  plugins: [
  //resolve({ jsnext: true }),
  //commonjs(),
  //buble(), // ES6 -> ES5
    eslint({ configFile: path.resolve("./.eslintrc") }),
  //cleanup(),
  ],
  intro: "",
  outro: "",
  banner: "",
  footer: "",
}



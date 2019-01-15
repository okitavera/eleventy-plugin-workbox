const fs = require("fs");
const Eleventy = require("@11ty/eleventy/src/Eleventy");
const workbox = require("workbox-build");

module.exports = (options) => {
  const config = new Eleventy();
  defaultOptions = {
    importWorkboxFrom: "local",
    cacheId: "eleventy-plugin-pwa",
    skipWaiting: true,
    clientsClaim: true,
    swDest: `${config.outputDir}/service-worker.js`,
    globDirectory: config.outputDir,
    globPatterns: [
      "**/*.{html,css,js,mjs,map,jpg,png,gif,webp,ico,svg,woff2,woff,eot,ttf,otf,ttc,json}"
    ],
    runtimeCaching: [
      {
        urlPattern: /^.*\.(jpg|png|gif|webp|ico|svg|woff2|woff|eot|ttf|otf|ttc|json)$/,
        handler: `staleWhileRevalidate`
      },
      {
        urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
        handler: `staleWhileRevalidate`
      }
    ]
  };

  const opts = Object.assign({}, defaultOptions, options);
  let files = fs.readdirSync(opts.globDirectory);
  if (files.length == 0) {
    return console.error("No files that can be cached, ignoring.");
  } else {
    return workbox.generateSW(opts).then(({ count, size, warnings }) => {
      warnings.forEach(console.warn);
      size = (size / 1048576).toFixed(2);
      console.log(
        `WorkBox: ${count} files will be precached, totaling ${size} MB.`
      );
    });
  }
};

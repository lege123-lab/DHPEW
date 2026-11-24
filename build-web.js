const fs = require("fs");
const path = require("path");

const root = process.cwd();
const webDir = path.join(root, "www");

const excluded = new Set([
  ".git",
  "node_modules",
  "android",
  "www",
  ".github"
]);

if (fs.existsSync(webDir)) {
  fs.rmSync(webDir, { recursive: true, force: true });
}

fs.mkdirSync(webDir, { recursive: true });

fs.cpSync(root, webDir, {
  recursive: true,
  filter: (source) => {
    const relative = path.relative(root, source);

    if (!relative) return true;

    const parts = relative.split(path.sep);

    if (parts.some((part) => excluded.has(part))) {
      return false;
    }

    return ![
      "package.json",
      "package-lock.json",
      "capacitor.config.json"
    ].includes(path.basename(source));
  }
});

const indexFile = path.join(webDir, "index.html");

if (!fs.existsSync(indexFile)) {
  throw new Error("index.html was not found in the project root.");
}

console.log("DHPEW web files prepared successfully.");

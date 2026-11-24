
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

// Remove old www folder
if (fs.existsSync(webDir)) {
  fs.rmSync(webDir, {
    recursive: true,
    force: true
  });
}

// Create a clean www folder
fs.mkdirSync(webDir, {
  recursive: true
});

// Copy project files without copying www into itself
function copyProject(source, destination) {
  const entries = fs.readdirSync(source, {
    withFileTypes: true
  });

  for (const entry of entries) {
    if (excluded.has(entry.name)) {
      continue;
    }

    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destinationPath, {
        recursive: true
      });

      copyProject(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

copyProject(root, webDir);

// Verify the main application file
const indexFile = path.join(webDir, "index.html");

if (!fs.existsSync(indexFile)) {
  throw new Error(
    "ERROR: index.html was not found in the project root."
  );
}

console.log("DHPEW web files prepared successfully.");
console.log("Web directory: " + webDir);

const fs = require("fs");

function copyFileUsingStreams(sourcePath, destPath) {
  const readableStream = fs.createReadStream(sourcePath);
  const writableStream = fs.createWriteStream(destPath);

  readableStream.on("error", (err) => {
    console.error("Error reading source file:", err.message);
  });

  writableStream.on("error", (err) => {
    console.error("Error writing destination file:", err.message);
  });

  writableStream.on("finish", () => {
    console.log("File copied using streams");
  });

  readableStream.pipe(writableStream);
}

const sourcePath = process.argv[2] || "./source.txt";
const destPath = process.argv[3] || "./dest.txt";
copyFileUsingStreams(sourcePath, destPath);

module.exports = copyFileUsingStreams;

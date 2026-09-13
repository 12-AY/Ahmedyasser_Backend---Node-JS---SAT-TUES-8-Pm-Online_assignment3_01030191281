const fs = require("fs");
const zlib = require("zlib");
const { pipeline } = require("stream");

function compressFile(inputPath, outputPath) {
  const readableStream = fs.createReadStream(inputPath);
  const gzip = zlib.createGzip();
  const writableStream = fs.createWriteStream(outputPath);

  pipeline(readableStream, gzip, writableStream, (err) => {
    if (err) {
      console.error("Pipeline failed:", err.message);
    } else {
      console.log(`File compressed successfully into ${outputPath}`);
    }
  });
}

const inputPath = process.argv[2] || "./data.txt";
const outputPath = process.argv[3] || "./data.txt.gz";
compressFile(inputPath, outputPath);

module.exports = compressFile;

const fs = require("fs");

function readFileInChunks(filePath) {
  const readableStream = fs.createReadStream(filePath, {
    encoding: "utf8",
    highWaterMark: 16 * 1024, // 16kb per chunk
  });

  let chunkNumber = 0;

  readableStream.on("data", (chunk) => {
    chunkNumber++;
    console.log(`--- Chunk ${chunkNumber} ---`);
    console.log(chunk);
  });

  readableStream.on("end", () => {
    console.log(`Finished reading file. Total chunks: ${chunkNumber}`);
  });

  readableStream.on("error", (err) => {
    console.error("Error reading file:", err.message);
  });
}

const filePath = process.argv[2] || "./big.txt";
readFileInChunks(filePath);

module.exports = readFileInChunks;

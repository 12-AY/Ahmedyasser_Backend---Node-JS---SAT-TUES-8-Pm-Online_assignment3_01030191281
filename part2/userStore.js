const fs = require("fs/promises");
const path = require("path");

const usersFilePath = path.join(__dirname, "users.json");

// Reads the current users straight from the JSON file every time.
// We never keep a long lived array in memory, the file is the single source of truth.
async function readUsers() {
  const fileContent = await fs.readFile(usersFilePath, "utf8");
  if (!fileContent.trim()) {
    return [];
  }
  return JSON.parse(fileContent);
}

// Writes the given users back to the JSON file.
async function writeUsers(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf8");
}

// Generates the next id based on the current highest id in the file.
function getNextId(users) {
  if (users.length === 0) return 1;
  const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
  return maxId + 1;
}

module.exports = {
  readUsers,
  writeUsers,
  getNextId,
};

const fs = require('fs');
const path = require('path');

function getAllFolders(backupPath) {
  try {
    const folders = fs.readdirSync(backupPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    return folders;
  } catch (error) {
    console.error(`Error occurred while retrieving folders: ${error}`);
    return [];
  }
}

function createFolder(path) {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    
  } catch (error) {
    console.error(`Error occurred while retrieving folders: ${error}`);  
  }
}

module.exports = {getAllFolders, createFolder}
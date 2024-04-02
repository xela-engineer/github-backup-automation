const simpleGit = require('simple-git');
const githubController = require('./controllers/githubController');
const appCtr = require('./controllers/appController');
// init program
const gh = new githubController(process.env.GITHUB_ACCOUNT_NAME);
let folders = [];
console.log("GitHub repositories start to back up ...");
let now = new Date();

gh.verification(); // check if the token and account name are valid

gh.getRepoNames() // Get the list of repos from the github api
.then(() => { 
  // go to the backup path and get the list of all folders
  folders = appCtr.getAllFolders(gh.backupPath);
  console.log(folders);
  //gh.cloneRepos();
}).then(() => {
  // for each folder, check if it is a git repo, if yes run git pull and get all branches and tags from github
  pullList = gh.repos.filter(repo => folders.includes(repo.name));
  console.log(pullList);
  //gh.pullRepos(pullList);

}).then(() => {
  // Compare the folder list and repolist, if there is and repo not in the folder list, clone it
  cloneList = gh.repos.filter(repo => !folders.includes(repo.name));
  console.log(cloneList);
  gh.cloneRepos(cloneList);
  let end = new Date();
  const duration = (end - now)/1000;
  console.log("GitHub repositories backed up successfully. Duration: " + duration + " seconds");
})

const simpleGit = require('simple-git');
const githubController = require('./controllers/githubController');
const appCtr = require('./controllers/appController');
// init program
const gh = new githubController(process.env.GITHUB_ACCOUNT_NAME);
let clonedList = [];
console.log("GitHub repositories start to back up ...");
let now = new Date();

gh.verification(); // check if the token and account name are valid

gh.getRepoNames() // Get the list of repos from the github api
.then(() => { 
  console.log("[index.js] Start create sub folders");
  // create sub folders for each group
  for (folder of gh.groups) {
    appCtr.createFolder(gh.backupPath + "/" + folder);
  }
  console.log("[index.js] Completed create sub folders");
}).then(() => {
  console.log("[index.js] Start Find out which repos are already cloned");
  // Find out which repos are already cloned
  for (owner of gh.groups) {
    const folder=owner;
    const ownerRepos = gh.repos.filter(repo => repo.owner.login === owner);
    // go to the backup path and get the list of all folders
    const folders = appCtr.getAllFolders(gh.backupPath + folder + '/' );
    clonedList = clonedList.concat(ownerRepos.filter(repo => folders.includes(repo.name)));
  }
  console.log("clonedList: " + clonedList.map(repo => repo.full_name));
  console.log("[index.js] Completed Find out which repos are already cloned");
}).then(() => {
  // Compare the folder list and repolist, if there is and repo not in the folder list, clone it
  cloneList = gh.repos.filter(repo => !clonedList.includes(repo));
  console.log("cloneList: " + cloneList.map(repo => repo.full_name));
  gh.cloneRepos(cloneList);
  
}).then(() => {
  // TODO: implement the pullRepos function (run git pull and get all branches and tags from github)
  gh.pullRepos();

  let end = new Date();
  const duration = (end - now)/1000;
  console.log("GitHub repositories backed up successfully. Duration: " + duration + " seconds");
})

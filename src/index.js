const simpleGit = require('simple-git');
const githubController = require('./controllers/githubController');

// init program
const gh = new githubController(process.env.GITHUB_ACCOUNT_NAME);

gh.verification(); // check if the token and account name are valid

gh.getRepoNames() // Get the list of repos from the github api
.then(() => { 
  // go to the backup path and get the list of all folders
  
  console.log(gh.repos);
  //gh.cloneRepos();
}).then(() => {
  // for each folder, check if it is a git repo, if yes run git pull and get all branches and tags from github
  
  console.log(gh.repos);

}).then(() => {
  // Compare the folder list and repolist, if there is and repo not in the folder list, clone it
  //gh.cloneRepos();
  console.log(gh.repos);
})

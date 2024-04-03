const fs = require('fs')
const { error } = require('console')
const simpleGit = require('simple-git');
const axios = require('axios');

// This is a class for getting the github data from the github api
class GithubController {
  constructor(accountName) {
    this.accountName = accountName;
    //get the token from the environment variable
    this.token = process.env.GITHUB_PAT;
    this.repos = [];
    this.backupPath = process.env.BACKUP_PATH;
  }

  verification() {
    // check if the token is valid
    if (!this.token) {
      console.error("No github token found in the environment variable GITHUB_PAT");
      process.exit(1);
    }
    // check if the account name is valid
    if (!this.accountName) {
      console.error("No github account name found in the environment variable GITHUB_ACCOUNT_NAME");
      process.exit(1);
    }
    // check if the backup path is valid
    if (!this.backupPath) {
      console.error("No backup path found in the environment variable BACKUP_PATH");
      process.exit(1);
    }
    // check if the backup path is a directory
    if (!fs.existsSync(this.backupPath)) {
      console.error("The backup path is not a directory");
      process.exit(1);
    }

  }

  // function: get the list of repos from github on a specific account
  async getRepoNames() {
    try {
      //Send a request to the github api : 
      // $ curl --request GET --url "https://api.github.com/users/xela-engineer/repos" --header "Authorization: Bearer tokennnn" --header "X-GitHub-Api-Version: 2022-11-28" --header "Accept: application/vnd.github+json"
      const headers = {
        "Authorization": `Bearer  ${this.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Accept": "application/vnd.github+json"
      };
      await axios.get( `https://api.github.com/users/${this.accountName}/repos`, { headers })
              .then(response => {
                this.repos = response.data.filter(repo => repo.owner.login === this.accountName);
                console.log(response.data);
                //return repos;
              })
              .catch(error => {
                console.error(error);
            });
      
    } catch (error) {
      console.error(error);
    }
  }

  // function: clone repos from github
  async cloneRepos(cloneList) {
    try {
      //clone the repos
      const options = {
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
        '--mirror': 'true'
      };
      const git = simpleGit(options);
      cloneList.forEach(repo => {
        git.clone(repo.clone_url, `${this.backupPath}${repo.name}`, (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(data);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }


  // function: pull repos from github
  async pullRepos(pullList) {
    try {
      //clone the repos
      const options = {
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
      };
      // TODO: git branch -r | grep -v '\->' | sed "s,\x1B\[[0-9;]*[a-zA-Z],,g" | while read remote; do git branch --track "${remote#origin/}" "$remote"; done
      const git = simpleGit(options);
      
      
      pullList.forEach(async (repo) => {
        // asign value to repos, if name is repo.name in the array of this.repos
        const index = this.repos.findIndex( x => x.name === repo.name);

        const data = await simpleGit(`${this.backupPath}${repo.name}`).branch(['-r']);
        this.repos[index].branches = data.all;
        console.log(result);
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = GithubController;
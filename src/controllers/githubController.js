const fs = require('fs')
const { error, group } = require('console')
const simpleGit = require('simple-git');
const axios = require('axios');

// This is a class for getting the github data from the github api
class GithubController {
  constructor(accountName) {
    this.accountName = accountName;
    //get the token from the environment variable
    this.token = process.env.GITHUB_PAT;
    this.repos = [];
    this.groups = [];
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
      let page = 1;
      while (true) {
        const res = await axios.get( `https://api.github.com/user/repos?page=${page}`, { headers });
        if (res.status != 200){
          console.error("github api return error code: " + res.status);
          break;
        }

        if (res == undefined || res.data.length == 0){
          break;
        }
        this.repos = this.repos.concat(res.data);
        page++;
      }
      // get the list of groups
      this.groups = this.repos.map(repo => repo.owner.login);
      this.groups = [...new Set(this.groups)];
    } catch (error) {
      console.error(error);
    }
  }

  // function: clone repos from github
  async cloneRepos(cloneList) {
    try {
      console.log("Cloning all Repos...");
      //clone the repos
      const options = {
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
        '--mirror': 'true'
      };
      const git = simpleGit(options);
      
      cloneList.forEach(async repo => {
        // add login cred to github url
        repo.clone_url
        const remote = `https://${this.accountName}:${this.token}@${repo.clone_url.replace("https://", "")}`;
        await git.clone(remote, `${this.backupPath}${repo.owner.login}/${repo.name}`, (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          //console.log(data);
        });
      });
      
      console.log("Cloned all Repos.");
    } catch (error) {
      console.error(error);
    }
  }


  // function: pull repos from github
  async pullRepos(pullList) {
    try {
      console.log("Pulling all Repos...");
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

        const data = await simpleGit(`${this.backupPath}${repo.owner.login}/${repo.name}`).branch(['-r']);
        this.repos[index].branches = data.all;
        console.log(result);
      });
      
      
      console.log("Pulled all Repos.");
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = GithubController;
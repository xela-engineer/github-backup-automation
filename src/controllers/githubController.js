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
      axios.get( `https://api.github.com/users/${this.accountName}/repos`, { headers })
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
  async cloneRepos() {
    try {
      //clone the repos
      const options = {
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
      };
      const git = simpleGit(options);
      this.repos.forEach(repo => {
        git.clone(repo.clone_url, `/root/repos-backup/${repo.name}`, (err, data) => {
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

}

module.exports = GithubController;
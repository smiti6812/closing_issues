
const core = require('@actions/core');
const github = require('@actions/github');
async function getIssuesFromPR() {
  const token = core.getInput("token");
  const owner = core.getInput("owner");
  const repo = core.getInput("repo");
  const pull_number = core.getInput("pull_number");  
  const octokit = github.getOctokit(token);
  const branch = core.getInput("branch");
  const issue_number = branch.substring(0,branch.indexOf("-")) ;
  const reponame = await octokit.repos.get({
    owner: 'owner_username',
      ...github.context.repo
  });
  const issues = await octokit.rest.issues.get({
        owner: owner,
         ...github.context.repo,    
        issue_number: issue_number        
      });
    
      const response = await octokit.rest.issues.update({
        owner: owner,
        ...github.context.repo,
        state: 'closed',
        issue_number: issue_number        
      });
        
      core.setOutput("issue", issues.data);
      core .setOutput("Reponame:", reponame.name);
}

getIssuesFromPR().then(issues => console.log(issues));

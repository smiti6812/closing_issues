
const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@actions/core');

async function run() {
    try {
      const token = core.getInput("token");
      const title = core.getInput("title");
      const body = core.getInput("body");
      const assignees = core.getInput("assignees");
      const owner = core.getInput("owner");
      const repo = core.getInput("repo");
  
      const octokit = github.getOctokit(token);
    
      const issues = await octokit.rest.issues.get({
        owner: owner,
        ...github.context.repo,     
        issue_number: 66        
      });
        
      core.setOutput("issue", issues.data);
      core.setOutput("openissues", JSON.stringify(issues.open_issues))
    } catch (error) {
      core.setFailed(error.message);
    }
  }  
  //run();

async function getMilestone(){
     const token = core.getInput("token");      
     const owner = core.getInput("owner");
     const repo = core.getInput("repo");
     const octokit = github.getOctokit(token);
    try
    {
        const milestone = await octokit.rest.issues.getMilestone({
          owner: owner,
          ...github.context.repo, 
          milestone_number: 2
        });        
        core.setOutput("milestone", milestone.open_issues);
        //core.setOutput("openissues", JSON.stringify(milestone.data))
    }
    catch(error)
    {
        core.setFailed(error.message);
    }
}
getMilestone();
/*
async function getIssuesFromPR() {
  const token = core.getInput("token");
  const owner = core.getInput("owner");
  const repo = core.getInput("repo");
  const pull_number = core.getInput("pull_number");  
  const octokit = github.getOctokit(token);
  try {
    const pullRequest = await octokit.rest.pulls.get({
      owner,
      ...github.context.repo,
      pull_number: pull_number
    });

    const body = pullRequest.data.body;
    if (!body) {
      console.log('Pull request does not have a body.');
      return [];
    }
    // This regex finds GitHub issue references like #123
    const issueReferences = body.match(/#\d+/g);

    if (issueReferences) {
      // Remove the '#' prefix
      const issueNumbers = issueReferences.map(ref => ref.replace('#', ''));

      // Get the issue details
      const issues = await Promise.all(issueNumbers.map(number => {
        return octokit.rest.issues.get({
          owner,
          ...github.context.repo,
          issue_number: number
        });
      }));

      return issues.map(issue => issue.data);
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
}

getIssuesFromPR().then(issues => console.log(issues));


async function getIssuesFromPR() {
  const token = core.getInput("token");
  const owner = core.getInput("owner");
  const repo = core.getInput("repo");
  const octokit = github.getOctokit(token);
  const branch = core.getInput("branch");
  const issue_number = branch.substring(0,branch.indexOf("-")) ;
  const response = await octokit.rest.issues.update({
    owner: owner,
    ...github.context.repo,
    state: 'closed',
    issue_number: issue_number
  });  
    core.setOutput("issue", 'Issue number #' + issue_number +' has been closed now!');   
}
getIssuesFromPR().then(issues => console.log(issues));
*/

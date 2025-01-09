
const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@actions/core');

async function closeIssueAndMilestone() {
    try {
      const token = core.getInput("token");
      const title = core.getInput("title");
      const body = core.getInput("body");
      const assignees = core.getInput("assignees");
      const owner = core.getInput("owner");
      const repo = core.getInput("repo");
      let branch = core.getInput("branch");
      branch = branch.replace("refs/heads/","")
      const issue_number = branch.substring(0,branch.indexOf("-"));  
      const octokit = github.getOctokit(token);

      const issues = await octokit.rest.issues.get({
         owner: owner,
         repor: repo,     
         issue_number: issue_number        
       });
     let milestoneNumber = issues.data.milestone.number;
     closeIssue(octokit, repo, owner, issue_number);
     core.setOutput("issuenumber", 'Issue number #' + issue_number +' has been closed now!');    
     getMilestoneAndClose(octokit, repo, owner, milestoneNumber);      
    } 
    catch (error) {
      core.setFailed(error.message);
    }
  }  
  closeIssueAndMilestone();

async function closeIssue(octokit, repo, owner, issue_number){
     const response = await octokit.rest.issues.update({
        owner: owner,
        repo: repo,
        state: 'closed',
        issue_number: issue_number
      });
}

async function getMilestoneAndClose(octokit, repo, owner, milestoneNumber){ 
    try
    {
        //Check if the milestone has open issues. If not then milestone can be closed.
        let openIssues = returnOpenIssues(octokit, owner, repo, milestoneNumber);
        if (openIssues === 0){
            closeMilestone(octokit, owner, repo, milestoneNumber);
        }        
    }
    catch(error)
    {
        core.setFailed(error.message);
    }    
}

async function returnOpenIssues(octokit, owner, repo, milestoneNumber){
    const milestone = await octokit.rest.issues.getMilestone({
        owner: owner,
        repo: repo,
        milestone_number: milestoneNumber
    });
    core.setOutput("milestone", milestoneNumber);
    core.setOutput("openissues", milestone.data.open_issues);
    return milestone.data.open_issues;
}

async function closeMilestone(octokit, owner, repo, milestoneNumber){
    const updateMilestone = await octokit.rest.issues.updateMilestone({
        owner: owner,
        repo: repo,
        state: 'closed',
        milestone_number: milestoneNumber
    });    
}
//getMilestoneAndClose();
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


const core = require('@actions/core');
const github = require('@actions/github');
/*
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
        issue_number: 25        
      });
        
      core.setOutput("issue", issues.data);
    } catch (error) {
      core.setFailed(error.message);
    }
  }
  
  run();
*/

async function getIssuesFromPR() {
  const token = core.getInput("token");
  const owner = core.getInput("owner");
  const repo = core.getInput("repo");
  const pull_number = core.getInput("pull_number");  
  const octokit = github.getOctokit(token);
  try {
    const pullRequest = await octokit.pulls.get({
      owner,
      ...github.context.repo,
      pull_number
    });

    const body = pullRequest.data.body;

    // This regex finds GitHub issue references like #123
    const issueReferences = body.match(/#\d+/g);

    if (issueReferences) {
      // Remove the '#' prefix
      const issueNumbers = issueReferences.map(ref => ref.replace('#', ''));

      // Get the issue details
      const issues = await Promise.all(issueNumbers.map(number => {
        return octokit.issues.get({
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


const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
      const token = core.getInput("token");
      const title = core.getInput("title");
      const body = core.getInput("body");
      const assignees = core.getInput("assignees");
      const owner = core.getInput("owner");
      const repo = core.getInput("repo");
  
      const octokit = github.getOctokit(token);
      /*
      const response = await octokit.rest.issues.create({
        // owner: github.context.repo.owner,
        // repo: github.context.repo.repo,
        ...github.context.repo,
        title,
        body,
        assignees: assignees ? assignees.split("\n") : undefined,
      });
      */
      const issues = await octokit.rest.issues.get({
        owner,
        repo,        
        issue_number: 25,       
      });
        
      core.setOutput("issue", response.data);
    } catch (error) {
      core.setFailed(error.message);
    }
  }
  
  run();

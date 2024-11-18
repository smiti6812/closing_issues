
/*
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
 
  const issues = await octokit.rest.issues.get({
        owner: owner,
         repo: repo,    
        issue_number: issue_number        
      });
    
      const response = await octokit.rest.issues.update({
        owner: owner,
        ...github.context.repo,
        state: 'closed',
        issue_number: issue_number        
      });
        
      core.setOutput("issue", issues.data);      
}

getIssuesFromPR().then(issues => console.log(issues));
*/

import * as core from '@actions/core';
import * as github from '@actions/github';
import {graphql} from "@octokit/graphql"

async function callLinkedIssuesQuery(){
const linkedIssuesQuery = `
query getLinkedIssues(
  $repo: String!,
  $owner: String!,
  $pull_number: Int!,
  $maxIssues: Int!,
) {
  repository(name: $repo, owner: $owner) {
    pullRequest(number: $pull_number) {
      timelineItems(first: $maxIssues, itemTypes: CROSS_REFERENCED_EVENT) {
        nodes {
          ... on CrossReferencedEvent {
            source {
              ... on Issue {
                number
                body
                title
              }
            }
          }
        }
      }
    }
  }
};
`
const owner = core.getInput("owner");
const repo = core.getInput("repo");
const pull_number = core.getInput("pull_number"); 
const maxIssues = 1;
const token = core.getInput("token");

core.setOutput("Repo:",repo);

graphql(linkedIssuesQuery, {
  owner,
  repo,
  pull_number,
  maxIssues,
  headers: {
    authorization: "bearer " + token,
  },
})
.then(result => console.log(result))
.catch(err => console.error(err));
}

callLinkedIssuesQuery();
async function callLinkedIssuesQuery(){
const linkedIssuesQuery = `
query getLinkedIssues(
  $repo: String!,
  $owner: String!,
  $pull_number: Int!,
  $maxIssues: Int!,
) {
  repository(name: $repo, owner: $owner) {
    pullRequest(number: $pull_number) {
      timelineItems(first: $maxIssues, itemTypes: CROSS_REFERENCED_EVENT) {
        nodes {
          ... on CrossReferencedEvent {
            source {
              ... on Issue {
                number
                body
                title
              }
            }
          }
        }
      }
    }
  }
};
`
const owner = core.getInput("owner");
const repo = core.getInput("repo");
const pull_number = core.getInput("pull_number"); 
const maxIssues = 1;
const token = core.getInput("token");

core.setOutput("Repo:",repo);

graphql(linkedIssuesQuery, {
  owner,
  repo,
  pull_number,
  maxIssues,
  headers: {
    authorization: "bearer " + token,
  },
})
.then(result => console.log(result))
.catch(err => console.error(err));
}

callLinkedIssuesQuery();

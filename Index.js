import * as core from '@actions/core';
import * as github from '@actions/github';
import {graphql} from "@octokit/graphql"

async function callLinkedIssuesQuery(){
const linkedIssuesQuery = `
query getLinkedIssues(
  $repository: String!,
  $owner: String!,
  $pull_number: Int!,
  $maxIssues: Int!
) {
  repository(name: $repository, owner: $owner) {
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
}
`;
const owner = core.getInput("owner");
const repository = core.getInput("repo");
const pull_number = parseInt(core.getInput("pull_number")); 
const maxIssues = 1;
const token = core.getInput("token");

core.setOutput("Repo:",repo);

graphql(linkedIssuesQuery, {
  owner,
  repository,
  pull_number,
  maxIssues,
  headers: {
    authorization: "bearer " + token,
  },
})
.then(result =>{ 
                console.log(JSON.stringify(result, null, 2));
                result.data.repository.pullRequest.timelineItems.nodes.forEach(node => {
                  console.log(node.source.number);
                      });
  
               })
.catch(err => console.error(err));
}

callLinkedIssuesQuery();

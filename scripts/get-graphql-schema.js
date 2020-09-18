#!/usr/bin/env node

const AWS = require("aws-sdk");
AWS.config.update({ region:
  process.env.CDK_DEPLOY_REGION ||
  process.env.CDK_DEFAULT_REGION ||
  process.env.AWS_REGION ||
  "us-east-1"
});
const appSync = new AWS.AppSync();
const cfn = new AWS.CloudFormation();

const getStackOutput = async (StackName, key) => (await cfn
  .describeStacks({ StackName }).promise())
  .Stacks
  .map((stack) => stack.Outputs
    .find((output) => output.OutputKey === key))
  .filter((it) => it)
  .shift()
  .OutputValue;

async function main() {
  const params = {
    format: "SDL"
    apiId: await getStackOutput(
      "ionic-conference-demo-ApiStack",
      "AmplifyConfigAppSyncApiId"
    )
  };
  const res = await appSync.getIntrospectionSchema(params).promise();
  console.log(res);
}

main().catch(console.error);

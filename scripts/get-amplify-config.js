#!/usr/bin/env node

const AWS = require("aws-sdk");
AWS.config.update({ region:
  process.env.CDK_DEPLOY_REGION ||
  process.env.CDK_DEFAULT_REGION ||
  process.env.AWS_REGION ||
  "us-east-1"
});
const cfn = new AWS.CloudFormation();

const getStackOutput = async (StackName, key) => JSON.parse(
  (await cfn.describeStacks({ StackName }).promise())
    .Stacks
    .map((stack) => stack.Outputs
      .find((output) => output.OutputKey === key))
    .filter((it) => it)
    .shift()
    .OutputValue);

async function main() {
  const baseConfig = await getStackOutput(
    "ionic-conference-demo-BaseStack",
    "AmplifyConfigBaseOutput"
  );
  const apiConfig = await getStackOutput(
    "ionic-conference-demo-ApiStack",
    "AmplifyConfigAppSyncOutput"
  );
  console.log(JSON.stringify({
    ...apiConfig,
    ...baseConfig
  }, null, 2));
}

main().catch(console.error);

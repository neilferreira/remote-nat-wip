import * as cdk from '@aws-cdk/core';
import * as rds from "@aws-cdk/aws-rds";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ssm from "@aws-cdk/aws-ssm";

export class RdsIssueStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const databaseName = "test";
    const dbSecret = new rds.DatabaseSecret(this, "DbSecret", {
      username: "root",
    });

    const vpc = new ec2.Vpc(this, "RDSVPC");

    const rdsCluster = new rds.ServerlessCluster(
      this,
      "AuroraServerlessCluster",
      {
        engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
        parameterGroup: rds.ParameterGroup.fromParameterGroupName(
          this,
          "ParameterGroupForRDS",
          "default.aurora-postgresql10"
        ),
        defaultDatabaseName: databaseName,
        credentials: rds.Credentials.fromSecret(dbSecret),
        vpc,
        enableDataApi: true,
      }
    );
  }
}

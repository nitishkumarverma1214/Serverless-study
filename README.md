
## References
serverless getting started: https://www.serverless.com/framework/docs/getting-started
Nodejs serverless project setup: https://awstip.com/create-a-node-js-serverless-project-a-step-by-step-guide-for-beginners-1df03f7f2413

Reference Variables:https://www.serverless.com/framework/docs/providers/aws/guide/variables#reference-variables-using-aws-secrets-manager

query vs getItem in dynamodb: https://stackoverflow.com/questions/12241235/dynamodb-query-versus-getitem-for-single-item-retrieval-based-on-the-index

query and scan examaple: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-query-scan.html
GetItemCommand issue (Marshall and Unmarshall) : https://github.com/aws/aws-sdk-js-v3/issues/4726#issuecomment-1549208534

schedule: https://www.serverless.com/framework/docs/providers/aws/events/schedule

psueudo parameters: https://stackoverflow.com/questions/42612499/how-do-i-get-the-accountid-as-a-variable-in-a-serverless-yml-file

Open spec API: https://swagger.io/docs/specification/basic-structure/

schema validator: https://medium.com/@Scampiuk/handling-api-validation-with-openapi-swagger-documents-in-nodejs-1f09c133d4d2

s3 cloudformation: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html

cors: https://www.serverless.com/blog/cors-api-gateway-survival-guide/

- To install the plugins in serverless.yml
    -- serverless plugin install -n PLUGIN_NAME

- To deploy
    -- serverless deploy --verbose

- To bring down the server
    -- serverless remove --verbose

- To update a function
    -- serverless deploy function -f FUNCTION_NAME (in serverless.yml)

- To get logs for a function in console
    -- serverless logs -f processAuction -t

- To trigger a function manually 
    -- serverless invoke -f processAuction -l

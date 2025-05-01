# ImageInsights Workshop Demo Script

This script outlines the step-by-step process for demonstrating how to build the ImageInsights application using Amazon Q Developer CLI during your workshop.

## Demo Setup

1. Ensure you have the following prerequisites installed:
   - AWS CLI
   - AWS SAM CLI
   - Node.js 14+
   - Amazon Q Developer CLI
   - jq (for JSON processing)

2. Clear your terminal and prepare for the demo:
   ```bash
   clear
   cd ~/Developer/mcp/q-chat
   ```

## Demo Flow

### 1. Introduction (5 minutes)

Start by explaining the application we're going to build:

"Today, we're going to build ImageInsights, a serverless application that analyzes images using AI. This application will allow users to upload images, analyze them for objects, text, and faces, and search for images by content. We'll build this entire application using Amazon Q Developer CLI, showing how it can accelerate development across the entire application lifecycle."

### 2. Building Infrastructure with Amazon Q (10 minutes)

Show how Amazon Q can generate infrastructure code:

```bash
q chat
```

Then ask:

```
I want to build a serverless image analysis application called ImageInsights. It should use S3 for storage, Lambda for processing, DynamoDB for storing results, and Rekognition for image analysis. Can you generate a CloudFormation/SAM template for this?
```

Review the generated template with the audience, highlighting how Amazon Q:
- Created appropriate IAM permissions
- Set up S3 event triggers
- Configured DynamoDB tables
- Added API Gateway endpoints

### 3. Building Lambda Functions with Amazon Q (15 minutes)

Now, ask Amazon Q to generate the Lambda functions:

```
Now I need a Lambda function that processes images uploaded to S3. It should use Rekognition to detect labels, text, and faces, and store the results in DynamoDB. Can you write this function in Node.js?
```

After reviewing the function, ask for additional functions:

```
Can you write a Lambda function that retrieves image analysis results from DynamoDB by imageId?
```

```
I need a Lambda function that generates presigned URLs for uploading images to S3.
```

```
Can you write a Lambda function that searches for images by content (labels or text) in DynamoDB?
```

### 4. Building the Frontend with Amazon Q (10 minutes)

Ask Amazon Q to generate a simple frontend:

```
Can you create a simple HTML/JS frontend for the ImageInsights application? It should allow users to upload images, view their gallery, and search for images by content.
```

### 5. Deployment with Amazon Q (5 minutes)

Ask Amazon Q to help with deployment:

```
Can you create a deployment script that uses AWS SAM to deploy the entire application?
```

Then ask for a cleanup script:

```
Can you create a cleanup script that will delete all resources created by this application?
```

### 6. Extending with MCP (10 minutes)

Show how MCP can enhance Amazon Q's capabilities:

```
I want to optimize my Lambda functions for performance and cost. Can you analyze my process-image function and suggest improvements?
```

With AWS Lambda MCP server configured:

```
Can you suggest best practices for securing my S3 bucket and API Gateway endpoints?
```

### 7. Live Demo (10 minutes)

Deploy and demonstrate the application:

```bash
./deploy.sh
```

After deployment, open the frontend in a browser and:
1. Set a user ID
2. Upload an image
3. View the analysis results
4. Search for objects in the image

Show how to clean up resources when done:

```bash
./cleanup.sh
```

### 8. Wrap-up and Q&A (5 minutes)

Summarize what we've built and how Amazon Q accelerated the development process:
- Generated infrastructure code
- Created Lambda functions
- Built a frontend
- Provided deployment guidance
- Offered optimization suggestions
- Created cleanup scripts

## Key Talking Points

Throughout the demo, emphasize these points:

1. **Natural Language Interaction**: Show how complex requirements can be expressed in plain language.

2. **Context Awareness**: Highlight how Amazon Q maintains context throughout the conversation.

3. **Code Quality**: Point out the best practices in the generated code (error handling, logging, etc.).

4. **Time Savings**: Mention how tasks that would take hours are completed in minutes.

5. **Learning Opportunity**: Explain how Amazon Q can help developers learn new AWS services and patterns.

6. **Complete Lifecycle Management**: Demonstrate how Amazon Q helps with the entire application lifecycle, from development to deployment to cleanup.

## Troubleshooting Tips

If you encounter any issues during the demo:

1. **Deployment Errors**:
   - Check the CloudFormation events for specific error messages
   - Use the AWS Management Console to verify resource creation
   - If S3 bucket already exists, modify the bucket name in the deployment script

2. **Frontend Issues**:
   - Verify the API Gateway URL is correctly updated in the frontend code
   - Check browser console for any JavaScript errors
   - Ensure CORS is properly configured

3. **Lambda Function Errors**:
   - Check CloudWatch Logs for detailed error messages
   - Verify IAM permissions are correctly set up
   - Test individual functions using the AWS Console

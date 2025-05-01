# ImageInsights

A serverless image analysis application built with AWS services. This project demonstrates how Amazon Q Developer CLI can help build modern cloud applications through natural language interactions.

## Architecture

ImageInsights uses the following AWS services:

- **Amazon S3**: Stores uploaded images
- **AWS Lambda**: Processes images and handles API requests
- **Amazon API Gateway**: Provides RESTful API endpoints
- **Amazon DynamoDB**: Stores image analysis results
- **Amazon Rekognition**: Analyzes images for objects, text, and faces
- **AWS CloudFormation/SAM**: Manages infrastructure as code

![Architecture Diagram](https://raw.githubusercontent.com/username/image-insights/main/docs/architecture.png)

## Project Structure

```
image-insights/
├── frontend/                # HTML/JS web application
│   ├── index.html           # Main HTML file
│   └── js/                  # JavaScript files
│       └── app.js           # Application logic
├── backend/                 # Lambda functions
│   ├── process-image/       # Image processing function
│   ├── get-image/           # Get image details function
│   ├── list-images/         # List user images function
│   ├── search-images/       # Search images by content function
│   └── get-upload-url/      # Generate upload URL function
└── infrastructure/          # CloudFormation/SAM templates
    └── template.yaml        # SAM template
```

## Features

- Upload images for analysis
- Detect objects, scenes, and activities in images
- Identify text in images
- Analyze faces for emotions and attributes
- Search images by content (e.g., "show me images with dogs")
- View analysis history and insights

## How It Works

1. User uploads an image via the frontend
2. Frontend gets a presigned URL from the API
3. Image is uploaded directly to S3
4. S3 event triggers the process-image Lambda function
5. Lambda uses Rekognition to analyze the image
6. Analysis results are stored in DynamoDB
7. User can view and search for images via the frontend

## Deployment

This project can be deployed with a single command using the provided script:

```bash
./deploy.sh
```

Or manually using AWS SAM:

```bash
# Install dependencies
cd backend/process-image && npm install && cd ../..
cd backend/get-image && npm install && cd ../..
cd backend/list-images && npm install && cd ../..
cd backend/search-images && npm install && cd ../..
cd backend/get-upload-url && npm install && cd ../..

# Deploy with SAM
sam deploy --guided
```

## Workshop Demo Flow

1. Use Amazon Q to generate the infrastructure code
2. Use Amazon Q to write Lambda functions
3. Use Amazon Q to configure S3 and permissions
4. Use Amazon Q to implement Rekognition integration
5. Deploy the application
6. Demonstrate the application features

## Prerequisites

- AWS Account
- AWS CLI configured
- AWS SAM CLI installed
- Node.js 14+ installed

## Security Considerations

- The application uses IAM roles with least privilege
- S3 bucket is configured with appropriate CORS settings
- API endpoints can be secured with authentication (not implemented in this demo)
- Sensitive operations use presigned URLs with expiration

## Cost Considerations

This application uses serverless services that scale with usage:
- Lambda functions: Pay only for execution time
- S3: Pay for storage and requests
- DynamoDB: Pay for storage and read/write capacity
- Rekognition: Pay per image analyzed

For a demo or development environment, costs should be minimal.

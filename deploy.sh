#!/bin/bash

# ImageInsights Deployment Script
# This script deploys the ImageInsights application using AWS SAM

set -e

echo "ImageInsights Deployment Script"
echo "=============================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "AWS SAM CLI is not installed. Please install it first."
    exit 1
fi

# Generate a unique bucket name with timestamp
BUCKET_NAME="image-insights-uploads-$(date +%s)"
echo "Using bucket name: $BUCKET_NAME"

# Install dependencies for Lambda functions
echo "Installing dependencies for Lambda functions..."
cd backend/process-image && npm install && cd ../..
cd backend/get-image && npm install && cd ../..
cd backend/list-images && npm install && cd ../..
cd backend/search-images && npm install && cd ../..
cd backend/get-upload-url && npm install && cd ../..

# Install cfn-response for the custom resource Lambda
echo "Installing cfn-response package..."
mkdir -p backend/configure-s3-notification
cd backend/configure-s3-notification
npm init -y
npm install cfn-response
cd ../..

# Deploy the application using SAM
echo "Deploying the application using SAM..."
sam deploy --guided --template-file infrastructure/template.yaml --parameter-overrides BucketName=$BUCKET_NAME

# Get the API Gateway URL
API_URL=$(aws cloudformation describe-stacks --stack-name image-insights --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" --output text)

if [ -z "$API_URL" ]; then
    echo "Failed to get API Gateway URL. Please check the deployment logs."
    exit 1
fi

# Update the frontend configuration with the API Gateway URL
echo "Updating frontend configuration with API Gateway URL: $API_URL"
sed -i '' "s|YOUR_API_GATEWAY_URL|$API_URL|g" frontend/js/app.js

# Create a simple script to serve the frontend locally
cat > serve-frontend.sh << 'EOF'
#!/bin/bash
echo "Starting local server for ImageInsights frontend..."
echo "Open http://localhost:8080 in your browser"
cd frontend && python3 -m http.server 8080
EOF

chmod +x serve-frontend.sh

echo "Deployment complete!"
echo "API Gateway URL: $API_URL"
echo "S3 Bucket: $BUCKET_NAME"
echo ""
echo "To test the application:"
echo "1. Run ./serve-frontend.sh to start a local web server"
echo "2. Open http://localhost:8080 in your web browser"
echo "3. Enter a user ID (any string)"
echo "4. Upload an image and see the analysis results"
echo ""
echo "Note: For a production deployment, you would host the frontend on S3 with CloudFront."

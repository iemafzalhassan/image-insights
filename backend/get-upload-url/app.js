const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const s3 = new AWS.S3();

// Environment variables
const UPLOAD_BUCKET = process.env.UPLOAD_BUCKET;

/**
 * Lambda function to generate a presigned URL for uploading images
 */
exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));
        
        // Get userId and filename from query parameters
        const userId = event.queryStringParameters?.userId;
        const filename = event.queryStringParameters?.filename;
        
        if (!userId || !filename) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Missing userId or filename parameter' })
            };
        }
        
        // Generate a unique key for the image
        const fileExtension = filename.split('.').pop();
        const uniqueId = uuidv4();
        const key = `${userId}/${uniqueId}.${fileExtension}`;
        
        // Generate a presigned URL for uploading
        const presignedUrl = await s3.getSignedUrlPromise('putObject', {
            Bucket: UPLOAD_BUCKET,
            Key: key,
            ContentType: `image/${fileExtension}`,
            Expires: 3600 // URL expires in 1 hour
        });
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                uploadUrl: presignedUrl,
                key: key,
                bucket: UPLOAD_BUCKET
            })
        };
    } catch (error) {
        console.error('Error generating upload URL:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                message: 'Error generating upload URL',
                error: error.message
            })
        };
    }
};

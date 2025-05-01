const AWS = require('aws-sdk');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Environment variables
const IMAGES_TABLE = process.env.IMAGES_TABLE;
const UPLOAD_BUCKET = process.env.UPLOAD_BUCKET;

/**
 * Lambda function to get image analysis results by imageId
 */
exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));
        
        // Get imageId from path parameters
        const imageId = event.pathParameters.imageId;
        
        if (!imageId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Missing imageId parameter' })
            };
        }
        
        // Get the image data from DynamoDB
        const result = await dynamodb.get({
            TableName: IMAGES_TABLE,
            Key: { imageId }
        }).promise();
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Image not found' })
            };
        }
        
        // Generate a presigned URL for the image
        const presignedUrl = await s3.getSignedUrlPromise('getObject', {
            Bucket: result.Item.bucket,
            Key: result.Item.key,
            Expires: 3600 // URL expires in 1 hour
        });
        
        // Add the presigned URL to the response
        const response = {
            ...result.Item,
            presignedUrl
        };
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(response)
        };
    } catch (error) {
        console.error('Error getting image:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                message: 'Error getting image',
                error: error.message
            })
        };
    }
};

const AWS = require('aws-sdk');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Environment variables
const IMAGES_TABLE = process.env.IMAGES_TABLE;

/**
 * Lambda function to list images for a user
 */
exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));
        
        // Get userId from query parameters
        const userId = event.queryStringParameters?.userId;
        
        if (!userId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Missing userId parameter' })
            };
        }
        
        // Query DynamoDB for images by userId using the GSI
        const result = await dynamodb.query({
            TableName: IMAGES_TABLE,
            IndexName: 'UserIdIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
        
        // Generate presigned URLs for each image
        const images = await Promise.all(result.Items.map(async (item) => {
            const presignedUrl = await s3.getSignedUrlPromise('getObject', {
                Bucket: item.bucket,
                Key: item.key,
                Expires: 3600 // URL expires in 1 hour
            });
            
            // Return a simplified version of the item with the presigned URL
            return {
                imageId: item.imageId,
                createdAt: item.createdAt,
                presignedUrl,
                labels: item.analysis.labels.slice(0, 5) // Return only top 5 labels
            };
        }));
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(images)
        };
    } catch (error) {
        console.error('Error listing images:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                message: 'Error listing images',
                error: error.message
            })
        };
    }
};

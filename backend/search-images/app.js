const AWS = require('aws-sdk');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Environment variables
const IMAGES_TABLE = process.env.IMAGES_TABLE;

/**
 * Lambda function to search images by content
 */
exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));
        
        // Get search query and userId from query parameters
        const query = event.queryStringParameters?.query?.toLowerCase();
        const userId = event.queryStringParameters?.userId;
        
        if (!query) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Missing query parameter' })
            };
        }
        
        // Get all images for the user
        let params = {};
        
        if (userId) {
            // If userId is provided, query by userId
            params = {
                TableName: IMAGES_TABLE,
                IndexName: 'UserIdIndex',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            };
        } else {
            // Otherwise, scan the entire table
            params = {
                TableName: IMAGES_TABLE
            };
        }
        
        const result = await dynamodb.scan(params).promise();
        
        // Filter images based on the search query
        const matchedImages = result.Items.filter(item => {
            // Check if any label matches the query
            const labelMatch = item.analysis.labels.some(label => 
                label.Name.toLowerCase().includes(query) && label.Confidence > 70
            );
            
            // Check if any detected text matches the query
            const textMatch = item.analysis.text.some(text => 
                text.DetectedText.toLowerCase().includes(query) && text.Confidence > 70
            );
            
            return labelMatch || textMatch;
        });
        
        // Generate presigned URLs for matched images
        const images = await Promise.all(matchedImages.map(async (item) => {
            const presignedUrl = await s3.getSignedUrlPromise('getObject', {
                Bucket: item.bucket,
                Key: item.key,
                Expires: 3600 // URL expires in 1 hour
            });
            
            // Find matching labels and text
            const matchingLabels = item.analysis.labels
                .filter(label => label.Name.toLowerCase().includes(query))
                .map(label => ({ name: label.Name, confidence: label.Confidence }));
                
            const matchingText = item.analysis.text
                .filter(text => text.DetectedText.toLowerCase().includes(query))
                .map(text => ({ text: text.DetectedText, confidence: text.Confidence }));
            
            // Return a simplified version of the item with the presigned URL
            return {
                imageId: item.imageId,
                userId: item.userId,
                createdAt: item.createdAt,
                presignedUrl,
                matchingLabels,
                matchingText
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
        console.error('Error searching images:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                message: 'Error searching images',
                error: error.message
            })
        };
    }
};

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Environment variables
const IMAGES_TABLE = process.env.IMAGES_TABLE;
const UPLOAD_BUCKET = process.env.UPLOAD_BUCKET;

/**
 * Lambda function to process images uploaded to S3
 * Uses Rekognition to analyze the image and stores results in DynamoDB
 */
exports.handler = async (event) => {
    try {
        console.log('Processing S3 event:', JSON.stringify(event, null, 2));
        
        // Get the object from the event
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        
        // Generate a unique ID for the image
        const imageId = uuidv4();
        
        // Extract user ID from the object key (assuming format: {userId}/{filename})
        const userId = key.split('/')[0];
        
        // Get the image from S3
        const s3Object = await s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise();
        
        // Analyze the image with Rekognition
        const [labelResults, textResults, faceResults] = await Promise.all([
            detectLabels(s3Object.Body),
            detectText(s3Object.Body),
            detectFaces(s3Object.Body)
        ]);
        
        // Prepare the analysis results
        const analysisResults = {
            labels: labelResults.Labels,
            text: textResults.TextDetections,
            faces: faceResults.FaceDetails
        };
        
        // Store the results in DynamoDB
        const timestamp = new Date().toISOString();
        const item = {
            imageId,
            userId,
            bucket,
            key,
            createdAt: timestamp,
            updatedAt: timestamp,
            analysis: analysisResults
        };
        
        await dynamodb.put({
            TableName: IMAGES_TABLE,
            Item: item
        }).promise();
        
        console.log(`Successfully processed image ${key} and stored analysis results`);
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Image processed successfully',
                imageId
            })
        };
    } catch (error) {
        console.error('Error processing image:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                message: 'Error processing image',
                error: error.message
            })
        };
    }
};

/**
 * Detect labels in an image using Amazon Rekognition
 */
async function detectLabels(imageBytes) {
    const params = {
        Image: {
            Bytes: imageBytes
        },
        MaxLabels: 20,
        MinConfidence: 70
    };
    
    return await rekognition.detectLabels(params).promise();
}

/**
 * Detect text in an image using Amazon Rekognition
 */
async function detectText(imageBytes) {
    const params = {
        Image: {
            Bytes: imageBytes
        }
    };
    
    return await rekognition.detectText(params).promise();
}

/**
 * Detect faces in an image using Amazon Rekognition
 */
async function detectFaces(imageBytes) {
    const params = {
        Image: {
            Bytes: imageBytes
        },
        Attributes: ['ALL']
    };
    
    return await rekognition.detectFaces(params).promise();
}

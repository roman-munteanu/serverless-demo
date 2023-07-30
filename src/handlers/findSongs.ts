import {Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';
import createError from 'http-errors';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: Handler = async (event: APIGatewayProxyEvent): 
    Promise<APIGatewayProxyResult> => {

    const { artist } = event.queryStringParameters;
    let items = [];

    if (artist === '') {
        throw new createError.BadRequest(`You must provide artist parameter`);
    }

    const queryInput = {
        TableName: process.env.SONGS_TABLE_NAME,
        IndexName: 'artistReleaseDateIndex',
        KeyConditionExpression: '#artist = :artist',
        ExpressionAttributeValues: {
            ':artist': artist,
        },
        ExpressionAttributeNames: {
            '#artist': 'artist',
        },
    };

    try {
        const result = await dynamoDB.query(queryInput).promise();
        items = result.Items;
    } catch(err) {
        console.error(err);
        throw new createError.InternalServerError(err);
    }

    return new Promise((resolve) => {
        resolve({
            statusCode: 200,
            body: JSON.stringify(items),
        });
    })
};

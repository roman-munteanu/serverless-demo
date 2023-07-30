import {Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {v4 as uuid} from 'uuid';
import {DynamoDB} from 'aws-sdk';
import createError from 'http-errors';
import {Song} from '../model/songs'

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: Handler = async (event: APIGatewayProxyEvent): 
    Promise<APIGatewayProxyResult> => {

    const {artist, title} = JSON.parse(event.body);
    const now = new Date();

    if (artist === '' || title === '') {
        throw new createError.BadRequest(`You must provide artist and title fields`);
    }

    const item: Song = {
        id: uuid(),
        artist,
        title,
        releaseDate: now.toISOString(),
    };

    try {
        await dynamoDB.put({
            TableName: process.env.SONGS_TABLE_NAME,
            Item: item,
        }).promise();
    } catch(err) {
        console.error(err);
        throw new createError.InternalServerError(err);
    }

    return new Promise((resolve) => {
        resolve({
            statusCode: 201,
            body: JSON.stringify(item),
        });
    })
};

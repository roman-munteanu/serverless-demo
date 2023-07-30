import {Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {v4 as uuid} from 'uuid';
import {DynamoDB} from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const createHandler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    const {artist, title} = JSON.parse(event.body);
    const now = new Date();

    const songItem = {
        id: uuid(),
        artist,
        title,
        releaseDate: now.toISOString(),
    };

    try {
        await dynamoDB.put({
            TableName: process.env.SONGS_TABLE_NAME,
            Item: songItem,
        }).promise();
    } catch(err) {
        console.error(err);
    }

    const resp = {
        statusCode: 201,
        body: JSON.stringify(songItem),
    };

    return new Promise((resolve) => {
        resolve(resp);
    })
};

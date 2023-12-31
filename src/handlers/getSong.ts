import {Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {DynamoDB} from 'aws-sdk';
import createError from 'http-errors';

const dynamoDB = new DynamoDB.DocumentClient();

export async function getItemByID(id: string): Promise<any> {
    let item: any;

    try {
        const result = await dynamoDB.get({
            TableName: process.env.SONGS_TABLE_NAME,
            Key: { id }
        }).promise();

        item = result.Item;
    } catch(err) {
        console.error(err);
        throw new createError.InternalServerError(err);
    }

    if (!item) {
        throw new createError.NotFound(`Item with ID "${id}" not found`);
    }

    return item;
}

export const handler: Handler = async (event: APIGatewayProxyEvent): 
    Promise<APIGatewayProxyResult> => {

    const {id} = event.pathParameters;
    const item = await getItemByID(id);

    return new Promise((resolve) => {
        resolve({
            statusCode: 200,
            body: JSON.stringify(item),
        });
    })
};

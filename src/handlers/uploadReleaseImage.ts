import {Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getItemByID } from './getSong';
import { uploadImageToS3 } from '../service/uploadImageToS3';
import { Song } from '../model/songs';
import createError from 'http-errors';

export const handler: Handler = async (event: APIGatewayProxyEvent): 
    Promise<APIGatewayProxyResult> => {

    const {id} = event.pathParameters;
    const item: Song = await getItemByID(id);

    const bodyBase64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(bodyBase64, 'base64');

    let res: any;
    try {
        res = await uploadImageToS3(item.id + '.jpg', buffer);
    } catch(err) {
        console.error(err);
        throw new createError.InternalServerError(err);
    }

    return new Promise((resolve) => {
        resolve({
            statusCode: 201,
            body: JSON.stringify(res),
        });
    })
};

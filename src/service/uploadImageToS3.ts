import {S3} from 'aws-sdk';

const s3 = new S3();

export async function uploadImageToS3(key: string, body: Buffer): Promise<any> {
    const result = await s3.upload({
        Bucket: process.env.SONGS_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
    }).promise();

    return result;
}
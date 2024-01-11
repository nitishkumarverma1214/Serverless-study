import createHttpError from 'http-errors';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import { getAcutionById } from "./getAuction";
import { setPictureUrlToAuction } from '../lib/setAuctionPictureUrl';

const uploadAuctionPicture = async (event, context) => {
    const { id } = event.pathParameters;
    const auction = await getAcutionById(id);
    const sellerEmail = event.requestContext.authorizer[`${process.env.API_URL}/email`];
    // Auction status validation
    if (auction.status !== 'OPEN') {
        throw new createHttpError.Forbidden(`You can't upload picture on closed auction.`);
    }
    // seller identity validation
    if (auction.seller !== sellerEmail) {
        throw new createHttpError.Forbidden(`Only seller can upload picture to auction.`);
    }

    const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
    const isBase64 = (str) => base64RegExp.test(event.body);

     // base64 validation
     if (!isBase64) {
        throw new createHttpError.Forbidden(`The uploaded image is not base64`);
    }

    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    try {
        const key = auction.id + '.jpg';
        const uploadToS3Result = await uploadPictureToS3(key, buffer);
        console.log(uploadToS3Result);
        const pictureUrl = `https://${process.env.AUCTION_BUCKET_NAME}.s3.amazonaws.com/${key}`;
        console.log({ pictureUrl });
        const result = await setPictureUrlToAuction(auction.id, pictureUrl);

        return {
            statusCode: 200,
            body: JSON.stringify(
                { auction: result },
                null,
                2
            ),
        };
    } catch (error) {
        console.error({ 'uploadAuction error:': error });
        throw new createHttpError.InternalServerError(error);
    }
};

export const handler = middy(uploadAuctionPicture)
    .use(httpErrorHandler());
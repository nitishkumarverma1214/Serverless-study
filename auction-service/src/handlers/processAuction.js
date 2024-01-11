import createHttpError from "http-errors";
import { closeAuction } from "../lib/closeAuction";
import { getEndedAuctions } from "../lib/getEndedAuctions";

const processAuction = async () => {
    console.log('processing acutions');
    try {
        const expiredAuctions = await getEndedAuctions();
        console.log(expiredAuctions);

        const closedAuctions = expiredAuctions.map(auction => closeAuction(auction));
        await Promise.allSettled(closedAuctions);
        console.log(closedAuctions);
        return {closedAuctions: closedAuctions.length};
    } catch (error) {
        console.error('processAuction:', error);
        throw new createHttpError.InternalServerError(error);
    }
};

export const handler = processAuction;
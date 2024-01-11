import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';


export default (handler) => middy()
    .use([jsonBodyParser(), httpEventNormalizer(), httpErrorHandler()])
    .handler(handler);
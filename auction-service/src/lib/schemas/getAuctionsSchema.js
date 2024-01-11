const schema = {
    type: 'object',
    required: ['queryStringParameters'],
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['OPEN', 'CLOSE'],
                    default: 'OPEN'
                }
            }
        },

    }

};

export default schema;
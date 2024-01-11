import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

const createSendEmailCommand = (toAddress, fromAddress, body, subject) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        // Html: {
        //   Charset: "UTF-8",
        //   Data: "Hi, how are you, what are you doing?",
        // },
        Text: {
          Charset: "UTF-8",
          Data: body ?? "demo body",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject ?? "demo subject",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};


async function sendMail(event, context) {

  const {Records} = event;

  console.log({name: 'sendMail', Records});
  for (const record of Records){

    const email = JSON.parse(record.body);

   const { recipient, body, subject } = email;

   const sendEmailCommand = createSendEmailCommand(
    recipient,
    "sender@gmail.com", // fromAddr
    body,
    subject,
  );

  try {
    const client = new SESClient({region: 'us-east-1'});
    const result =  await client.send(sendEmailCommand);
    console.log(result);
  } catch (e) {
    console.error("Failed to send email.");
    return e;
  }

  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'All the mail send' }),
  };
}

export const handler = sendMail;



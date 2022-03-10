import mail from "@sendgrid/mail";
import twilio from "twilio";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

mail.setApiKey(process.env.SGAPI!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {

    const { phone, email } = req.body;
    const user = phone ? { phone } : email ? { email } : null;

    if (!user) return res.status(400).json({ ok: false });

    const payload = Math.floor(100000 + Math.random() * 900000) + "";

    /* const user = await client.user.upsert({
        where: {
            ...payload,
        },
        create: {
            name: "Anonymous",
            ...payload,
        },
        update: {}
    }) */

    const token = await client.token.create({
        data: {
            payload,
            user: {
                connectOrCreate: {
                    where: {
                        ...user,
                    },
                    create: {
                        name: "Anonymous",
                        ...user,
                    },
                },
            },
        }
    })

    if (phone) {
        // const message = await twilioClient.messages.create({
        //     messagingServiceSid: process.env.TWILIO_MSID,
        //     to: process.env.MYPHONE!, // 원래는 이 자리에 실제 유저가 입력하는 번호가 들어가야 하나 트라이얼모드의 트윌리오를 사용하고 있기 때문에 우선은 내 번호로만 한다. 만약 실제 유저가 입력하는 번호를 사용하려면 여기에 그 번호를 넣으면 되는데 국가번호로 잊지 말고 넣어줘야 한다.
        //     body: `Your LogIn Token Is ${payload}`,
        // });
        // console.log(message)
    } else if(email) {
        // const email = await mail.send({
        //     from: "blackpanther@wondermove.net",
        //     to: "blackpanther@wondermove.net",
        //     subject: "Your Carrot Market Verification Email",
        //     text: `Your LogIn Token Is ${payload}`,
        //     html: `<strong>Your LogIn Token Is ${payload}</strong>`,
        // })
        // console.log(email)
    }

    return res.json({
        ok: true,
    })
};

export default withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
});

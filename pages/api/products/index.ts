import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "GET") {
        const products = await client.product.findMany({
            include: {
                _count: {
                    select: {
                        fav: true
                    },
                },
            },
        })
        res.json({
            ok: true,
            products,
        })
    }
    if (req.method === "POST") {
        // const { name, price, description } = req.body;
        // const { user } = req.session;
        // 위 두줄을 아래와 같이 한번에 작성할 수 있다.

        console.log(req.body)
        console.log(req.session)

        const {
            body: { name, price, description, photoId },
            session: { user }
        } = req;
        const product = await client.product.create({
            data: {
                name,
                price: +price,
                description,
                image: photoId,
                user: {
                    connect: {
                        id: user?.id,
                    }
                }
            }
        })
        res.json({
            ok: true,
            product,
        })
    }
};

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler,
    })
);

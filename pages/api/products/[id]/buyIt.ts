import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { query: { id }, session: { user } } = req;

    // 쿼리로 상품의 id는 잘 받아올 수 있다.
    // 세션으로 로그인된 유저의 id 및 정보도 받아올 수 있다.

    // 구매하기 버튼을 눌렀을 때, 
    // 해당 상품을 판매자의 판매목록에 넣고,           -> 완료
    // 구매자의 구매목록에 넣자.                    -> 완료
    // 가능하다면 전체 상품목록에서 지우자.            -> 

    // console.log(user?.id) => 콘솔에29번으로 나온다, 참고하자.
    
    const bought = await client.purchase.create({
        data: {
            user: {
                connect: {
                    id: user?.id,
                }
            },
            product: {
                connect: {
                    id: +id.toString(),
                }
            },
        },
    })

    const itemSold = await client.product.findUnique({
        where: {
            id: +id.toString(),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
    
    const sellerId = itemSold?.user.id;
    
    const sold = await client.sale.create({
        data: {
            user: {
                connect: {
                    id: sellerId,
                }
            },
            product: {
                connect: {
                    id: +id.toString(),
                }
            },
        },
    });
    
    res.json({
        ok: true,
    });
};

export default withApiSession(
    withHandler({
        methods: ["POST"],
        handler,
    })
);

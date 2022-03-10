import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {

    const {
        session: { user },
        body: {
            name,
            price,
            description,
        }
    } = req;

    if (req.method === "POST") {


        const { result: {
            uid,
            rtmps: {
                url,
                streamKey
            },

        } } = await (
            await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${process.env.IMAGE_ACCID}/stream/live_inputs`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.STREAM_TOKEN}`,
                    },
                    body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`
                }
            )
        ).json();

        const stream = await client.stream.create({
            data: {
                cloudflareId: uid,
                cloudflareKey: streamKey,
                cloudflareUrl: url,
                name,
                price,
                description,
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
            },
        });
        res.json({
            ok: true,
            stream,
        });
    }

    if (req.method === "GET") {
        const streams = await client.stream.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                cloudflareId: true
            }
        })

        // const streams = await client.stream.findMany({
        //     take: 5, // 이곳은 페이지네이션 하는 곳, take: 5 이면 제일 처음부터 5개의 데이터를 뽑아냄, skip:5를 하면 제일 처음부터 5개의 데이터를 스킵하고 그 다음 5개의 데이터를 뽑아냄. db에 데이터가 많든 적든 우린 prisma를 사용하고 있고 그 prisma는 데이터를 읽을떄마다 돈이 부과되기 때문에 가능하면 페이지네이션을 통해 보여주고 싶은 데이터의 양을 정해서 보여주는게 좋다. 지금 일단 이곳에다 설명하는 이유는, 만약 프론트에서 페이지네이션을 하려면 어떤 페이지로 넘어갈지 정해주는 UI도 있어야 하고 그 숫자 버튼들을 눌렀을때 다른 페이지의 데이터들을 가져올 수 있도록 요청하는 코드도 짜야 하는데 우선 지금은 그런것 없이 설명만 하고 넘어가는거라 이렇게만 주석으로 남겨둔다. 기억해야 하는것은 prisma를 사용할때는 꼭 가능한 페이지네이션을 통해 db에 접근해서 데이터를 읽어내는 횟수를 조정해 돈이 너무 많이 부과되지 않도록 하고, 코드적으로 페이지네이션을 구현하려면, 프론트에서 어떤 페이지인지 알 수 있는 정보를 백으로 넘겨주고, 백에서는 그 페이지 * 보여주고 싶은 데이터의 수량을 skip에다가 적으면 된다. 예를 들어 1페이지이고 보여주고싶은 데이터의 수가 5개라면, 1*5를 하면 5가 되고 skip: 5를 하면 처음 5개의 데이터를 스킵하고 다음 5개의 데이터를 넘겨주게 되기 때문에 이런식으로 코드를 작성하면 된다. 페이지 2 라면 2*5를 skip에, 페이지 3라면 3*5를 skip에 이렇게 쭉쭉쭉쭉 데이터를 지정해서 넘겨주면 된다.
        // })

        res.json({
            ok: true,
            streams,
        });
    }
};

export default withApiSession(withHandler({
    methods: ["GET", "POST"],
    handler,
}));

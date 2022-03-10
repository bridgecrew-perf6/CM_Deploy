import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
    ok: boolean;
    [key: string]: any;
}

type method = "GET" | "POST" | "DELETE"

interface ConfigType {
    methods: method[],
    handler: (req: NextApiRequest, res: NextApiResponse) => void,
    isPrivate?: boolean
}

export default function withHandler({
    methods,
    isPrivate = true,
    handler,
}: ConfigType) {
    return async function (req: NextApiRequest, res: NextApiResponse): Promise<any> {
        if (req.method && !methods.includes(req.method as any)) {
            return res.status(405).end()
        };
        if (isPrivate && !req.session.user) {
            return res.status(401).json({ ok: false, error: "Please LogIn!" })
        };
        try {
            await handler(req, res);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        };
    };
};

// 위 함수를 자세히 보면 withHandler()라는 함수 안에 return async function() 함수가 있고 그 함수 내부에서 pages/api/users/enter.tsx에 있는 handler() 함수를 실행시켜주고 있다. 이렇게 함수 안에서 다른 함수를 실행시켜주는 이유는, 만약 handler() 함수를 바로 실행시키지 않고 그 전에 우리가 하고싶은 작업이나 먼저 해야하는 작업이 있다면, 그러한 작업들을 먼저 실행시키고 그 뒤 handler() 함수를 실행시켜주기 위해서이다.
// 위 코드를 예시로 들면, 우리는 handler() 함수를 바로 실행시키기 전에 먼저 req.method가 어떤건지 확인하고 그에 맞게 다음 작업을 해주고싶기 때문에 이러한 구조로 코드를 작성한 것이다.
// 그래서 위 조건을 보면 req.method가 인자로 전달된 method ("POST") 인지 먼저 확인하고, 아닐경우 상태코드 405를 리턴시켜주고,
// 만약 req.method가 인자로 전달된 method와 동일하다면 그 다음 작업인 fn() which is handler() 를 실행시켜주게 되는것이다.
// 머릿속에 왜 이렇게 코드를 짰는지 그 이유와, 함수 내부에서 실행시켜주는 함수가 어떤것들인지 잘 떠올릴 수 있다면, 위 코드들을 이해하기에 큰 어려움은 없을것이다.

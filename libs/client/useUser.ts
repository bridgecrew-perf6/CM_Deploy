import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ProfileResponse {
    ok: boolean;
    profile: User;
};


export default function useUser() {

    const { data, error } = useSWR<ProfileResponse>("/api/users/me");

    const router = useRouter();

    useEffect(() => {
        if (data && !data.ok) {
            router.replace("/enter");
        }
    }, [data, router]);

    return { user: data?.profile, isLoading: !data && !error };
};

// 위 15번 줄은 만약 유저가 로그인한 상태가 아니라면 로그인이나 회원가입 할 수 있도록 해당 페이지로 다시 보내주는 역할을 한다.
// 기억해야 할 점은 .push가 아닌 .replace를 하는 이유가 따로 있는데 그 이유는 아래와 같다.
// .push를 하게 되면 .replace를 하는것과 동일한 동작을 하게 된다. 그치만 차이점이 있다면 .push는 브라우저에서 기록을 남기고 .replace는 기록을 남기지 않는다는 것이다.
// 로그인하지 않은 유저가 캐럿마켓의 메인페이지로 들어갔을때, 로그인되지 않은 상태라면 바로 로그인/회원가입 페이지로 이동시켜주는데, 브라우저상에서 뒤로가기 버튼을 눌러 자세히 보면 .push를 했을땐 유저가 메인페이지로부터 로그인/회원가입 페이지로 넘어왔다는걸 알 수 있도록 기록이 남겨져있고, .replace를 했을때는 그러한 기록이 없다.
// 물론 둘 다 같은 동작을 하기 때문에 큰 차이는 없다고 하지만 어차피 뒤로가기를 해서 메인페이지로 간다 한들 다시 자동으로 로그인/회원가입 페이지로 이동하게 될것이기 때문에 기록을 남기고 이전 페이지로 돌아갈 수 있는 여지를 주는건 불필요한 일이다.
// 코드를 작성할때 최대한 불필요한 것들은 제거하고 필요한 코드들만 남기는것처럼, 기능 또한 마찬가지라고 볼 수 있다. 기능이 있을 필요가 없다면 그에 맞게 코드를 작성하는것이 더 좋다고 생각할 수 있겠다.

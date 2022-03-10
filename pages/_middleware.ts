import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    // console.log("It Works! Global Middleware Is Working Well!!");
    // console.log(req.ua);
    // console.log(req.cookies)

    if(req.ua?.isBot) {
        return new Response("Please Don't Be A Bot. Be Human!", {status: 403})
    };

    // if(!req.cookies.carrotsession) {
    //     return NextResponse.redirect("/enter");
    // };

    // if(!req.url.includes("/enter") && !req.cookies.carrotsession) {
    //     return NextResponse.redirect("/enter");
    // };

    if(!req.url.includes("/api")) {
        if(!req.url.includes("/enter") && !req.cookies.carrotsession) {
            // return NextResponse.redirect("/enter"); 
            // 위 주석처리한 이유는 배포시 정확한 url이 필요해서 아래와 같이 고침, 개발 과정에는 이렇게만 해도 작동됨.
            return NextResponse.redirect(new URL('/enter', req.url));
        };
    };

    // return NextResponse.json({ ok: true })

};

// 위에서 미들웨어 이름을 글로벌로 해준 이유는, 지금 만들어준 미들웨어의 위치가 Pages폴더의 Root(최상단)에 있기 때문이다.
// 즉 이 미들웨어는 캐럿마켓의 어떤 페이지를 가던 작동하게 되는것이다.
// 콘솔은 백쪽에서 찍힌다.

// 단순히 페이지 이동뿐만 아니라 api 요청을 보낼떄에도 미들웨어는 작동한다.

// 위 콘솔찍는 부분에 req.ua는 요청의 user agent를 뜻하고, 콜솔에는 여러가지 정보가 찍히는데,
// 유저가 사용하는 os정보, 브라우저 정보, 디바이스 정보, cpu정보, isBot정보 등등을 볼 수 있다.
// 그래서 만약 접속하는 유저가 내가 원하지 않는 브라우저로 접속했을때 다른 브라우저를 사용해달라고 안내를 할 수도 있고 ua를 활용하는 활용법은 많다.
// isBot은 Boolean값으로 나오는데 말 그대로 유저가 봇인지 아닌지 확인해주는 항목이다.

// ~~~~~~~~~~

// 위 쿠키를 확인하는 조건을 작성해봤는데 이렇게 하면 로그인되지 않은 유저가 캐럿마켓에 접속했을 시 자동으로 /enter 페이지로 가게 된다.
// 그렇다면 기존에 useUser()훅을 사용했던 방법과는 어떤게 다를까?
// 기존에 사용했던 훅을 사용하는 방식은 로그인 되지 않은 유저라 해도 우선 아주 짧게라도 홈페이지를 보여줬다가 /enter로 리다이렉트 되는 반면, 이곳 미들웨어에서 조건을 작성하게 되면 로그인되지 않은 유저는 홈페이지도, /enter페이지도 볼 수 없게 된다.
// 왜 그러냐? 미들웨어를 사용해서 조건을 만들어주면 미들웨어가 우리가 작성해놓은 useUser()훅보다 먼저 실행이 되기 때문에 작성해놓은 코드가 실행되지 않기 떄문이다.
// 좀 더 쉽게 설명하면 useUser()훅은 어쨌든 로그인되지 않은 유저라 하더라도 우선 코드가 실행되면서 유저가 코드 내부로 접근할 수 없도록 제한하는 반면, 미들웨어를 사용해서 조건을 만들어주면 우리가 작성한 코드가 실행되기도 전에 미들웨어가 작동을 해 코드 내부는 물론 코드 자체로도 접근이 제한된다. 그래서 로그인되지 않은 사용자가 접근하면 /enter로 리다이렉트 되긴 하지만 This page isn’t working (localhost redirected you too many times.) 이라는 문구와 함께 어떠한 페이지도 볼 수 없게 되는것이다.

// useUser()훅은 코드는 실행되지만 로그인되지 않은 유저를 코드 내부로 접근하는것을 제한함.
// 미들웨어는 로그인되지 않은 유저를 코드 내부 뿐만 아니라 코드 자체에게도 접근을 제한함.

// 위에서 설명한 This page isn’t working (localhost redirected you too many times.) 라는 문구가 나오는 이유는 말 그대로 같은 페이지로 너무 많이 리다이렉트 했기 때문이다. 원리를 생각해보면 유저가 로그인되지 않은채로 홈페이지에 접속하면 우리는 바로 /enter로 보내주게 되는데, 위 작성한 미들웨어는 어떠한 페이지를 가더라도 작동하는 미들웨어라 /enter페이지를 가더라도 실행이 된다. 그러면 유저는 홈페이지에서 /enter페이지로 왔을때도 미들웨어가 작동되어 쿠키를 가지고 있는지 확인하게 되고 없기때문에 계속 같은 /enter 페이지로 리다이렉트 되게 되는것이다. 그래서 에러 문구도 너무 많은 리다이렉트가 이뤄진다 라고 하면서 어떠한 화면도 볼 수 없게 되는것이다. 이러한 부분을 수정해주려면 if문 조건을 조금 변경해주면 된다. 

// req.url에는 유저가 어떠한 페이지로부터 오는지를 알 수 있기 때문에 그것을 이용해 만약 /enter가 아닌 페이지에서 오는거고 쿠키가 없다면 그럴때만 /enter 페이지로 리다이렉트 해준다 라고 조건을 수정해줄 수 가 있겠다. 그렇게 되면 /enter페이지가 정상적으로 잘 나올것이다.

// 그렇다면 이게 끝인가? 아니다. 위에서 설명했듯이 미들웨어는 단순히 페이지 이동을 할때만 작동하는게 아니라 api요청을 보낼떄에도 작동하기 떄문에 아직 한가지 조건을 더 작성해줘야 한다.
// 만약 유저가 /enter페이지로 와서 필요한 항목들을 다 작성하고 로그인하려고 한다면, 그때 api요청을 보내게 되는데 api요청을 보낼때에도 미들웨어는 작동을 하기때문에 유저가 로그인해서 쿠키를 받기도 전에 다시 /enter페이지로 리다이렉트 되게 된다. 그러면 유저는 평생 로그인할 수 없게 되기 때문에 조건을 다시 위 작성한대로 수정해주면 된다.

// req.url이 /api를 가지고 있지 않고(유저가 api요청으로부터 오지 않았고) req.url이 /enter 를 가지고 있지 않고(유저가 /enter 페이지로부터 오지 않았고) 유저가 쿠키를 가지고 있지 않다면 이라고 조건을 작성해주면 잘 작동할것이다.

// 한가지 팁: api요청시에만 미들웨어를 작동시키고 싶다면 /Pages/api 안에다가 미들웨어를 작성해주면 됨.
// 또 한가지 팁: console.log(req.geo)를 하면 유저의 위치정보도 알 수 있다. 로컬호스트에서는 작동하지 않지만 배포 후에는 확인이 가능하다. geo.city나 geo.country, geo.latitude, geo.longitude, geo.region 등등에 대한 정보를 알 수 있다.

// return NextResponse.json({ ok: true }) 를 위 미들웨어의 가장 마지막단에 작성해놓으면 응답을 작성한대로 보낼 수 있다.

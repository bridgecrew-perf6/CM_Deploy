import { FieldErrors, useForm } from "react-hook-form"

interface LoginForm {
    username: string;
    password: string;
    email: string;
}

export default function Forms() {

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<LoginForm>({
        mode: "onChange"
    }); // 이곳에서 mode를 설정해주는 이유는 만약 입력값을 입력하고 제출버튼을 누를때 조건이 맞는지 아닌지 알려주는게 아닌, 입력하는 즉시 안내를 하거나 혹은 그 외 기타 어떠한 동작을 했을때 안내를 주고 싶으면 mode를 이곳에서 설정해주는것이다.
    // 기본은 onSubmit으로 되어있어서 따로 설정하지 않으면 onSubmit으로 설정되는데 그렇게 되면 제출 버튼을 누를때 조건이 맞는지 여부를 안내하게 되어있고 만약 onChange로 mode를 바꿔주면 입력하는 즉시 바로 안내를 해주게 된다.
    // onBlur이면 입력을 다 하고 다른 입력칸으로 넘어가거나 입력칸 외 다른곳을 누르게 되서 넘어가게 되면 그때 안내를 해주게 된다.

    const onValid = (data: LoginForm) => {
        console.log("I am Valid!", data)
    }
    const onInvalid = (errors: FieldErrors) => {
        console.log("I am Not Valid!", errors)
    }

    // console.log(watch("email"))
    // setValue("username", "its me!!!!") 이렇게 해주면 유저네임 입력창에 값이 자동으로 "its me!!!!"가 된다. 이렇게 해주는게 바로 입력값들을 우리가 컨트롤 할 수 있게 해주는것이다.

    return (
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
            <input
                {...register("username", {
                    required: "Username is required!", // true 라고 써도 무방하나 메세지를 나타내고싶을땐 이렇게 한다. 아래 다른 태그들도 마찬가지이다.
                    minLength: {
                        message: "The Username should be longer than 5 chars.",
                        value: 5,
                    }, // 그냥 5 라고 적어도 무방하나 이 역시 마찬가지로 메세지를 나타내고 싶다면 이러한 방법으로 작성하면 된다.
                    
                })}
                type="text"
                placeholder="Username" />
            <input
                {...register("email", {
                    required: "Email is required!",
                    validate: {
                        notGmail: (value) => !value.includes("@gmail.com") ? "" : "Gmail is not allowed.",
                    }, // 위 부분은 삼항연산자로 하지 않고 그냥 !value.includes("@gmail.com") 로 해도 되지만 여기에도 역시 메세지를 나타내고 싶다면 삼항연산자를 사용해서 위와같이 작성해주면 된다.
                    // 만약 삼항연산자가 싫으면 그냥 !value.includes("@gmail.com") || "Gmail is not allowed." or를 사용해서 작성해도 된다.
                    // validate이라는 조건을 사용하는게 좋은 이유는 만약 조건을 걸때 단순시 입력값의 타입이나 길이 그런것들에 대해서만 해줄게 아니고 만약 api를 사용해 이미 등록된 입력값인지 아닌지 확인해보려고 한다면 이 validate을 사용할 수 있기 때문이다. 이 validate에는 우리가 원하는 조건들을 커스텀해서 작성해줄 수 있기 때문에 api를 활용해야 하는 조건이나 그렇지 않은 그냥 우리가 만들어주고 싶은 조건을 만들어줄때도 유용하게 활용할 수 있는것이다.

                })}
                type="email"
                placeholder="Email"
                className={`${Boolean(errors.email) ? "border-red-500" : ""}`}
                />
                {errors.email?.message}
            <input
                {...register("password", {
                    required: "Password is required!",
                })}
                type="password"
                placeholder="Password" />
            <input type="submit" value="Create Account" />
        </form>
    )

};

// 위 register를 input 태그에 넣어두면 자동으로 알아서 입력값을 얻어준다.
// 5번줄 register 옆에 watch를 넣고 콘솔에 watch를 찍어보면 입력값을 잘 얻어오는걸 볼 수 있다.
// 입력값을 잘 얻어왔으니 이제 각 항목에 맞는 입력값인지 확인을 해줘야 하는데, 그럴땐 handleSubmit을 사용하면 된다.
// handleSubmit을 form 태그에 넣으면 우리가 input값에 직접 설정해준 여러가지 조건들(required: true 같은것들)을 검사해서 맞는지 아닌지 확인해주는데,
// handleSubmit은 인자로 onValid 와 onInvalid 함수를 받기때문에 조건이 맞을땐 onValid, 맞지 않을땐 onInvalid 함수를 실행시킨다.
// 6번줄에 만들어준것처럼 콘솔을 찍어줄 함수를 따로 만들어주고, 그 함수를 handleSubmit(인자)의 인자로 넣어주면 그에 맞게 콘솔에 찍어주게 된다.
// 만약 여러가지 태그들 중 조건에 맞지 않게 입력된게 있으면 알아서 그쪽으로 가서 수정하라고 안내를 해준다.
// 예를들어 위 유저네임, 이메일, 비번 모두 required:true로 되어있어 3가지 모두 꼭 필수로 입력을 해야하는데,
// 만약 그 중 하나라도 비어있다면 Create Account를 눌렀을때 자동으로 비어있는 입력칸으로 보내서 입력할 수 있도록 도와준다.


// 위 51번줄에 테일윈드로 설정해준걸 보자. 만약 조건에 맞지 않는 입력값이 들어왔다면 입력창의 테두리를 빨간색으로 변경해줄수도 있다. 이런식으로 조건을 만들어주고, 그 조건에 따라 css를 꾸밀수도 있다는걸 기억하면 된다.

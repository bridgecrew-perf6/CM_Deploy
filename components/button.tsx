import { cls } from "@libs/client/utils";

interface ButtonProps {
  large?: boolean;
  text: string;
  clicked: boolean;
  [key: string]: any;
}

const buyIt = () => {
  console.log("Clicked!!")
}

export default function Button({ large = false, clicked, text, ...rest }: ButtonProps) {
  
  
  return (
    <button
      {...rest}
      className={cls(
        "w-full bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none",
        large ? "py-3 text-lg" : "py-2 text-sm "
      )}
      onClick={clicked ? () => buyIt() : () => null}
    >
      {text}
    </button>
  );
};

import { ProductWithCount } from "pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListProps {
    kind: "favs" | "sales" | "purchases"
};

interface Record {
    id: number;
    product: ProductWithCount;
};

interface ProductListResponce {
    [key: string]: Record[]
};

export default function ProductList({ kind }: ProductListProps) {
    const { data } = useSWR<ProductListResponce>(`/api/users/me/${kind}`);
    return data ?
        <>
            {data[kind]?.map((record) => (
                <Item
                    id={record.product.id}
                    key={record.id}
                    title={record.product.name}
                    price={record.product.price}
                    hearts={record.product._count.fav}
                    image={record.product.image}
                />
            ))}
        </>
        : null
};

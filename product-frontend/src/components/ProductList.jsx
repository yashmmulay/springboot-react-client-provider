import { useEffect, useState } from "react";

import { getProducts }

from "../services/productService";


function ProductList(){

    const [products,setProducts]

    = useState([]);


    useEffect(()=>{

        fetchProducts();

    },[]);


    const fetchProducts = async()=>{

        try{

            const response =

              await getProducts();

            setProducts(

              response.data

            );

        }

        catch(error){

            console.log(error);

        }

    };


    return(

        <div>

            <h1>

              Products

            </h1>

            <ul>

            {

              products.map(

                product=>(

                 <li key={product.id}>

                  {product.productName}

                 </li>

                )

              )

            }

            </ul>

        </div>
    );
}

export default ProductList;
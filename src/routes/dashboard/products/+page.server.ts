import { db } from "$lib/server/db";
import { products, productCategories } from "$lib/server/db/schema";
import { eq, sql } from "drizzle-orm";
import type { PageServerLoad } from "../$types";
import { transactionProducts } from "$lib/server/db/schema";




export const load: PageServerLoad = async({locals})=>{
     
    

    let productList = await db.select(
        {
            id: products.id,
            name: products.name,
            price: products.price,
            description: products.description,
            category: productCategories.name,
            commission: products.commissionAmount,
            quantity: products.quantity,
            supplier: products.supplier,
            saleCount: sql<number>`SUM(${transactionProducts.quantity })`,

        }
    ).from(products)
    .leftJoin(productCategories, eq(productCategories.id, products.categoryId))
    .leftJoin(transactionProducts, eq(products.id, transactionProducts.productId))
    .where(eq(products.branchId, locals?.user?.branch))
    .groupBy(
                products.id,
                products.name,
                products.price,
                products.description,
                productCategories.name,
                products.commissionAmount,
                products.quantity,
                products.supplier
            );
    productList =  productList.map(r => ({ ...r, price: Number(r.price), 
        commission: Number(r.commission), quantity: Number(r.quantity), saleCount: Number(r.saleCount) }));

    return{
         productList
    }
}
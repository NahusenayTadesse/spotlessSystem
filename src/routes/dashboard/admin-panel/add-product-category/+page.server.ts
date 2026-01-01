import {  setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { setFlash} from 'sveltekit-flash-message/server';

import { fail } from '@sveltejs/kit';

import { positionSchema as schema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {   productCategories } from '$lib/server/db/schema/';
import type { PageServerLoad, Actions } from './$types.js';



export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(schema));



  const allPositions = await db.select({
      value: productCategories.id,
      name: productCategories.name,
      description: productCategories.description
  }).from(productCategories);

  return {
    form,
    allPositions
  };
};


export const actions: Actions = {
  addCategory: async ({ request, cookies }) => {
    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {

    setFlash({ type: 'error', message: "Please check the form for Errors" }, cookies);

      return fail(400, {
        form
      });
    }


const { 
  name, 
  description,  
} = form.data;



    
    try{

    await db
        .insert(productCategories)
        .values({ name, description });

     
        setFlash({ type: 'success', message: `Product Category created successfully!` }, cookies);
          

     } catch(err: any){
     
            
    setFlash({ type: 'error', message: err.code === 'ER_DUP_ENTRY' ? 'Category Name is already taken. Please choose another one.': err.message }, cookies);
       
    if(err.code === 'ER_DUP_ENTRY')
           return setError(form, 'name', 'Category Name already exists.');
          

        return fail(400, {
        form
      });
    }
  },
} satisfies Actions
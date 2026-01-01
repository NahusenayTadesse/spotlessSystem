import {  setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { setFlash} from 'sveltekit-flash-message/server';

import { fail } from '@sveltejs/kit';

import { positionSchema as schema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {  positions } from '$lib/server/db/schema/';
import type { PageServerLoad, Actions } from './$types.js';



export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(schema));



  const allPositions = await db.select({
      value: positions.id,
      name: positions.name,
      description: positions.description
  }).from(positions);

  return {
    form,
    allPositions
  };
};


export const actions: Actions = {
  addPosition: async ({ request, cookies }) => {
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
        .insert(positions)
        .values({ name, description });

     
        setFlash({ type: 'success', message: `Staff Positions created successfully!` }, cookies);
          

     } catch(err: any){
     
            
    setFlash({ type: 'error', message: err.code === 'ER_DUP_ENTRY' ? 'Positions Name is already taken. Please choose another one.': err.message }, cookies);
       
    if(err.code === 'ER_DUP_ENTRY')
           return setError(form, 'name', 'Position Name already exists.');
          

        return fail(400, {
        form
      });
    }
  },
} satisfies Actions
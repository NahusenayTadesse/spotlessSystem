import {  setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { setFlash} from 'sveltekit-flash-message/server';

import { fail } from '@sveltejs/kit';

import { serviceCategorySchema as schema, serviceSchema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {  serviceCategories, services } from '$lib/server/db/schema/';
import type { PageServerLoad, Actions } from './$types.js';



export const load: PageServerLoad = async () => {
  try {
    const form = await superValidate(zod4(schema));

    const allCategories = await db
      .select({
        value: serviceCategories.id,
        name: serviceCategories.name,
        description: serviceCategories.description
      })
      .from(serviceCategories);

    const allServices = await db
      .select({
        value: services.id,
        name: services.name,
        description: services.description
      })
      .from(services);

    // Check for empty data
    if (!allCategories.length) {
      console.warn('No categories found in DB');
    }

    if (!allServices.length) {
      console.warn('No services found in DB');
    }

    return {
      form,
      allCategories,
      allServices
    };
  } catch (err) {
    console.error('Error in load function:', err);

    // You can either throw an HTTP error...
    // throw error(500, 'Failed to load data');

    // Or if you prefer the page to still load but with fallback data:
    
    return {
      form: await superValidate(zod4(schema)),
      allCategories: [],
      allServices: []
    };
    
  }
};

export const actions: Actions = {
  
addService: async ({ request, cookies }) => {
    const form = await superValidate(request, zod4(serviceSchema));

    if (!form.valid) {
      return fail(400, {
        form
      });
    }


        const { serviceName, category, description, durationMinutes, price } = form.data;

    
    try{
     await db.insert(services).values({serviceName, categoryId: category, description, durationMinutes, price, branchId: 1});

             setFlash({ type: 'success', message: `Service created successfully!` }, cookies);

    return {
      form
    } } catch(err: any){
     
            
    setFlash({ type: 'error', message: err.code === 'ER_DUP_ENTRY' ? 'Positions Name is already taken. Please choose another one.': err.message }, cookies);
       
    if(err.code === 'ER_DUP_ENTRY')
      return setError(form, 'name', 'Service Name already exists.');
        return fail(400, {
        form
      });
    }
  },




  addCategory: async ({ request, cookies, locals }) => {
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
        .insert(serviceCategories)
        .values({ name, description, createdBy: locals.user?.id, branchId: locals.user?.branch });

     
        setFlash({ type: 'success', message: `Service Category created successfully!` }, cookies);
          

     } catch(err: any){
     
            
    setFlash({ type: 'error', message: err.code === 'ER_DUP_ENTRY' ? 'Positions Name is already taken. Please choose another one.': err.message }, cookies);
       
    if(err.code === 'ER_DUP_ENTRY')
           return setError(form, 'name', 'Category Name already exists.');
          

        return fail(400, {
        form
      });
    }
  },
} satisfies Actions
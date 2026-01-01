import { zod4 } from 'sveltekit-superforms/adapters';
import { addCustomer} from '$lib/ZodSchema';

import type { PageServerLoad } from '../$types';
import { superValidate } from 'sveltekit-superforms';



export const load: PageServerLoad = async () => {
    

        const form = await superValidate(zod4(addCustomer));


        return {
            form
        }

}
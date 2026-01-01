 
 	import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
    import DataTableActions from './data-table-actions.svelte';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import { minutesToHoursString } from '$lib/global.svelte';
import Copy from '$lib/Copy.svelte';



  

 export const columns = [

    {
      accessorKey: 'index',
      header: '#',
      cell: info => info.row.index+1,
      sortable: false
    },

     
   
    { accessorKey: 'name',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Name',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
        cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableLinks, { id: row.original.id, name: row.original.name, link: '/dashboard/staff'});
    }},

      { accessorKey: 'category', header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Position',
        onclick: column.getToggleSortingHandler(), 
      }),  sortable: true },

   { accessorKey: 'phone', header: 'Phone', sortable: true,
        cell: ({ row }) => renderComponent(Copy, { data: row.original.phone })
     },
    
    

    { accessorKey: 'email',
      header: 'Email',  

    },

     { accessorKey: 'status',
     header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Status',
        onclick: column.getToggleSortingHandler(), 
      }),  sortable: true },
       

      { accessorKey: 'years', 
        
        header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Years of Service',
        onclick: column.getToggleSortingHandler(), 
      }),  sortable: true, filterVariant: 'range' },


  

       { accessorKey: 'actions', header: 'Actions', cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableActions, { id: row.original.id, name: row.original.name });
    } }
  ];
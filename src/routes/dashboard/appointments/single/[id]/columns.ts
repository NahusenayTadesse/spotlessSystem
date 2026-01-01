 
 	import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
    import DataTableActions from './data-table-actions.svelte';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';



  

 export const columns = [

    {
      accessorKey: 'index',
      header: '#',
      cell: info => info.row.index+1,
    },
     {
      accessorKey: 'amount',
       header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Amount',
        onclick: column.getToggleSortingHandler(), 
      }), 
      
      sortable: true
      
    },
   
     
     { accessorKey: 'recievedBy',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Recieved By',
        onclick: column.getToggleSortingHandler(), 
      }), 
      
    sortable: true, },
    { accessorKey: 'paidAt', header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Paid At',
        onclick: column.getToggleSortingHandler(), 
      }),  sortable: true },
    
    { accessorKey: 'recieptLink',
      header: 'Reciept',        
         sortable: true, 
        cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableLinks, { id: row.original.extraSettings, name: "View Reciept", link: `/dashboard/files/${row.original.recieptLink}`, target: "_blank"});
    }},

   

       { accessorKey: 'action', header: 'Actions', cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableActions, { id: row.original.extraSettings, booker: row.original.booker,
        recieptLink: row.original.recieptLink, customerName: row.original.customerName, date: row.original.appointmentDate});
    } }
  ];
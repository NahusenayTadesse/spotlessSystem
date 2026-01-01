 
 	import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
import Copy from '$lib/Copy.svelte';
    import DataTableActions from './data-table-actions.svelte';
    import Statuses from '$lib/components/Table/statuses.svelte';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';



  

 export const columns = [

    {
      accessorKey: 'index',
      header: '#',
      cell: info => info.row.index+1,
    },
   
    { accessorKey: 'customerName',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Name',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
        cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableLinks, { id: row.original.extraSettings, name: row.original.customerName, link: '/dashboard/appointments/single'});
    }},
    { accessorKey: 'phone', header: 'Phone', sortable: true,
        cell: ({ row }) => renderComponent(Copy, { data: row.original.phone })
     },
    {accessorKey: 'status', 
     header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Status',
        onclick: column.getToggleSortingHandler(), 
      }), 
     sortable: true,
        cell: ({ row }) => renderComponent(Statuses, { status: row.original.status })
    },

    { accessorKey: 'bookedBy',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Booked By',
        onclick: column.getToggleSortingHandler(), 
      }), 
      
      sortable: true, },
    { accessorKey: 'date',  header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Date',
        onclick: column.getToggleSortingHandler(), 
      }),  
      sortable: true },
    
    { accessorKey: 'time',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Time',
        onclick: column.getToggleSortingHandler(), 
      }),  
      sortable: true },
    { accessorKey: 'notes', header: 'Notes', sortable: true },
    { accessorKey: 'bookedAt', header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Booked At',
        onclick: column.getToggleSortingHandler(), 
      }),  sortable: true },
       { accessorKey: 'paidAmount', header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Fee Paid',
        onclick: column.getToggleSortingHandler(), 
      }),  sortable: true,
      cell: info => `${info.getValue()} ETB`,   // always “day”
 },
    

       { accessorKey: 'actions', header: 'Actions', cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableActions, { id: row.original.extraSettings, phone: row.original.phone, 
        bookedBy: row.original.bookedBy, bookedById: row.original.bookedById,  customerName: row.original.customerName, date: row.original.date});
    } }
  ];
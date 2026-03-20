 
    import { renderComponent } from '$lib/components/ui/data-table/index.js';

import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';




  

 export const soldProduct = [
  {
      accessorKey: 'index',
      header: '#',
      cell: info => info.row.index+1,
      sortable: false,
      
    },
 
     { accessorKey: 'name',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Product Name',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
         cell: ({ row }) => {
      return renderComponent(DataTableLinks, { id: row.original.productId, name: row.original.name, link: '/dashboard/products'});
    },

       },
       { accessorKey: 'price',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Price',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
       },

       { accessorKey: 'quantity',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Sold Quantity',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
       },
        { accessorKey: 'tip',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Tip',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
       },
       
     { accessorKey: 'soldBy', header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Seller',
        onclick: column.getToggleSortingHandler(), 
      }),  sortable: true,
      cell: ({ row }) => {
      return renderComponent(DataTableLinks, { id: row.original.id, name: row.original.soldBy, link: '/dashboard/staff'});
    }
},
       
      {
        // Corresponds to staffId from the query
        accessorKey: 'total', 
        header: 'Total',
        sortable: true,
    },
 

]; 


export const soldServices = [
  {
      accessorKey: 'index',
      header: '#',
      cell: info => info.row.index+1,
      sortable: false
    },
 
   { accessorKey: 'name',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Service Name',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
         cell: ({ row }) => {
      return renderComponent(DataTableLinks, { id: row.original.serviceId, name: row.original.name, link: '/dashboard/services'});
    },
},
       { accessorKey: 'price',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Price',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
       },

        { accessorKey: 'tip',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Tip',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
       },
       
     { accessorKey: 'doneBy', header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Service Provider',
        onclick: column.getToggleSortingHandler(), 
      }),  sortable: true,
      cell: ({ row }) => {
      return renderComponent(DataTableLinks, { id: row.original.id, name: row.original.doneBy, link: '/dashboard/staff'});
    }
},
       
      {
        // Corresponds to staffId from the query
        accessorKey: 'total', 
        header: 'Total',
        sortable: true,
    },
 

]; 

export const boughtSupplies = [
  {
      accessorKey: 'index',
      header: '#',
      cell: info => info.row.index+1,
      sortable: false
    },
 
     { accessorKey: 'name',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Service Name',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
          cell: ({ row }) => {
      return renderComponent(DataTableLinks, { id: row.original.id, name: row.original.serviceId, link: '/dashboard/services'});
       },
    },

       { accessorKey: 'price',
      header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Price',
        onclick: column.getToggleSortingHandler(), 
      }),        
         sortable: true, 
       },

       
     { accessorKey: 'reciever', header: ({ column }) =>
      renderComponent(DataTableSort, {
        name: 'Service Provider',
        onclick: column.getToggleSortingHandler(), 
      }),  sortable: true,
      cell: ({ row }) => {
      return renderComponent(DataTableLinks, { id: row.original.id, name: row.original.receiver, link: '/dashboard/users'});
    }
},
       
      {
        // Corresponds to staffId from the query
        accessorKey: 'total', 
        header: 'Total',
        sortable: true,
    },
 

];


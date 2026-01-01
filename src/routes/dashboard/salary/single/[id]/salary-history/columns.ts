import { renderComponent } from '$lib/components/ui/data-table/index.js';
// Assuming a new actions component
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
// NOTE: You must ensure your backend query includes 'name' and 'position' 
// from the staff table to display them here!
// e.g., staffName: staff.name, staffPosition: staff.category

export const columns = [

    // 1. Row Index
    {
        accessorKey: 'index',
        header: '#',
        cell: info => info.row.index + 1,
        sortable: false
    },    
    // --- Payroll Specific Fields ---
      {
        accessorKey: 'amount',
        header: ({ column }) =>
            renderComponent(DataTableSort, {
                name: 'Salary',
                onclick: column.getToggleSortingHandler(),
            }),
        sortable: true,
        cell: info => {
            const amount = info.getValue();
            return `ETB ` + amount;
        }
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
        // Show 'N/A' if the payroll entry is null
        cell: info => info.getValue() || 'Salary Not Entered',
        sortable: false, // Usually not sortable
    },

     {
        accessorKey: 'endDate',
        header: 'Start Date',
        // Show 'N/A' if the payroll entry is null
        cell: info => info.getValue() || 'Current Salary',
        sortable: false, // Usually not sortable
    },
   
];
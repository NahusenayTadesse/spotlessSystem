
<script lang="ts">

    import Copy from "$lib/Copy.svelte";
    import {LoaderCircle} from "@lucide/svelte"
	import Statuses from "./Table/statuses.svelte";
    // import JSPDF from "$lib/JSPDF.svelte"

     type SingleTable= { name: string; value: string}

    let { singleTable }: {singleTable: SingleTable} = $props();
</script>
<!-- 
 <div class="fixed right-2 top-24">
    <JSPDF {fileName} tableId="#table" {buttonName} />

</div> -->

{#await singleTable}
           <h1 class="flex flex-row m-2">     Loading  <LoaderCircle class="animate-spin" /></h1>

        
      {:then table} 

<table id="table" class="lg:w-full  table-auto text-left">
        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">
          <tr>
            <th class="py-3 px-4">Detail</th>
            <th class="py-3 px-4">Value</th>
          </tr>
        </thead>
        <tbody class="text-gray-900 dark:text-gray-100">
            {#each singleTable as value}
          <tr>
            <td class="py-3 px-4 font-semibold">{value.name}</td>
            <td class="py-3 px-4 capitalize">
                {#if value.name === 'Phone'} 
                <Copy data={value.value} /> 
                {:else if value.name === 'Status'}
               <Statuses status={value.value} />
                {:else} 
                 
                 {value.value}
                {/if}</td>
          </tr>
             {/each}
          
        </tbody>
      </table>
      {/await}
  
  <script lang='ts'>
    import { columns } from "./columns";
  

  let { data } = $props();

  import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from "$lib/components/Loading.svelte";
	import { Frown, Plus } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";

  
   
   
</script>

<svelte:head>
        <title> Services List</title>
</svelte:head>
  

 {#await data}
  
  <Loading  name="Customers"/>
 {:then customerList} 

  {#if data.serviceList.length === 0}
   <div class="w-5xl h-96 flex flex-col justify-center items-center">
   <p class="text-center flex flex-row gap-4 mt-4 text-4xl justify-self-cente"><Frown class="animate-bounce w-16  h-12" />
     No services added yet </p>
     <Button href="/dashboard/services/add-services"><Plus />Add New Services</Button>

     </div>
 {:else}
     <h2 class="text-2xl my-4">No of Services {data.serviceList?.length} </h2>

 <div class="lg:w-[90%] w-[350px] lg:p-0 p-2 mt-8 mb-4 pt-4">

   <DataTable data={data.serviceList} {columns} filterBlacklist={['id','name', 'description']} />
 </div>
 {/if}
  {:catch}

    <div class="w-screen h-screen flex flex-col justify-center items-center"> 
         <h1 class="text-red-500">Unexpected Error: Reload</h1>
    </div>
  {/await}

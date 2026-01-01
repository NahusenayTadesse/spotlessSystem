<script lang="ts">
 

let { id, name, link, target = "" }: { id: string; name: string; link: string; target?: string } = $props();
</script>

<a href="{link}/{id}" target={target} class="hover:scale-110 capitalize transition-all duration-600 ease-in-out flex flex-row !justify-start"> 
 {name}
</a>


 
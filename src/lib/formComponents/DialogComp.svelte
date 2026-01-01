<script lang="ts">
 import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
 let { title, content} = $props();
</script>
 
<Dialog.Root >
 <Dialog.Trigger class="w-auto px-4"
  ><Button>{title}</Button></Dialog.Trigger
 >
 <Dialog.Content class="w-full">
  <Dialog.Header>
   <Dialog.Title>{title}</Dialog.Title>
  </Dialog.Header>
  <ScrollArea class="h-auto rounded-md border p-2">
  {@render content()}
  </ScrollArea>
 </Dialog.Content>
</Dialog.Root>

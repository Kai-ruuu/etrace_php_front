<script>
    let { status, ...props } = $props();
</script>

<div class="col-span-1" {...props}>
    {#if status === "Pending"}
        <p class="w-fit px-2 rounded border border-yellow-500 text-yellow-500">Pending</p>
    {:else if status === "Approved"}
        <p class="w-fit px-2 rounded border border-green-500 text-green-500">Approved</p>
    {:else if status === "For Revision"}
        <p class="w-fit px-2 rounded border border-purple-500 text-purple-500">For Revision</p>
    {/if}
</div>
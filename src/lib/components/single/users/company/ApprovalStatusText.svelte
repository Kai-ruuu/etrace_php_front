<script>
    let { status } = $props();
</script>

{#if status === "Pending"}
    <span class="text-yellow-500">{status}</span>
{:else if status === "Approved"}
    <span class="text-green-500">{status}</span>
{:else}
    <span class="text-purple-500">{status}</span>
{/if}
<script>
	import { Eye, EyeClosed } from "lucide-svelte";

    let {
        type = "text",
        required = true,
        placeholder = "",
        Icon = null,
        value = $bindable("")
    } = $props();

    let shown = $state(false);
</script>

<div class="relative flex items-center items-stretch border border-gray-300 rounded-lg overflow-clip">
    {#if Icon}
        <div class="border-r border-r-gray-300 min-w-12 flex items-center justify-center">
            <Icon class="w-5"/>
        </div>
    {/if}
    <input
        type={shown ? "text" : "password"}
        bind:value={value}
        {required}
        {placeholder}
        class="grow px-6 py-3 border-none"
    >
    {#if !shown}
        <button
            onclick={() => shown = true}
            class="absolute top-1/2 right-6 -translate-y-1/2 cursor-pointer"
        >
            <EyeClosed class="w-5"/>
        </button>
    {:else}
        <button
            onclick={() => shown = false}
            class="absolute top-1/2 right-6 -translate-y-1/2 cursor-pointer"
        >
            <Eye class="w-5"/>
        </button>
    {/if}
</div>
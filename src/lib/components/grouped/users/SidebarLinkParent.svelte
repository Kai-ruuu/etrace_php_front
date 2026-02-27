<script>
	import { sidebarOpen } from "$lib/app/stores/sidebar";
	import { ChevronDown, ChevronRight } from "lucide-svelte";

    let {
        label,
        Icon,
        children
    } = $props();
    let collapsed = $state(true);
</script>

<div>
    <div class={["flex items-center py-3", $sidebarOpen ? "px-6 justify-between" : "justify-center"]}>
        <div class={["flex items-center gap-x-4", !$sidebarOpen && "justify-center"]}>
            <Icon class={`min-w-5 ${!$sidebarOpen && "text-gray-700/25"}`}/>
            {#if $sidebarOpen}
                <span>{label}</span>
            {/if}
        </div>
        {#if $sidebarOpen}
            <button
                onclick={() => collapsed = !collapsed}
                class="cursor-pointer"
            >
                {#if collapsed}
                    <ChevronDown class="min-w-5"/>
                {:else}
                    <ChevronRight class="min-w-5"/>
                {/if}
            </button>
        {/if}
    </div>
    {#if collapsed}
        <div class={[$sidebarOpen && "pl-4"]}>
            {@render children()}
        </div>
    {/if}
</div>
<script>
	import { goto } from "$app/navigation";
	import { useWidth } from "$lib/app/hooks/useWidth.svelte";
	import { sidebarOpen } from "$lib/app/stores/sidebar";

    let {
        Icon,
        label,
        path,
    } = $props();

    let device = useWidth();
</script>

<button
    onclick={() => {
        if (device.isMobile) {
            sidebarOpen.set(false);
        }
        
        goto(path)
    }}
    title={label}
    class={["w-full cursor-pointer flex items-center py-3", $sidebarOpen ? "gap-x-4 px-6" : "justify-center"]}
>
    <Icon class="min-w-5"/>
    {#if $sidebarOpen}
        <span>{label}</span>
    {/if}
</button>
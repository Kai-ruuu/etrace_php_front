<script>
	import { sidebarOpen } from "$lib/app/stores/sidebar";

    let {
        Icon,
        label,
        path,
    } = $props();
</script>

<a
    href={path}
    title={label}
    class={["cursor-pointer flex items-center py-3", $sidebarOpen ? "gap-x-4 px-6" : "justify-center"]}
>
    <Icon class="min-w-5"/>
    {#if $sidebarOpen}
        <span>{label}</span>
    {/if}
</a>
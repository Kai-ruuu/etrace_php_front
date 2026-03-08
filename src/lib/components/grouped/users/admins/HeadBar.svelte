<script>
	import { sidebarOpen } from "$lib/app/stores/sidebar";
	import Button from "$lib/components/single/global/Button.svelte";
	import { Menu } from "lucide-svelte";

    let {
        title = "",
        BtnIcon = null,
        btnLabel = "",
        onBtnClick = null,
        children
    } = $props();
</script>

<div class="min-h-16 border-b border-b-gray-200 flex items-center justify-between px-6 bg-white">
    <div class="flex items-center gap-x-6">
        <button
            onclick={() => sidebarOpen.set(!$sidebarOpen)}
            class="cursor-pointer"
        >
            <Menu class="w-5"/>
        </button>
        <h1 class="text-lg">{title}</h1>
    </div>
    {#if children}
        {@render children()}
    {/if}
    {#if btnLabel && onBtnClick}
        <Button Icon={BtnIcon} label={btnLabel} onclick={onBtnClick} size="s" class="bg-green-500"/>
    {/if}
</div>
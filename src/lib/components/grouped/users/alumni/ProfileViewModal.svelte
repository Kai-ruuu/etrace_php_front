<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import { X } from "lucide-svelte";

    let {
        onExit
    } = $props();
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 md:w-1/2 min-h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)]">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">My Profile</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
    </div>
</div>
<script>
	import { X } from "lucide-svelte";
	import Button from "../../global/Button.svelte";
	import { API_BASE_URL } from "$lib/app/core/constants";

    let {
        display,
        fileSource,
        fileName,
        onExit
    } = $props()
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 md:w-2/3">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">{display} - {fileName}</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        <iframe
            title={fileName}
            src={API_BASE_URL + `/uploads/company/${fileSource}/${fileName}`}
            frameborder="0"
            class="min-h-142 w-full"
        ></iframe>
    </div>
</div>
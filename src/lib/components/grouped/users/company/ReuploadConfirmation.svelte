<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { Check, X } from "lucide-svelte";
	import { onMount } from "svelte";

    let {
        display,
        fileUrl,
        onConfirm,
        onCancel
    } = $props();
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 md:w-3/4">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">Confirmation</h1>
        </div>
        <span>Are you sure you wanted to reupload a new {display}?</span>
        <iframe
            title="Uploaded File Preview"
            src={fileUrl}
            frameborder="0"
            class="min-h-116 w-full"
        ></iframe>
        <div class="grid grid-cols-2 gap-x-3">
            <Button
                Icon={X}
                label="Cancel"
                onclick={onCancel}
                class="bg-red-500 p-3"
            />
            <Button
                Icon={Check}
                label="Confirm"
                onclick={onConfirm}
                class="bg-green-500"
            />
        </div>
    </div>
</div>
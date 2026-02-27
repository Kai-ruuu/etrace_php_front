<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import TextField from "$lib/components/single/global/TextField.svelte";
	import { Check, X } from "lucide-svelte";

    let {
        confirmText,
        onConfirm,
        onCancel
    } = $props();
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 mt-8 md:w-1/4">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">Confirmation</h1>
        </div>
        <span>{confirmText}</span>
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
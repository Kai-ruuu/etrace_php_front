<script>
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import { Share, X } from "lucide-svelte";

    let {
        onCancel,
        onConfirm,
        openUntil = $bindable(null)
    } = $props();

    async function validateDateAndConfirm() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(openUntil);

        if (selectedDate < today) {
            await Toast.fire({
                title: "Date is in the past.",
                icon: "error"
            });
            return;
        }

        await onConfirm();
    }
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex items-center justify-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white p-6 space-y-4 md:w-1/4">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-lg">Repost Job</h1>
            <Button Icon={X} size="s" onclick={onCancel} class="bg-transparent text-gray-700"/>
        </div>
        <div class="w-full space-y-1">
            <p class="text-sm text-gray-500">Open Until</p>
            <input
                type="date"
                bind:value={openUntil}
                class="border border-gray-300 rounded-lg px-6 py-3 w-full"
            >
        </div>
        <Button
            Icon={Share}
            label="Repost"
            onclick={validateDateAndConfirm}
            class="bg-green-500 w-full"
        />
    </div>
</div>
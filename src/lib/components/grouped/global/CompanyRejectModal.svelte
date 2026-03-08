<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import { X } from "lucide-svelte";

    let {
        company,
        onConfirmReject,
        onCancelReject,
        forReq = false,
        reqName = null
    } = $props();

    let rejectionMessage = $state({
        value: "",
        errors: []
    });
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 mt-8 md:w-1/3">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">{
                forReq
                    ? "Requirement Revision"
                    : "Company Rejection"
            }</h1>
            <Button Icon={X} size="s" onclick={onCancelReject} class="bg-transparent text-gray-700"/>
        </div>

        <div class="flex flex-col items-stretch gap-y-1">
            <span>{
                forReq
                    ? `Please provide the reason for revision of the company's ${reqName}.`
                    : "Please provide the reason for rejecting the company."
            }</span>
            <textarea
                bind:value={rejectionMessage.value}
                class="border border-gray-300 rounded-lg p-2"
            ></textarea>
            {#if rejectionMessage.errors.length > 0}
                {#each rejectionMessage.errors as error}
                    <p class="text-sm text-red-500">{error}</p>
                {/each}
            {/if}
            <span></span>
        </div>

        <Button
            label={forReq ? "Confirm" : "Reject"}
            onclick={async () => {
                if (rejectionMessage.value.trim().length === 0) {
                    const errEmpty = "Reason is required."
                    
                    if (!rejectionMessage.errors.includes(errEmpty)) {
                        rejectionMessage.errors.push(errEmpty);
                    }

                    return
                } else {
                    rejectionMessage.errors = [];
                }
                
                await onConfirmReject(rejectionMessage.value);
            }}
            class="bg-red-500"
        />
    </div>
</div>
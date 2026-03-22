<script>
	import { CompanyService } from "$lib/app/services/users/company";
	import { Toast } from "$lib/app/utils/swal";
	import Button from "$lib/components/single/global/Button.svelte";
	import Revision from "$lib/components/single/users/company/Revision.svelte";
	import { X } from "lucide-svelte";
	import { onMount } from "svelte";

    let {
        details,
        onExit,
        forPstaff = false,
        company = null
    } = $props();

    let message = $state("");
    let revisions = $state([]);

    async function fetchNotes() {
        await CompanyService.getRevisionAppeals(
            details,
            async (data, status) => {
                revisions = data;
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Failed to get requests.",
                    icon: "error"
                });
            },
        )
    }

    async function onWriteAppeal(revisionId) {
        await CompanyService.writeRevisionAppeal(
            { message, revision_id: revisionId },
            async (data, status) => {
                await fetchNotes();
                await Toast.fire({
                    title: data?.message ?? "Appeal has been sent.",
                    icon: "success"
                });
            },
            async (data, status) => {
                await Toast.fire({
                    title: data?.message ?? "Unable to send the appeal.",
                    icon: "error"
                });
            },
        )
    }

    onMount(fetchNotes);
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 min-h-8/10 md:w-1/2">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">Revision Requests for {details.display}</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        {#if !forPstaff}
            <p class="mb-2 p-0">Remember to write an appeal if needed or revise and reupload the requirement.</p>
        {/if}
        <div class="space-y-4">
            {#each revisions as revision}
                <Revision
                    {revision}
                    {forPstaff}
                    {company}
                    bind:message={message}
                    onAppealSend={onWriteAppeal}
                />
            {/each}
        </div>
    </div>
</div>
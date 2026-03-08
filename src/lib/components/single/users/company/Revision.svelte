<script>
	import { ChevronDown, ChevronRight, Send } from "lucide-svelte";
	import Button from "../../global/Button.svelte";

    let {
        message = $bindable(""),
        revision,
        onAppealSend,
        forPstaff = false,
        company = null
    } = $props();

    let collapsed = $state(false);
</script>

<div class="border border-gray-200 rounded-lg bg-white space-y-2 overflow-clip p-6">
    <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">Request from {new Date(revision.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        })}</span>
        <button
            title="See more"
            onclick={() => collapsed = !collapsed}
            class="cursor-pointer"
        >
            {#if collapsed}
                <ChevronDown class="w-5"/>
            {:else}
                <ChevronRight class="w-5"/>
            {/if}
        </button>
    </div>
    <p class="mt-3">{revision.message}</p>

    {#if collapsed}
        {#if revision.appeal !== null}
            <hr class="border-t border-gray-200 mt-6 mb-4">
            {#if !forPstaff && company === null}
                <p class="text-sm text-gray-500 mb-2">Your appeal from {new Date(revision.appeal.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                })}</p>
            {:else}
                <p class="text-sm text-gray-500 mb-2">{company.profile.name} - {new Date(revision.appeal.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                })}</p>
            {/if}
            <p>{revision.appeal.message}</p>
        {:else}
            {#if !forPstaff && company === null}
                <hr class="border-t border-gray-200 mt-6 mb-4">
                <div class="flex flex-col items-stretch gap-y-2">
                    <span class="text-sm">Write an appeal:</span>
                    <textarea
                        placeholder="Write your appeal here..."
                        bind:value={message} class="border border-gray-200 rounded-lg p-2"
                    ></textarea>
                    <div class="flex items-center justify-end">
                        <Button
                            Icon={Send}
                            label="Send"
                            size="s"
                            onclick={async () => await onAppealSend(revision.id)}
                        />
                    </div>
                </div>
            {:else}
                <p class="text-sm text-gray-500">{company.profile.name} has no appeals yet.</p>
            {/if}
        {/if}
    {/if}
</div>
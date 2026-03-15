<script>
	import { ChevronDown, ChevronRight, Send } from "lucide-svelte";
	import Button from "../../global/Button.svelte";

    let {
        message = $bindable(""),
        rejection,
        onAppealSend
    } = $props();

    let collapsed = $state(false);
</script>

<div class="border border-gray-200 rounded-lg bg-white space-y-2 overflow-clip p-6">
    <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">Dean's rejection from {new Date(rejection.created_at).toLocaleDateString("en-US", {
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
    <p class="mt-3">{rejection.message}</p>

    {#if collapsed}
        {#if rejection.appeal !== null}
            <hr class="border-t border-gray-200 mt-6 mb-4">
            <p class="text-sm text-gray-500 mb-2">Your appeal from {new Date(rejection.appeal.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            })}</p>
            <p>{rejection.appeal.message}</p>
        {:else}
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
                        onclick={async () => await onAppealSend(rejection.id)}
                    />
                </div>
            </div>
        {/if}
    {/if}
</div>
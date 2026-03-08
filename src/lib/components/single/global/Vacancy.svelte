<script>
	import { onMount } from "svelte";
	import Button from "./Button.svelte";
	import { Briefcase, CheckCircle, ChevronDown, ChevronRight } from "lucide-svelte";

    const { vacancy } = $props();

    let collapsed = $state(false);
</script>

<div class="w-full space-y-1 py-1">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-2">
            <Briefcase class="w-4"/>
            <h1>{vacancy.job_title}</h1>
        </div>
        <div class="flex items-center gap-x-2">
            <span>{vacancy.slots} {vacancy.slots > 1 ? "slots" : "slot"}</span>
            <Button
                title={"View Qualifications"}
                Icon={collapsed ? ChevronDown : ChevronRight}
                size="s"
                onclick={() => collapsed = !collapsed}
                class="bg-transparent text-black-700"
            />
        </div>
    </div>
    {#if collapsed}
        {#each vacancy.qualifications as q}
            <div class="flex items-center gap-x-2 pl-4">
                <CheckCircle class="w-4"/>
                <p>{q}</p>
            </div>
        {/each}
    {/if}
</div>
<script>
	import { user } from "$lib/app/stores/user";
	import { onMount } from "svelte";

    let { sourceRole, children } = $props();
    let status = $state(null);
    
    onMount(() => status = sourceRole === "sysad" ? $user.profile.ver_stat_sysad : $user.profile.ver_stat_pstaff);
</script>

<div class="w-full">
    <div class="w-full flex items-center justify-between mb-1">
        <div class="flex items-center gap-x-2">
            <h1>Status:</h1>
            {#if status === "Pending"}
                <span class="px-3 py-1 rounded bg-orange-500 text-white">{status}</span>
            {:else if status === "Verified"}
                <span class="px-3 py-1 rounded bg-blue-500 text-white">{status}</span>
            {:else}
                <span class="px-3 py-1 rounded bg-red-500 text-white">{status}</span>
            {/if}
        </div>
        {#if children}
            {@render children()}
        {/if}
    </div>
    {#if status === "Pending"}
        <span>Please wait while the {sourceRole === "sysad" ? "System Administrator" : "PESO Staff"} is reviewing your company.</span>
    {:else if status === "Verified"}
        <span>Your company is now verified by the {sourceRole === "sysad" ? "System Administrator" : "PESO Staff"}.</span>
    {:else}
        <span>Remember to write an appeal then comply if your status has been marked as pending.</span>
    {/if}
</div>
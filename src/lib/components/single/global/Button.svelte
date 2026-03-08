<script>
	import { twMerge } from "tailwind-merge";

    let {
        label = "",
        Icon = null,
        iconPos = "l",
        size = "m",
        class: className = "",
        children,
        onclick,
        ...props
    } = $props();
</script>

{#if size === "m"}
    <button
        {onclick}
        {...props}
        class={twMerge("px-6 py-3 bg-red-800 text-white rounded-lg cursor-pointer flex items-center justify-center", className)}>
        <div class="flex items-center gap-x-2">
            {#if Icon && iconPos === "l"}
                <Icon class="min-w-5 max-w-5"/>
            {/if}
            {#if label}
                <span class={Icon && (iconPos === "l" ? "pr-2" : "pl-2")}>{label}</span>
            {/if}
            {#if Icon && iconPos === "r"}
                <Icon class="min-w-5 max-w-5"/>
            {/if}
        </div>
    </button>
{:else if size == "s"}
    <button
        {onclick}
        {...props}
        class={twMerge("px-3 py-1 bg-red-800 text-white text-sm rounded-lg cursor-pointer flex items-center justify-center", className)}
    >
        <div class="flex items-center gap-x-2">
            {#if Icon && iconPos === "l"}
                <Icon class="min-w-4 max-w-4"/>
            {/if}
            {#if label}
                <span class={Icon && (iconPos === "l" ? "pr-2" : "pl-2")}>{label}</span>
            {/if}
            {#if Icon && iconPos === "r"}
                <Icon class="min-w-4 max-w-4"/>
            {/if}
        </div>
    </button>
{/if}
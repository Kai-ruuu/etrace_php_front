<script>
	import { X } from "lucide-svelte";
	import { twMerge } from "tailwind-merge";

    let {
        required = true,
        placeholder = "",
        Icon = null,
        value = $bindable(""),
        btnLabel = null,
        BtnIcon = null,
        btnOnclick = null,
        allowClear = false,
        onClear = null,
        class: className = "",
        onDebounce = null,
        debounceInterval = 300,
        list = ""
    } = $props();

    let timeout;
</script>

<div class={twMerge("flex items-center items-stretch border border-gray-300 rounded-lg overflow-clip", className)}>
    {#if Icon}
        <div class="border-r border-r-gray-300 min-w-12 flex items-center justify-center bg-white">
            <Icon class="w-5"/>
        </div>
    {/if}
    <div class="grow flex items-center relative">
        <input
            {list}
            type="text"
            bind:value={value}
            {required}
            {placeholder}
            class="grow px-6 py-3 border-none"
            oninput={(e) => {
                if (onDebounce) {
                    clearTimeout(timeout);
                    
                    timeout = setTimeout(() => {
                        onDebounce(e.target.value);
                    }, debounceInterval);
                }
            }}
        >
        {#if allowClear && onClear && value.length > 0}
            <button onclick={onClear} class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer">
                <X class="w-5"/>
            </button>
        {/if}
    </div>
    {#if btnOnclick && BtnIcon}
        <button
            onclick={btnOnclick}
            class="border-l border-l-gray-300 flex items-center gap-x-2 px-4 cursor-pointer"
        >
            <BtnIcon class="w-5"/>
            {#if btnLabel}
                <span>{btnLabel}</span>
            {/if}
        </button>
    {/if}
</div>
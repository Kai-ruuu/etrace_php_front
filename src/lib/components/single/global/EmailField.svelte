<script>
    let {
        required = true,
        placeholder = "",
        Icon = null,
        value = $bindable(""),
        onDebounce = null,
        debounceInterval = 300
    } = $props();

    let timeout;
</script>

<div class="relative flex items-center items-stretch border border-gray-300 rounded-lg overflow-clip">
    {#if Icon}
        <div class="border-r border-r-gray-300 min-w-12 flex items-center justify-center bg-white">
            <Icon class="w-5"/>
        </div>
    {/if}
    <input
        type="email"
        bind:value={value}
        {required}
        {placeholder}
        oninput={(e) => {
            if (onDebounce) {
                clearTimeout(timeout);
                
                timeout = setTimeout(() => {
                    onDebounce(e.target.value);
                }, debounceInterval);
            }
        }}
        class="grow px-6 py-3 border-none"
    >
</div>
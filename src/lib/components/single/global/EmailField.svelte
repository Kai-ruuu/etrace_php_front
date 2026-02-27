<script>
    let {
        required = true,
        placeholder = "",
        Icon = null,
        value = $bindable("")
    } = $props();
</script>

<div class="relative flex items-center items-stretch border border-gray-300 rounded-lg overflow-clip">
    {#if Icon}
        <div class="border-r border-r-gray-300 min-w-12 flex items-center justify-center">
            <Icon class="w-5"/>
        </div>
    {/if}
    <input
        type="email"
        bind:value={value}
        {required}
        {placeholder}
        class="grow px-6 py-3 border-none"
    >
</div>
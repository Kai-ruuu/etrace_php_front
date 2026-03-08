<script>
    import { Upload } from "lucide-svelte";
    import Button from "./Button.svelte";
    import { onMount } from "svelte";
    import { v4 } from "uuid";

    let {
        accept = ".pdf",
        acceptMimes = [],
        value = $bindable(null),
        required = true,
        placeholder = "File",
        onUpload = null
    } = $props();

    const id = v4();
</script>

<label
    for={id}
    class="border border-gray-300 rounded-lg px-6 py-3 flex items-center relative"
>
    <div class="max-w-4/5 overflow-hidden">
        <span class="text-gray-500">{value ? value.name : placeholder}</span>
    </div>

    <input
        type="file"
        {id}
        {accept}
        {required}
        class="hidden"
        onchange={(e) => {
            value = e.target.files?.[0] ?? null;
            
            if (onUpload) {
                onUpload(value, acceptMimes);
            }
        }}
    >

    <div
        class="bg-green-500 absolute top-1/2 right-3 -translate-y-1/2 px-2 py-1 rounded cursor-pointer"
    >
        <Upload class="w-5 text-white"/>
    </div>
</label>
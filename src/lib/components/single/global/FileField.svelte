<script>
	import { Upload } from "lucide-svelte";
	import Button from "./Button.svelte";

    let {
        accept = ".pdf",
        value = $bindable(null),
        required = true,
        placeholder = "File",
    } = $props();

    const id = crypto.randomUUID();
</script>

<label
    for={id}
    class="border border-gray-300 rounded-lg px-6 py-3 flex items-center relative"
>
    <div class="max-w-4/5 overflow-hidden">
        <span>{value ? value.name : placeholder}</span>
    </div>
    <input
        type="file"
        onchange={(e) => value = e.target.files?.[0] ?? null}
        {id}
        {accept}
        {required}
        class="hidden"
    >
    <Button
        Icon={Upload}
        size="s"
        onclick={() => {}}
        class="bg-green-500 absolute top-1/2 right-6 -translate-y-1/2"
    />
</label>
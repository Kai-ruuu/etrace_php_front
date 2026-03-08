<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import { Upload } from "lucide-svelte";
	import { v4 } from "uuid";
	import ReuploadConfirmation from "./ReuploadConfirmation.svelte";
	import { CompanyService } from "$lib/app/services/users/company";
	import { Toast } from "$lib/app/utils/swal";
	import { onDestroy } from "svelte";

    let {
        key,
        display,
        source,
    } = $props();
    
    let file = $state(null);
    let uploadConfirmOpen = $state(false);
    let url = $state(null);
    const id = v4();

    async function onConfirmReupload() {
        console.log(`key: ${key}\ndisplay: ${display}\nsource: ${source}`);
        
        await CompanyService.reupload(
            { file, source, key, display },
            async (data, stat) => {
                file = null;
                uploadConfirmOpen = false;
                
                URL.revokeObjectURL(url);
                await Toast.fire({
                    title: data?.message ?? "Requirement revision has been uploaded.",
                    icon: "success"
                });
            },
            async (data, stat) => {
                file = null;
                uploadConfirmOpen = false;
                
                URL.revokeObjectURL(url);
                await Toast.fire({
                    title: data?.message ?? "Unable to upload the revision.",
                    icon: "error"
                });
            },
        )
    }

    function onCancelReupload() {
        file = null;
        uploadConfirmOpen = false;
    }

    onDestroy(() => URL.revokeObjectURL(url));
</script>

<label
    title="Reupload an updated one"
    for={id}
>
    <input
        {id}
        onchange={(e) => {
            file = e.target.files?.[0] ?? null

            if (file !== null) {
                uploadConfirmOpen = true;
    
                if (url) {
                    URL.revokeObjectURL(url);
                }
    
                url = URL.createObjectURL(file);
            }
        }}
        type="file"
        class="hidden"
        accept=".pdf"
    >
    <div
        class="bg-blue-500 px-3 py-1 text-white text-sm rounded-lg cursor-pointer flex items-center justify-center"
    >
        <Upload class="min-w-4 max-w-4"/>
    </div>
</label>

{#if uploadConfirmOpen}
    <ReuploadConfirmation
        {display}
        fileUrl={url}
        onConfirm={onConfirmReupload}
        onCancel={onCancelReupload}
    />
{/if}
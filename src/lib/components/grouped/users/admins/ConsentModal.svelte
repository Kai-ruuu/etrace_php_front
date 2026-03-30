<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import { Check, Info, X } from "lucide-svelte";
	import { twMerge } from "tailwind-merge";

    let { forRole = "System Administrator", onExit, onAgree } = $props();
    let agreed = $state(false);
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white px-6 pb-0 gap-y-4 md:w-1/2 relative min-h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] overflow-x-hidden overflow-y-auto">
        <div class="flex items-center justify-between sticky top-0 left-0 w-full py-6 bg-white border-b border-gray-300 mb-4">
            <div class="flex items-center gap-x-2 font-bold text-gray-600">
                <Info class="min-w-5 max-w-5"/>
                <h1 class="text-xl">Data Access and Confidentiality Agreement</h1>
            </div>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">1. Introduction</h1>
            <p>This system contains personal and employment-related data of alumni of the City College of Tagaytay. Access to this system is restricted to authorized personnel only.</p>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">2. Access Responsibility</h1>
            <p>By accessing the system, you acknowledge that you are authorized to view and manage data based on your assigned role <strong class="text-gray-700">({forRole})</strong>.</p>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">3. Data Privacy Compliance</h1>

            <p>All data accessed through the system must be handled in accordance with the Data Privacy Act of 2012.</p>

            <div>
                <h2>You agree to:</h2>
                <ul class="list-disc list-inside">
                    <li>Use the data only for official and institutional purposes</li>
                    <li>Protect the confidentiality of all personal information</li>
                    <li>Avoid unauthorized sharing, disclosure, or misuse of data</li>
                </ul>
            </div>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">4. Security Responsibility</h1>

            <div>
                <h2>You are responsible for maintaining the security of your account, including:</h2>
                <ul class="list-disc list-inside">
                    <li>Keeping login credentials confidential</li>
                    <li>Logging out after system use</li>
                    <li>Reporting any unauthorized access or data issues</li>
                </ul>
            </div>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify mb-4">
            <h1 class="font-bold text-lg text-gray-500">5. Declaration</h1>

            <div>
                <h2>By accessing the system, I confirm that:</h2>
                <ul class="list-disc list-inside">
                    <li>I understand my responsibility in handling sensitive data</li>
                    <li>I will comply with data privacy and system policies</li>
                    <li>I will use the system only for authorized purposes</li>
                </ul>
            </div>
        </div>

        <div class="space-y-4 sticky bottom-0 bg-white pt-4 pb-6 border-t border-gray-300">
            <label for="agree" class="flex items-center gap-x-2 cursor-pointer">
                <input type="checkbox" id="agree" bind:checked={agreed}>
                <span>I agree to the Data Access and Confidentiality Agreement</span>
            </label>
            <Button
                onclick={onAgree}
                disabled={!agreed}
                label="Proceed"
                Icon={Check}
                class={twMerge("w-full", agreed ? "bg-green-500 text-white w-full cursor-pointer" : "bg-green-700 text-gray-100 cursor-not-allowed")}
            />
        </div>
    </div>
</div>
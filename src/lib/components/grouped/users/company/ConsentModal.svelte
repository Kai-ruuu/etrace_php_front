<script>
	import Button from "$lib/components/single/global/Button.svelte";
	import { Check, Info, X } from "lucide-svelte";
	import { twMerge } from "tailwind-merge";

    let { onExit, onProceed } = $props();
    let agreed = $state(false);
</script>

<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center p-8">
    <div class="border border-gray-200 rounded-lg bg-white px-6 pb-0 gap-y-4 md:w-1/2 relative min-h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)] overflow-x-hidden overflow-y-auto">
        <div class="flex items-center justify-between sticky top-0 left-0 w-full py-6 bg-white border-b border-gray-300 mb-4">
            <div class="flex items-center gap-x-2 font-bold text-gray-600">
                <Info class="min-w-5 max-w-5"/>
                <h1 class="text-xl">Company Privacy Notice & Consent</h1>
            </div>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">1. Introduction</h1>
            <p>Welcome to the CCT Alumni Career Tracking and Employment Analytics System (E-Trace).</p>
            <p>The City College of Tagaytay (CCT) is committed to handling company and representative data in accordance with the Data Privacy Act of 2012.</p>
            <p>By registering in the system, the company agrees to provide accurate information for verification and employment facilitation purposes.</p>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">2. Information We Collect</h1>
            <p>The system collects the following company-related information and documents:</p>

            <div>
                <h2>Company Profile Information:</h2>
                <ul class="list-disc list-inside">
                    <li>Company Name</li>
                    <li>Email Address</li>
                    <li>Contact Details</li>
                    <li>Company Address</li>
                </ul>
            </div>

            <div>
                <h2>Verification Documents:</h2>
                <ul class="list-disc list-inside">
                    <li>Business Permit</li>
                    <li>SEC Registration / DTI / CDA Registration</li>
                    <li>Registry of Establishment</li>
                    <li>PhilJobNet Registration</li>
                    <li>Certification from DOLE</li>
                    <li>Certificate of No Pending Case</li>
                </ul>
            </div>

            <div>
                <h2>Employment Information:</h2>
                <ul class="list-disc list-inside">
                    <li>Job postings and list of vacancies</li>
                </ul>
            </div>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">3. Purpose of Data Collection</h1>

            <div>
                <h2>The collected information will be used solely for:</h2>
                <ul class="list-disc list-inside">
                    <li>Verifying the legitimacy of the company</li>
                    <li>Approving and managing company accounts</li>
                    <li>Ensuring that job postings are valid and credible</li>
                    <li>Facilitating employment opportunities for alumni</li>
                    <li>Supporting institutional employment and reporting processes</li>
                </ul>
            </div>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">4. Data Protection</h1>

            <div>
                <h2>All company data and submitted documents are handled with appropriate security measures, including:</h2>
                <ul class="list-disc list-inside">
                    <li>Restricted access to authorized personnel only</li>
                    <li>Secure storage of uploaded documents</li>
                    <li>Protection against unauthorized access, disclosure, or modification</li>
                </ul>
            </div>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">5. Responsibilities of the Company</h1>

            <div>
                <h2>By registering, the company agrees to:</h2>
                <ul class="list-disc list-inside">
                    <li>Provide accurate, complete, and updated information</li>
                    <li>Submit valid and legitimate documents for verification</li>
                    <li>Post truthful and relevant job opportunities</li>
                    <li>Comply with system policies and verification procedures</li>
                </ul>
            </div>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify mb-4">
            <h1 class="font-bold text-lg text-gray-500">6. Declaration and Consent</h1>

            <div>
                <h2>By selecting “I Agree” or registering in the system, the company confirms that:</h2>
                <ul class="list-disc list-inside">
                    <li>All submitted information and documents are accurate and authorized</li>
                    <li>The company consents to the collection and use of its data for verification and employment facilitation purposes</li>
                    <li>The company agrees to comply with system policies and applicable data protection regulations</li>
                </ul>
            </div>
        </div>

        <div class="space-y-4 bg-white pt-4 pb-6 border-t border-gray-300">
            <label for="agree" class="flex items-center gap-x-2 cursor-pointer">
                <input type="checkbox" id="agree" bind:checked={agreed}>
                <span>I have read and agree to the Terms and Conditions</span>
            </label>
            <Button
                onclick={onProceed}
                disabled={!agreed}
                label="Proceed"
                Icon={Check}
                class={twMerge("w-full", agreed ? "bg-green-500 text-white w-full cursor-pointer" : "bg-green-700 text-gray-100 cursor-not-allowed")}
            />
        </div>
    </div>
</div>
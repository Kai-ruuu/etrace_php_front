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
                <h1 class="text-xl">Alumni Privacy Notice & Consent</h1>
            </div>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">1. Introduction</h1>
            <p>Welcome to the CCT Alumni Career Tracking and Employment Analytics System (E-Trace).</p>
            <p>The City College of Tagaytay (CCT) is committed to protecting your personal data in accordance with the Data Privacy Act of 2012.</p>
            <p>By registering in this system, you support the institution in improving academic programs, meeting accreditation requirements, and monitoring the career outcomes of its graduates.</p>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">2. Information We Collect</h1>
            <p>The system collects only necessary personal and employment information, including:</p>

            <div>
                <h2>Personal Information:</h2>
                <ul class="list-disc list-inside">
                    <li>Full Name</li>
                    <li>Date of Birth</li>
                    <li>Phone Number</li>
                    <li>Email Address</li>
                    <li>Current Home Address</li>
                </ul>
            </div>

            <div>
                <h2>Employment Information:</h2>
                <ul class="list-disc list-inside">
                    <li>Employment status (e.g., employed, unemployed, self-employed)</li>
                    <li>Current Job Position</li>
                    <li>Company or Employer Name</li>
                    <li>Company Address</li>
                </ul>
            </div>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">3. Purpose of Data Collection</h1>

            <div>
                <h2>All collected data will be used strictly for institutional purposes, including:</h2>
                <ul class="list-disc list-inside">
                    <li>Monitoring alumni employment status and career progression</li>
                    <li>Generating statistical reports for academic evaluation and planning</li>
                    <li>Supporting curriculum improvement and accreditation requirements</li>
                    <li>Strengthening alumni engagement and institutional development</li>
                </ul>
            </div>

            <p>Note: All reports and analytics will be presented in aggregated and anonymized form, and no personal data will be publicly disclosed.</p>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">4. Data Privacy and Protection</h1>

            <div>
                <h2>The system is designed in accordance with the Data Privacy Act of 2012 (RA 10173) and follows these principles:</h2>
                <ul class="list-disc list-inside">
                    <li><strong class="text-gray-700">Data Minimization:</strong> Only necessary information is collected</li>
                    <li><strong class="text-gray-700">Confidentiality:</strong> Access is limited to authorized personnel</li>
                    <li><strong class="text-gray-700">Security:</strong> Secure login and access control mechanisms are implemented</li>
                    <li><strong class="text-gray-700">Integrity:</strong> Data is protected against unauthorized modification</li>
                </ul>
            </div>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify">
            <h1 class="font-bold text-lg text-gray-500">5. Rights of the Data Subject</h1>

            <div>
                <h2>As an alumnus/alumna, you have the right to:</h2>
                <ul class="list-disc list-inside">
                    <li>Access and review your personal data</li>
                    <li>Update or correct your information to ensure accuracy</li>
                    <li>Request account deactivation</li>
                    <li>Request deletion of your personal data, subject to institutional policies and legal requirements</li>
                </ul>
            </div>

            <p>The institution may retain limited necessary data for legitimate academic, research, and reporting purposes in accordance with applicable laws.</p>
        </div>

        <hr class="border-t border-gray-300 my-6">
        
        <div class="space-y-4 text-justify mb-4">
            <h1 class="font-bold text-lg text-gray-500">6. Declaration and Consent</h1>

            <div>
                <h2>By selecting “I Agree” or registering in the system, I confirm that:</h2>
                <ul class="list-disc list-inside">
                    <li>I have read and understood this Privacy Notice</li>
                    <li>I voluntarily provide my personal and employment information</li>
                    <li>I understand that my data will be used solely for alumni tracking and institutional purposes of the City College of Tagaytay</li>
                    <li>I am aware of my rights under the Data Privacy Act of 2012 (RA 10173)</li>
                </ul>
            </div>

            <p>The institution may retain limited necessary data for legitimate academic, research, and reporting purposes in accordance with applicable laws.</p>
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
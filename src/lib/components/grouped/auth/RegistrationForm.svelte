<script>
    import Swal from 'sweetalert2';
	import Button from "$lib/components/single/global/Button.svelte";
	import { twMerge } from 'tailwind-merge';
	import { ArrowRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';

    let as = $state("alumni");
</script>

<div class="flex flex-col items-stretch max-w-4/5 md:w-1/3 md:gap-y-6 md:p-12 md:rounded-3xl md:shadow-lg md:bg-white">
    <div class="flex flex-col items-center gap-y-2 mb-6 md:mb-0">
        <h1 class="font-bold text-xl text-red-800">Welcome to E-trace!</h1>
        <h2 class="text-center">Choose how you'd like to register to get started.</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
        <button
            onclick={() => as = "alumni"}
            class={twMerge("border-2 border-gray-100 p-8 min-h-48 flex flex-col items-center justify-center rounded-xl cursor-pointer", as === "alumni" && "border-red-100 bg-red-50")}
        >
            <div class="flex flex-col items-center">
                <div class={twMerge("w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2", as === "alumni" && "bg-red-100")}>
                    <span class="text-4xl">🎓</span>
                </div>
                <h1 class={twMerge("text-lg font-bold text-gray-600", as === "alumni" && "text-red-800")}>Alumni</h1>
                <p class="text-sm text-gray-500">Graduate or Former Student</p>
            </div>
        </button>
        <button
            onclick={() => as = "company"}
            class={twMerge("border-2 border-gray-100 p-8 min-h-48 flex flex-col items-center justify-center rounded-xl cursor-pointer", as === "company" && "border-red-100 bg-red-50")}
        >
            <div class="flex flex-col items-center">
                <div class={twMerge("w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2", as === "company" && "bg-red-100")}>
                    <span class="text-3xl">🏢</span>
                </div>
                <h1 class={twMerge("text-lg font-bold text-gray-600", as === "company" && "text-red-800")}>Company</h1>
                <p class="text-sm text-gray-500">Business or Organization</p>
            </div>
        </button>
    </div>
    <div class="flex flex-col items-stretch gap-y-4">
        <Button
            onclick={() => goto("/registration/" + as)}
            Icon={ArrowRight}
            iconPos="r"
            label="Proceed"
        />
        <Button
            onclick={() => goto("/")}
            label="Cancel"
            class="bg-transparent border border-gray-300 text-gray-700"
        />
    </div>
</div>
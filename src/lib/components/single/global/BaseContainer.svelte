<script>
    import { twMerge } from "tailwind-merge";

    let {
        children,
        class: className = ""
    } = $props();
</script>
<div class={twMerge("w-screen h-screen bg-gray-100 text-gray-700", className)}>
    {@render children()}
</div>
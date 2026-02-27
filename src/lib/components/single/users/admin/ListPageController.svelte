<script>
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	import Button from "../../global/Button.svelte";

    let {
        info,
        onNext,
        onPrev,
    } = $props();
</script>

{#if info.total_pages > 0}
    <div class="sticky bottom-0 left-0 bg-white border-t border-t-gray-200 px-6 py-3 rounded-bl-lg rounded-br-lg flex items-center justify-between">
        <p>Page {info.page} of {info.total_pages}</p>
        <div class="flex items-center gap-x-2">
            {#if info.has_prev}
                <Button
                    Icon={ChevronLeft}
                    label="Prev"
                    size="s"
                    onclick={onPrev}
                    class="bg-blue-600"
                />
            {/if}
            {#if info.has_next}
                <Button
                    Icon={ChevronRight}
                    iconPos="r"
                    label="Next"
                    size="s"
                    onclick={onNext}
                    class="bg-blue-600"
                />
            {/if}
        </div>
    </div>
{/if}
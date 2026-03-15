<script>
	import Button from '$lib/components/single/global/Button.svelte';
	import { X } from 'lucide-svelte';
    import { onMount } from 'svelte';

    let {
        address,
        onExit
    } = $props();
    
    let marker = $state(null);
    
    onMount(async () => {
        try {
            const url = new URL('https://nominatim.openstreetmap.org/search');
            url.searchParams.set('q', address);
            url.searchParams.set('format', 'json');
            url.searchParams.set('limit', '1');

            const res = await fetch(url, {
                headers: { 'User-Agent': 'CCT E-trace' },
            });

            const results = await res.json();

            if (!results.length) {
                error = 'Address not found. Try being more specific.';
                return;
            }

            const { lat, lon, display_name } = results[0];
            const [latitude, longitude] = [parseFloat(lat), parseFloat(lon)];

            marker?.remove();
            
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');
    
            const map = L.map('map').setView([latitude, longitude], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            marker = L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(display_name)
                .openPopup();

            map.flyTo([latitude, longitude], 15, { animate: true, duration: 1.2 });
        } catch (error) {
            console.error(error)
        }
    });
</script>
<div class="absolute top-0 left-0 w-screen h-screen bg-white/75 overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center p-8 z-100">
    <div class="border border-gray-200 rounded-lg bg-white flex flex-col items-stretch p-6 gap-y-4 md:w-2/3">
        <div class="flex items-center justify-between">
            <h1 class="text-lg">{address}</h1>
            <Button Icon={X} size="s" onclick={onExit} class="bg-transparent text-gray-700"/>
        </div>
        <div id="map" class="min-h-136"></div>
    </div>
</div>
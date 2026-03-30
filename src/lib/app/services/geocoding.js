export class GeocodingService {
    static async geocode(address) {
        try {
            const url = new URL('https://nominatim.openstreetmap.org/search');
            url.searchParams.set('q', address);
            url.searchParams.set('format', 'json');
            url.searchParams.set('limit', '1');

            const res = await fetch(url, {
                headers: { 'User-Agent': 'CCT E-trace' },
            });

            const results = await res.json();

            if (results.length) {
                const { lat, lon, display_name } = results[0];
                return [parseFloat(lat), parseFloat(lon), display_name];
            }
        } catch (_) {}

        // Fallback to Photon
        try {
            const url = new URL('https://photon.komoot.io/api/');
            url.searchParams.set('q', address);
            url.searchParams.set('limit', '1');

            const res = await fetch(url);
            const data = await res.json();

            if (!data.features?.length) {
                return 'Address not found. Try being more specific.';
            }

            const [lon, lat] = data.features[0].geometry.coordinates;
            const { name, city, country } = data.features[0].properties;
            const display_name = [name, city, country].filter(Boolean).join(', ');

            return [lat, lon, display_name];
        } catch (_) {
            return "Unable to search address.";
        }
    }
}
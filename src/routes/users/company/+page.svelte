<script>
	import { CompanyService } from "$lib/app/services/users/company";
	import PostsList from "$lib/components/grouped/users/company/PostsList.svelte";
	import { onMount } from "svelte";

	let published = $state(true);
	let query = $state("");
	let postsInfo = $state({
		data: [],
		total: 0,
		page: 1,
		per_page: 20,
		has_next: false,
		has_prev: false,
	});

	async function searchPosts() {
		await CompanyService.searchJobPosts(query, {
			page: postsInfo.page,
			perPage: postsInfo.perPage,
			published,
			onSuccess: async (data, status) => postsInfo = data,
			onFail: async (data, status) => {
				await Toast.fire({
					title: data?.message ?? "Failed to get posts.",
					icon: "error"
				});
			}
		});
	}

	async function onQueryClear() {
		query = "";
		postsInfo.page = 1;
		await searchPosts();
	}

	async function onSearch() {
		postsInfo.page = 1;
		await searchPosts();
	}

	async function onPrev() {
		if (postsInfo.has_prev) {
			postsInfo.page--;
			await searchPosts();
		}
	}

	async function onNext() {
		if (postsInfo.has_next) {
			postsInfo.page++;
			await searchPosts();
		}
	}

	onMount(searchPosts);
</script>

<PostsList
	bind:query={query}
	bind:published={published}
	{onQueryClear}
	bind:postsInfo={postsInfo}
	{onSearch}
	{onPrev}
	{onNext}
/>
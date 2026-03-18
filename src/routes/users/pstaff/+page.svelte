<script>
	import HeadBar from "$lib/components/grouped/users/admins/HeadBar.svelte";
	import { onMount } from "svelte";
	import { CompanyService } from "$lib/app/services/users/company";

	let loading = false; // set to true on connect phase
	let errorMessage = "";

	let companyVerification = { pending: 0, verified: 0, rejected: 0, total: 0 };

	const fetchSearch = (service, q = "", opts = {}) =>
		new Promise((resolve, reject) =>
			service.search(q, {
				...opts,
				onSuccess: (data) => resolve(data),
				onFail: (data, status) => reject({ data, status })
			})
		);

	const stackedDonut = (segments = [], fallback = "#e5e7eb") => {
		const total = segments.reduce((sum, seg) => sum + (seg?.value || 0), 0);
		if (!total) return `background: conic-gradient(${fallback} 0 100%);`;

		let cursor = 0;
		const slices = segments.map((seg) => {
			const start = (cursor / total) * 100;
			cursor += seg.value || 0;
			const end = (cursor / total) * 100;
			return `${seg.color} ${start}% ${end}%`;
		});

		if (cursor < total) slices.push(`${fallback} ${(cursor / total) * 100}% 100%`);
		return `background: conic-gradient(${slices.join(", ")});`;
	};

	const pct = (value = 0, total = 0) => (total ? Math.round((value / total) * 100) : 0);

	async function loadDashboardData() {
		try {
			const pending = await fetchSearch(CompanyService, "", {
				enabled: true,
				ver_status: "Pending",
				perPage: 1,
				page: 1
			});
			const verified = await fetchSearch(CompanyService, "", {
				enabled: true,
				ver_status: "Verified",
				perPage: 1,
				page: 1
			});
			const rejected = await fetchSearch(CompanyService, "", {
				enabled: true,
				ver_status: "Rejected",
				perPage: 1,
				page: 1
			});

			companyVerification.pending = pending.total || 0;
			companyVerification.verified = verified.total || 0;
			companyVerification.rejected = rejected.total || 0;
			companyVerification.total =
				companyVerification.pending + companyVerification.verified + companyVerification.rejected;
		} catch (err) {
			errorMessage = err?.data?.message || "Unable to load dashboard data.";
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// loadDashboardData();
	});
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar title="Dashboard"/>
	<div class="h-[calc(100%-64px)] overflow-auto">
		{#if loading}
			<div class="p-6 text-sm text-gray-600">Loading dashboard... ...</div>
		{:else}
			{#if errorMessage}
				<div class="p-6 text-sm text-red-600">{errorMessage}</div>
			{/if}

			<div class="p-6 space-y-8">
				<section class="space-y-4">
					<h2 class="text-lg font-semibold">Company Verification</h2>
					<div class="grid gap-4 lg:grid-cols-2">
						<div class="rounded-lg border border-gray-200 bg-white p-5 flex flex-col gap-4">
							<div class="flex items-start gap-4">
								<div
									class="w-28 h-28 rounded-full border border-gray-100 shadow-inner"
									style={stackedDonut([
										{ value: companyVerification.pending, color: "#f59e0b" },
										{ value: companyVerification.verified, color: "#16a34a" },
										{ value: companyVerification.rejected, color: "#dc2626" }
									])}
								></div>
								<div class="flex-1 grid gap-2 text-sm">
									<div class="flex items-center gap-2">
										<span class="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
										<span class="text-gray-700 font-medium">Pending</span>
										<span class="ml-auto text-gray-500">
											{companyVerification.pending} ({pct(companyVerification.pending, companyVerification.total)}%)
										</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
										<span class="text-gray-700 font-medium">Verified</span>
										<span class="ml-auto text-gray-500">
											{companyVerification.verified} ({pct(companyVerification.verified, companyVerification.total)}%)
										</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="h-2.5 w-2.5 rounded-full bg-rose-600"></span>
										<span class="text-gray-700 font-medium">Rejected</span>
										<span class="ml-auto text-gray-500">
											{companyVerification.rejected} ({pct(companyVerification.rejected, companyVerification.total)}%)
										</span>
									</div>
								</div>
							</div>
						</div>

						<div class="grid gap-3">
							{#each [
								{
									label: "Pending Companies",
									value: companyVerification.pending,
									color: "bg-amber-500/10 border-amber-200",
									text: "text-amber-700"
								},
								{
									label: "Verified Companies",
									value: companyVerification.verified,
									color: "bg-emerald-500/10 border-emerald-200",
									text: "text-emerald-700"
								},
								{
									label: "Rejected Companies",
									value: companyVerification.rejected,
									color: "bg-rose-500/10 border-rose-200",
									text: "text-rose-700"
								}
							] as card}
								<div class={`rounded-lg border ${card.color} p-4 flex items-center justify-between bg-white`}>
									<div class="space-y-1">
										<p class={`text-sm ${card.text}`}>{card.label}</p>
										<p class="text-2xl font-semibold text-gray-900">{card.value}</p>
									</div>
									<div class="text-xs text-gray-500">
										{pct(card.value, companyVerification.total)}%
									</div>
								</div>
							{/each}
						</div>
					</div>
				</section>
			</div>
		{/if}
	</div>
</div>
<script>
	import { PstaffService } from "$lib/app/services/users/pstaff";
	import { Toast } from "$lib/app/utils/swal";
	import HeadBar from "$lib/components/grouped/users/admins/HeadBar.svelte";
	import { onMount } from "svelte";
	import { twMerge } from "tailwind-merge";

	let data = $state(null);
	let dataLoading = $state(false);

	function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

	let company = $state(null);
	let sv = $state(null);
	let pv = $state(null);
	let svTotal = $state(0);
	let pvTotal = $state(0);

	onMount(async () => {
		dataLoading = true;

		await PstaffService.getAnalytics(
			async (d) => {
				data = d;
				dataLoading = false;
				company = data?.company;
				sv = company?.sysad_verification_info;
				pv = company?.pstaff_verification_info;
				svTotal = (sv?.pending ?? 0) + (sv?.rejected ?? 0) + (sv?.verified ?? 0);
				pvTotal = (pv?.pending ?? 0) + (pv?.rejected ?? 0) + (pv?.verified ?? 0);
			},
			async () => {
				dataLoading = false;
				await Toast.fire({ title: "Failed to load analytics." });
			},
		);
	});
</script>

<div class="flex flex-col items-stretch overflow-hidden h-full">
	<HeadBar title="Dashboard" />
	{#if dataLoading || !data}
		<div class="flex items-center justify-center h-full text-sm text-gray-400">Loading...</div>
	{:else}
		<div class="h-[calc(100%-64px)] overflow-auto">
			<div class="min-h-screen bg-gray-50 p-6 space-y-6">

				<!-- COMPANY SUMMARY -->
				<section>
					<h2 class="section-label">Company Summary</h2>
					<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{#each [
							{ label: 'Total Companies',  val: company.total,    text: 'text-gray-800',  sub: null },
							{ label: 'Active',           val: company.active,   text: 'text-green-600', sub: `${pct(company.active, company.total)}% of total` },
							{ label: 'Inactive',         val: company.inactive, text: 'text-gray-400',  sub: `${pct(company.inactive, company.total)}% of total` },
							{ label: 'Fully Verified',   val: Math.min(sv.verified, pv.verified), text: 'text-blue-600', sub: 'sys. administrator & peso staff verified' },
						] as k}
							<div class="bg-white rounded-lg border border-gray-200 p-4">
								<p class="card-label">{k.label}</p>
								<p class={twMerge("text-3xl font-bold", k.text)}>{k.val}</p>
								{#if k.sub}<p class="text-xs text-gray-400 mt-1">{k.sub}</p>{/if}
							</div>
						{/each}
					</div>
				</section>

				<!-- ACCOUNT STATUS -->
				<section>
					<h2 class="section-label">Account Status</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">

						<!-- Active vs Inactive bar -->
						<div class="bg-white rounded-lg border border-gray-200 p-4">
							<p class="card-label">Active vs Inactive</p>
							<div class="space-y-3">
								{#each [
									{ label: 'Active',   val: company.active,   bar: 'bg-green-500', dot: 'bg-green-500', text: 'text-green-600' },
									{ label: 'Inactive', val: company.inactive, bar: 'bg-gray-300',  dot: 'bg-gray-300',  text: 'text-gray-500'  },
								] as s}
									<div>
										<div class="flex items-center gap-2 mb-1">
											<span class={twMerge("w-2 h-2 rounded-full flex-shrink-0", s.dot)}></span>
											<span class="text-xs text-gray-600 flex-1">{s.label}</span>
											<span class={twMerge("text-xs font-bold", s.text)}>{s.val}</span>
											<span class="text-xs text-gray-400">{pct(s.val, company.total)}%</span>
										</div>
										<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
											<div class={twMerge("h-full rounded-full", s.bar)} style="width:{pct(s.val, company.total)}%"></div>
										</div>
									</div>
								{/each}
							</div>
						</div>

						<!-- Pending review callout -->
						<div class="bg-white rounded-lg border border-yellow-200 p-4">
							<p class="card-label">Awaiting Your Review</p>
							<div class="flex items-end gap-3">
								<p class="text-4xl font-bold text-yellow-500">{pv.pending}</p>
								<div class="flex flex-col gap-1 pb-1">
									<p class="text-xs text-gray-500">companies pending</p>
									<p class="text-xs text-gray-400">PESO Staff verification</p>
								</div>
							</div>
							<div class="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
								<div class="h-full bg-yellow-400 rounded-full" style="width:{pct(pv.pending, pvTotal)}%"></div>
							</div>
						</div>
					</div>
				</section>

				<!-- VERIFICATION BREAKDOWN -->
				<section>
					<h2 class="section-label">Verification Breakdown</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">

						{#each [
							{ title: 'Sysad Review',      info: sv, total: svTotal },
							{ title: 'PESO Staff Review (You)', info: pv, total: pvTotal },
						] as panel}
							<div class="bg-white rounded-lg border border-gray-200 p-4">
								<p class="card-label">{panel.title}</p>
								<div class="space-y-3">
									{#each [
										{ label: 'Verified', val: panel.info.verified, bar: 'bg-green-500',  dot: 'bg-green-500',  text: 'text-green-600'  },
										{ label: 'Pending',  val: panel.info.pending,  bar: 'bg-yellow-400', dot: 'bg-yellow-400', text: 'text-yellow-600' },
										{ label: 'Rejected', val: panel.info.rejected, bar: 'bg-red-500',    dot: 'bg-red-500',    text: 'text-red-500'    },
									] as s}
										<div>
											<div class="flex items-center gap-2 mb-1 text-xs">
												<span class={twMerge("w-2 h-2 rounded-full flex-shrink-0", s.dot)}></span>
												<span class="text-gray-600 flex-1">{s.label}</span>
												<span class={twMerge("font-bold", s.text)}>{s.val}</span>
												<span class="text-gray-400">{pct(s.val, panel.total)}%</span>
											</div>
											<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
												<div class={twMerge("h-full rounded-full", s.bar)} style="width:{pct(s.val, panel.total)}%"></div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</section>

				<!-- SIDE BY SIDE COMPARISON -->
				<section>
					<h2 class="section-label">Sys. Administrator vs PESO Staff Comparison</h2>
					<div class="bg-white rounded-lg border border-gray-200 p-4">
						<div class="space-y-4">
							{#each [
								{ label: 'Verified', sysad: sv.verified, pstaff: pv.verified, sysadBar: 'bg-green-400', pstaffBar: 'bg-green-600' },
								{ label: 'Pending',  sysad: sv.pending,  pstaff: pv.pending,  sysadBar: 'bg-yellow-300', pstaffBar: 'bg-yellow-500' },
								{ label: 'Rejected', sysad: sv.rejected, pstaff: pv.rejected, sysadBar: 'bg-red-300',  pstaffBar: 'bg-red-500'   },
							] as row}
								<div>
									<p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{row.label}</p>
									<div class="space-y-1.5">
										<div class="flex items-center gap-3 text-xs">
											<span class="text-gray-400 w-14">Sysad</span>
											<div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
												<div class={twMerge("h-full rounded-full", row.sysadBar)} style="width:{pct(row.sysad, company.total)}%"></div>
											</div>
											<span class="text-gray-700 font-semibold w-6 text-right">{row.sysad}</span>
										</div>
										<div class="flex items-center gap-3 text-xs">
											<span class="text-gray-400 w-14">P.Staff</span>
											<div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
												<div class={twMerge("h-full rounded-full", row.pstaffBar)} style="width:{pct(row.pstaff, company.total)}%"></div>
											</div>
											<span class="text-gray-700 font-semibold w-6 text-right">{row.pstaff}</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</section>

			</div>
		</div>
	{/if}
</div>

<style>
	.section-label {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #6b7280;
		margin-bottom: 0.75rem;
		padding-left: 0.625rem;
		border-left: 3px solid #16a34a;
	}
	.card-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9ca3af;
		margin-bottom: 0.875rem;
	}
	.chip-green {
		font-size: 0.65rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: #dcfce7;
		color: #16a34a;
		font-weight: 600;
	}
	.chip-gray {
		font-size: 0.65rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: #f3f4f6;
		color: #6b7280;
		font-weight: 600;
	}
</style>
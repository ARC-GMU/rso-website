<script lang="ts">
	import Page from "$lib/theme/Page.svelte";
	import Panel from "$lib/theme/Panel.svelte";
</script>

<Page title="Robotics Outreach Event">
	<Panel>
		<p class="arc-body">
			The Outreach Event will be at Research Hall on the George Mason University
			Fairfax campus on <strong class="font-bold"
				>Friday, March 27th, from 4:30-7:30 pm</strong
			>.
		</p>
		<p class="arc-body mt-4">
			It will be <strong class="font-bold">$12 to park at the Shenandoah Parking Deck</strong
			>. If you are driving, fill out the RSVP form and include your driving info; we
			might provide reimbursements, not guaranteed. I have added addresses below. I
			advise that anyone attending the event should carpool with friends and family.
		</p>
		<p class="arc-body mt-4">
			This event is also not specifically for Scouts; Scouts can invite friends and
			family. Please have interested scouts and peers RSVP using the link below. Let
			me know if you have any questions.
		</p>
		<div class="mt-7 flex flex-wrap gap-3">
			<a
				href="https://forms.gle/B7hGDErwgVgsoK6a6"
				target="_blank"
				rel="noopener noreferrer"
				class="arc-btn"
			>
				RSVP HERE
			</a>
			<a href="/events" class="arc-btn-ghost">BACK TO EVENTS</a>
		</div>
	</Panel>

	<Panel title="ARRIVAL INSTRUCTIONS">
		<p class="arc-body">
			When you arrive, use the door facing the Shenandoah Parking Deck. You should be
			greeted inside.
		</p>
		<ul class="mt-4 list-disc pl-5">
			<li class="arc-body">Doors will be open from 4:00 PM - 4:50 PM.</li>
			<li class="arc-body text-[var(--arc-warn)]">
				After 4:50 PM, you have to call +1 (301) 900-6147 to enter the Robotics lab.
			</li>
		</ul>
	</Panel>

	<Panel title="LOCATION AND PARKING">
		<div class="grid gap-6 md:grid-cols-2">
			<div>
				<div class="arc-label">EVENT ADDRESS</div>
				<p class="arc-note mt-2">
					Research Hall<br />001 York River Rd<br />Fairfax, VA 22030
				</p>
			</div>
			<div>
				<div class="arc-label">SHENANDOAH PARKING DECK ($12)</div>
				<p class="arc-note mt-2">10401 York River Rd<br />Fairfax, VA 22030</p>
			</div>
		</div>
		<p class="mt-6 border-t border-[var(--arc-line-soft)] pt-4 text-[13px] font-bold text-[var(--arc-warn)]">
			We strongly advise carpooling with friends and family to minimize parking costs
			and congestion.
		</p>
	</Panel>
</Page>

<script>
	import { fade } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import '$lib/style/globals.scss';
	export let data;

	const transitionIn = { easing: cubicOut, duration: 300, delay: 400 };
	const transitionOut = { easing: cubicIn, duration: 300 };
</script>

<nav>
	<li><a href="/">/</a></li>
	<li><a href="/visual_1">/visual_1</a></li>
	<li><a href="/visual_2">/visual_2</a></li>
</nav>

{#key data.path}
	<main class="app_main">
		<div in:fade|global={transitionIn} out:fade|global={transitionOut}>
			<slot />
		</div>
	</main>
{/key}

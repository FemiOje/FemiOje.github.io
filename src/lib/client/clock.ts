// Fills `<span data-clock="Africa/Lagos" hidden>…<time></time>…</span>` with the local time there.
let timer: ReturnType<typeof setInterval> | undefined;

document.addEventListener('astro:page-load', () => {
  clearInterval(timer);
  const clock = document.querySelector<HTMLElement>('[data-clock]');
  const time = clock?.querySelector('time');
  if (!clock || !time) return;

  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: clock.dataset.clock,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const tick = () => {
    const now = new Date();
    time.textContent = format.format(now);
    time.dateTime = now.toISOString();
  };
  tick();
  clock.hidden = false;
  timer = setInterval(tick, 15_000);
});

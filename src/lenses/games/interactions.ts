import { mountOverworld, type MapNode } from './overworld';
import { progress, save, visit } from './progress';
import { drawBrand, drawBuilding, type BuildingKind } from './sprites';

let unmount: (() => void) | undefined;

document.addEventListener('astro:before-swap', () => {
  unmount?.();
  unmount = undefined;
});

document.addEventListener('astro:page-load', () => {
  if (document.documentElement.dataset.lens !== 'games') return;

  const brand = document.querySelector<HTMLCanvasElement>('canvas[data-brand]');
  if (brand) drawBrand(brand);
  for (const canvas of document.querySelectorAll<HTMLCanvasElement>('canvas[data-sprite]')) {
    drawBuilding(canvas, canvas.dataset.sprite as BuildingKind);
  }

  // A level page: opening it visits the level, and the map will have the player waiting there.
  const level = document.querySelector<HTMLElement>('[data-level-page]');
  if (level) {
    visit(level.dataset.levelPage!);
    progress.at = level.dataset.node;
    save();
    for (const square of document.querySelectorAll<HTMLElement>('.strip a[data-level]')) {
      square.classList.toggle('done', progress.visited.includes(square.dataset.level!));
    }
  }

  const map = document.querySelector<HTMLElement>('[data-overworld]');
  const worlds = document.querySelector('[data-worlds]')?.textContent;
  if (map && worlds) unmount = mountOverworld(map, JSON.parse(worlds) as MapNode[][]);
});

import { expect, test } from '@playwright/test';

interface E2eNode {
  id: string;
  type: 'pc' | 'router';
  position: { x: number; y: number };
  data: { label: string; type: 'pc' | 'router' };
}

interface E2eEdge {
  id: string;
  source: string;
  target: string;
  type: 'cable';
}

interface ExposedStore {
  getState(): {
    placeNode(node: E2eNode): void;
    connectNodes(edge: E2eEdge): void;
    cablePlacementActive: boolean;
  };
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Building' }).click();
  await page.waitForURL('/build');

  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.placeNode({ id: 'pc-01', type: 'pc', position: { x: 150, y: 160 }, data: { label: 'Alpha', type: 'pc' } });
    store?.placeNode({
      id: 'router-01',
      type: 'router',
      position: { x: 500, y: 250 },
      data: { label: 'Router', type: 'router' },
    });
    store?.placeNode({ id: 'pc-02', type: 'pc', position: { x: 300, y: 430 }, data: { label: 'Beta', type: 'pc' } });
  });
  await expect(page.locator('.react-flow__node')).toHaveCount(3);
});

test('cable tool connects nodes by clicking, supports multiple cables, and can be cancelled', async ({ page }) => {
  await page.getByRole('button', { name: /network cable/ }).click();
  await expect(page.getByText('Click the first node the cable should leave from.')).toBeVisible();

  await page.locator('.react-flow__node', { hasText: 'Alpha' }).getByText('Alpha').click();
  await expect(page.getByText('Now click the node to connect the cable to.')).toBeVisible();

  await page.locator('.react-flow__node', { hasText: 'Router' }).getByText('Router').click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState()
            .cablePlacementActive,
      ),
    )
    .toBe(true);
  await expect.poll(() => page.locator('.react-flow__edge').count()).toBe(1);
  await expect(page.getByText('Click the first node the cable should leave from.')).toBeVisible();

  await page.locator('.react-flow__node', { hasText: 'Alpha' }).getByText('Alpha').click();
  await page.locator('.react-flow__node', { hasText: 'Beta' }).getByText('Beta').click();
  await expect(page.locator('.react-flow__edge')).toHaveCount(2);

  const strokes = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.react-flow__edge .cable-flow')).map(
      (p) => getComputedStyle(p as SVGPathElement).stroke,
    ),
  );
  expect(strokes).toContain('rgb(34, 197, 94)');
  expect(strokes).toContain('rgb(239, 68, 68)');

  await page.getByRole('button', { name: 'Cancel Cable' }).click();
  await expect(page.getByText('Your infrastructure is ready for review.')).toBeVisible();
  const active = await page.evaluate(
    () =>
      (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().cablePlacementActive,
  );
  expect(active).toBe(false);
});

test('clicking the canvas pane clears the cable source', async ({ page }) => {
  await page.getByRole('button', { name: /network cable/ }).click();
  await page.locator('.react-flow__node', { hasText: 'Alpha' }).getByText('Alpha').click();
  await expect(page.getByText('Now click the node to connect the cable to.')).toBeVisible();

  await page.locator('.react-flow__pane').click();
  await expect(page.getByText('Click the first node the cable should leave from.')).toBeVisible();

  await page.locator('.react-flow__node', { hasText: 'Beta' }).getByText('Beta').click();
  await page.locator('.react-flow__node', { hasText: 'Router' }).getByText('Router').click();
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);
});

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
    setStep(step: number): void;
    canvasNodes: E2eNode[];
    canvasEdges: E2eEdge[];
  };
}

async function buildNetwork(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Start Building' }).click();
  await page.waitForURL('/build');
  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.placeNode({ id: 'pc-01', type: 'pc', position: { x: 150, y: 150 }, data: { label: 'PC', type: 'pc' } });
    store?.placeNode({
      id: 'router-01',
      type: 'router',
      position: { x: 500, y: 250 },
      data: { label: 'Router', type: 'router' },
    });
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('theme toggle switches to dark and persists', async ({ page }) => {
  const html = page.locator('html');
  await expect(html).not.toHaveClass(/dark/);

  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  await expect(html).toHaveClass(/dark/);

  const stored = await page.evaluate(() => localStorage.getItem('cyber-range-theme'));
  expect(stored).toBe('dark');

  await page.getByRole('button', { name: /switch to light mode/i }).click();
  await expect(html).not.toHaveClass(/dark/);
});

test('cable signal colors: cross-type green, same-type red', async ({ page }) => {
  await buildNetwork(page);
  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.placeNode({ id: 'pc-02', type: 'pc', position: { x: 300, y: 420 }, data: { label: 'PC2', type: 'pc' } });
    store?.connectNodes({ id: 'edge-ok', source: 'pc-01', target: 'router-01', type: 'cable' });
    store?.connectNodes({ id: 'edge-bad', source: 'pc-01', target: 'pc-02', type: 'cable' });
  });

  await expect(page.locator('.react-flow__edge .cable-flow')).toHaveCount(2);

  const strokes = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.react-flow__edge .cable-flow')).map(
      (p) => getComputedStyle(p as SVGPathElement).stroke,
    ),
  );

  expect(strokes).toContain('rgb(34, 197, 94)');
  expect(strokes).toContain('rgb(239, 68, 68)');
});

test('launch shows full exercise summary with stats and connection log', async ({ page }) => {
  await buildNetwork(page);
  await page.evaluate(() =>
    (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().connectNodes({
      id: 'edge-01',
      source: 'pc-01',
      target: 'router-01',
      type: 'cable',
    }),
  );

  await page.getByTestId('continue-button').click();
  await page.waitForURL('/review');
  await page.getByTestId('review-continue').click();
  await page.waitForURL('/ready');

  await expect(page.getByTestId('launch-button')).toBeEnabled();
  await page.getByTestId('launch-button').click();

  await expect(page.getByText('Exercise Launched')).toBeVisible();
  await expect(page.getByText('Connection Log')).toBeVisible();
  await expect(page.getByText('Network Preview')).toBeVisible();

  await expect(page.getByText('Signal OK').first()).toBeVisible();
  await expect(page.getByText('Warnings')).toBeVisible();
  await expect(page.getByText('Total Nodes')).toBeVisible();
  await expect(page.getByText('Cables')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Back to Dashboard' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'New Exercise' })).toBeVisible();

  await page.getByRole('button', { name: 'Back to Dashboard' }).click();
  await page.waitForURL('/');
});

test('new exercise resets the store', async ({ page }) => {
  await buildNetwork(page);
  await page.evaluate(() =>
    (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().connectNodes({
      id: 'edge-01',
      source: 'pc-01',
      target: 'router-01',
      type: 'cable',
    }),
  );
  await page.getByTestId('continue-button').click();
  await page.waitForURL('/review');
  await page.getByTestId('review-continue').click();
  await page.waitForURL('/ready');
  await page.getByTestId('launch-button').click();
  await page.getByRole('button', { name: 'New Exercise' }).click();
  await page.waitForURL('/');

  await expect
    .poll(() =>
      page.evaluate(() => {
        const s = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
        return { nodes: s?.canvasNodes.length, edges: s?.canvasEdges.length };
      }),
    )
    .toEqual({ nodes: 0, edges: 0 });
});

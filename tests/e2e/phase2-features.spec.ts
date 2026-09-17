import { expect, test } from '@playwright/test';

interface E2eNode {
  id: string;
  type: 'pc' | 'router';
  position: { x: number; y: number };
  data: { label: string; type: 'pc' | 'router'; operatingSystem?: string | null };
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
    startPendingCable(start: { x: number; y: number }, end: { x: number; y: number }): void;
    canvasNodes: E2eNode[];
    canvasEdges: E2eEdge[];
  };
}

async function buildNetwork(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Start Building' }).click();
  await page.waitForURL('/build');
  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.placeNode({
      id: 'pc-01',
      type: 'pc',
      position: { x: 150, y: 150 },
      data: { label: 'PC', type: 'pc', operatingSystem: 'windows-11' },
    });
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

test('dragging a PC toward another PC is stopped at the minimum distance', async ({ page }) => {
  await page.getByRole('button', { name: 'Start Building' }).click();
  await page.waitForURL('/build');
  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.placeNode({
      id: 'pc-01',
      type: 'pc',
      position: { x: 150, y: 160 },
      data: { label: 'Alpha', type: 'pc' },
    });
    store?.placeNode({
      id: 'pc-02',
      type: 'pc',
      position: { x: 400, y: 160 },
      data: { label: 'Beta', type: 'pc' },
    });
  });
  await expect(page.locator('.react-flow__node')).toHaveCount(2);

  const alphaNode = page.locator('.react-flow__node', { hasText: 'Alpha' }).locator('div').first();
  const betaNode = page.locator('.react-flow__node', { hasText: 'Beta' }).locator('div').first();
  const betaBox = await betaNode.boundingBox();
  const alphaBox = await alphaNode.boundingBox();
  if (!betaBox || !alphaBox) throw new Error('missing bounding box');

  await page.mouse.move(betaBox.x + betaBox.width / 2, betaBox.y + betaBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(alphaBox.x + alphaBox.width / 2 + 10, alphaBox.y + alphaBox.height / 2, { steps: 20 });
  await page.mouse.up();

  const distance = await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    const nodes = store?.canvasNodes ?? [];
    const pc1 = nodes.find((n) => n.id === 'pc-01');
    const pc2 = nodes.find((n) => n.id === 'pc-02');
    if (!pc1 || !pc2) return 0;
    return Math.hypot(pc1.position.x - pc2.position.x, pc1.position.y - pc2.position.y);
  });
  expect(distance).toBeGreaterThanOrEqual(159);
});

test('Build window cables are always neutral, connected or not (no red/green)', async ({ page }) => {
  await buildNetwork(page);
  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.connectNodes({ id: 'edge-01', source: 'pc-01', target: 'router-01', type: 'cable' });
    store?.startPendingCable({ x: 700, y: 400 }, { x: 780, y: 480 });
  });

  await expect(page.locator('.react-flow__edge .cable-flow')).toHaveCount(1);
  const connectedStroke = await page.evaluate(
    () => getComputedStyle(document.querySelector('.react-flow__edge .cable-flow') as SVGPathElement).stroke,
  );
  expect(connectedStroke).not.toBe('rgb(34, 197, 94)');
  expect(connectedStroke).not.toBe('rgb(239, 68, 68)');

  const pendingLine = page.locator('svg[aria-label="In-progress cable"] .cable-flow');
  await expect(pendingLine).toBeVisible();
  const pendingStroke = await pendingLine.evaluate((el) => getComputedStyle(el).stroke);
  expect(pendingStroke).not.toBe('rgb(239, 68, 68)');
  expect(pendingStroke).not.toBe('rgb(34, 197, 94)');
  // A cable still being placed is the same neutral color as a connected one.
  expect(pendingStroke).toBe(connectedStroke);
});

test('Ready window launch summary shows red/green connection status', async ({ page }) => {
  await buildNetwork(page);
  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.placeNode({
      id: 'pc-02',
      type: 'pc',
      position: { x: 300, y: 420 },
      data: { label: 'PC2', type: 'pc', operatingSystem: 'windows-11' },
    });
    store?.connectNodes({ id: 'edge-ok', source: 'pc-01', target: 'router-01', type: 'cable' });
    store?.connectNodes({ id: 'edge-bad', source: 'pc-01', target: 'pc-02', type: 'cable' });
  });

  await page.getByTestId('continue-button').click();
  await page.waitForURL('/review');
  await page.getByTestId('review-continue').click();
  await page.waitForURL('/ready');
  await page.getByTestId('launch-button').click();
  await expect(page.getByText('Exercise Launched')).toBeVisible();

  await expect(page.locator('.react-flow__edge .cable-flow')).toHaveCount(2);
  const strokes = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.react-flow__edge .cable-flow')).map(
      (el) => getComputedStyle(el as SVGPathElement).stroke,
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

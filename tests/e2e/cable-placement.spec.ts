import { expect, type Locator, type Page, test } from '@playwright/test';

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
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type: 'cable';
}

interface ExposedStore {
  getState(): {
    placeNode(node: E2eNode): void;
    connectNodes(edge: E2eEdge): void;
    cancelPendingCable(): void;
    pendingCable: unknown;
    selectedEdgeId: string | null;
    canvasEdges: E2eEdge[];
  };
}

async function centerOf(locator: Locator): Promise<{ x: number; y: number }> {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('Element has no bounding box');
  }
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function dragBetween(page: Page, from: Locator, to: Locator) {
  const start = await centerOf(from);
  const end = await centerOf(to);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 12 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Building' }).click();
  await page.waitForURL('/build');

  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.placeNode({
      id: 'pc-01',
      type: 'pc',
      position: { x: 150, y: 160 },
      data: { label: 'Alpha', type: 'pc', operatingSystem: 'windows-11' },
    });
    store?.placeNode({
      id: 'router-01',
      type: 'router',
      position: { x: 500, y: 250 },
      data: { label: 'Router', type: 'router' },
    });
    store?.placeNode({
      id: 'pc-02',
      type: 'pc',
      position: { x: 300, y: 430 },
      data: { label: 'Beta', type: 'pc', operatingSystem: 'windows-11' },
    });
  });
  await expect(page.locator('.react-flow__node')).toHaveCount(3);
});

test('clicking the cable tool places a pending cable (neutral, not red/green) that can be cancelled', async ({
  page,
}) => {
  await page.getByRole('button', { name: /network cable/ }).click();

  const pendingLayer = page.locator('svg[aria-label="In-progress cable"]');
  await expect(pendingLayer).toBeVisible();
  const stroke = await pendingLayer.locator('.cable-flow').evaluate((el) => getComputedStyle(el).stroke);
  // The Build window never shows red/green connection-status coloring, including
  // for a cable that's still being placed (see FIX 3).
  expect(stroke).not.toBe('rgb(239, 68, 68)');
  expect(stroke).not.toBe('rgb(34, 197, 94)');

  await pendingLayer.getByRole('button', { name: 'Remove cable' }).click();
  await expect(pendingLayer).toHaveCount(0);
});

test('a newly placed pending cable respects the minimum length', async ({ page }) => {
  await page.getByRole('button', { name: /network cable/ }).click();

  const line = page.locator('svg[aria-label="In-progress cable"] line');
  const [x1, x2, y1, y2] = await Promise.all([
    line.getAttribute('x1'),
    line.getAttribute('x2'),
    line.getAttribute('y1'),
    line.getAttribute('y2'),
  ]);
  const length = Math.hypot(Number(x2) - Number(x1), Number(y2) - Number(y1));
  expect(length).toBeGreaterThanOrEqual(80);
});

test('dragging both cable ends onto ports connects two components (Build cable is neutral, not red/green)', async ({
  page,
}) => {
  await page.getByRole('button', { name: /network cable/ }).click();

  const pendingLayer = page.locator('svg[aria-label="In-progress cable"]');
  const startHandle = pendingLayer.locator('circle').nth(0);
  const endHandle = pendingLayer.locator('circle').nth(1);

  const alphaRightPort = page
    .locator('.react-flow__node', { hasText: 'Alpha' })
    .locator('.react-flow__handle[data-handlepos="right"]')
    .first();
  const routerLeftPort = page
    .locator('.react-flow__node', { hasText: 'Router' })
    .locator('.react-flow__handle[data-handlepos="left"]')
    .first();

  await dragBetween(page, startHandle, alphaRightPort);
  await dragBetween(page, endHandle, routerLeftPort);

  await expect(pendingLayer).toHaveCount(0);
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);

  const stroke = await page.evaluate(
    () => getComputedStyle(document.querySelector('.react-flow__edge .cable-flow') as SVGPathElement).stroke,
  );
  // Build window cables never show red/green connection-status coloring (see FIX 3).
  expect(stroke).not.toBe('rgb(34, 197, 94)');
  expect(stroke).not.toBe('rgb(239, 68, 68)');
});

test('dropping a cable end away from any port leaves it pending', async ({ page }) => {
  await page.getByRole('button', { name: /network cable/ }).click();

  const pendingLayer = page.locator('svg[aria-label="In-progress cable"]');
  const startHandle = pendingLayer.locator('circle').nth(0);
  const emptyCanvas = page.locator('.react-flow__pane');

  const start = await centerOf(startHandle);
  const emptyBox = await emptyCanvas.boundingBox();
  if (!emptyBox) throw new Error('canvas has no bounding box');

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(emptyBox.x + 40, emptyBox.y + 40, { steps: 8 });
  await page.mouse.up();

  await expect(pendingLayer).toBeVisible();
  await expect(page.locator('.react-flow__edge')).toHaveCount(0);
});

test('a connected cable stays selectable, shows a delete button, and can be deleted', async ({ page }) => {
  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.connectNodes({
      id: 'edge-01',
      source: 'pc-01',
      target: 'router-01',
      sourceHandle: 'right-source',
      targetHandle: 'left-target',
      type: 'cable',
    });
  });
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);

  // Not selected yet: no delete button rendered.
  await expect(page.getByRole('button', { name: /Remove cable/ })).toHaveCount(0);

  const interactionPath = page.locator('.react-flow__edge .react-flow__edge-interaction');
  const box = await interactionPath.boundingBox();
  if (!box) throw new Error('edge has no bounding box');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

  const selectedEdgeId = await page.evaluate(
    () => (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().selectedEdgeId,
  );
  expect(selectedEdgeId).toBe('edge-01');
  await expect(page.locator('.react-flow__edge.selected')).toHaveCount(1);

  const removeButton = page.getByRole('button', { name: /Remove cable/ });
  await expect(removeButton).toBeVisible();
  await removeButton.click();

  await expect(page.locator('.react-flow__edge')).toHaveCount(0);
});

test('a connected cable can be repositioned by dragging an endpoint to a new port', async ({ page }) => {
  await page.evaluate(() => {
    const store = (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState();
    store?.connectNodes({
      id: 'edge-01',
      source: 'pc-01',
      target: 'router-01',
      sourceHandle: 'right-source',
      targetHandle: 'left-target',
      type: 'cable',
    });
  });
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);

  const targetAnchor = page.locator('.react-flow__edgeupdater-target');
  const betaPort = page
    .locator('.react-flow__node', { hasText: 'Beta' })
    .locator('.react-flow__handle[data-handlepos="right"]')
    .first();

  await dragBetween(page, targetAnchor, betaPort);

  const canvasEdges = await page.evaluate(
    () => (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().canvasEdges,
  );
  const edge = canvasEdges?.find((item) => item.id === 'edge-01');
  expect(edge?.target).toBe('pc-02');
});

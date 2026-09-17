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
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type: 'cable';
}

interface ExposedStore {
  getState(): {
    placeNode(node: E2eNode): void;
    connectNodes(edge: E2eEdge): void;
  };
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
    store?.connectNodes({
      id: 'edge-01',
      source: 'pc-01',
      target: 'router-01',
      sourceHandle: 'right-source',
      targetHandle: 'left-target',
      type: 'cable',
    });
  });
  await expect(page.locator('.react-flow__node')).toHaveCount(2);
});

test('shows the empty state when nothing is selected', async ({ page }) => {
  await expect(page.getByText('Select a node to edit')).toBeVisible();
});

test('selecting a PC shows its operating system and port-annotated connections', async ({ page }) => {
  await page.locator('.react-flow__node', { hasText: 'Alpha' }).getByText('Alpha').click();

  await expect(page.getByText('Operating System')).toBeVisible();
  await expect(page.getByText('Windows 11')).toBeVisible();
  await expect(page.getByText(/Router · right/)).toBeVisible();
});

test('selecting a cable shows source, destination, status, and can delete it', async ({ page }) => {
  const interactionPath = page.locator('.react-flow__edge .react-flow__edge-interaction');
  const box = await interactionPath.boundingBox();
  if (!box) throw new Error('edge has no bounding box');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

  await expect(page.getByText('Source')).toBeVisible();
  await expect(page.getByText(/Alpha · right/)).toBeVisible();
  await expect(page.getByText('Destination')).toBeVisible();
  await expect(page.getByText(/Router · left/)).toBeVisible();
  await expect(page.getByText('Connected')).toBeVisible();

  await page.getByRole('button', { name: 'Delete Cable' }).click();
  await expect(page.locator('.react-flow__edge')).toHaveCount(0);
  await expect(page.getByText('Select a node to edit')).toBeVisible();
});

test('clicking empty canvas clears the selection', async ({ page }) => {
  await page.locator('.react-flow__node', { hasText: 'Alpha' }).getByText('Alpha').click();
  await expect(page.getByText('Operating System')).toBeVisible();

  await page.locator('.react-flow__pane').click({ position: { x: 20, y: 20 } });
  await expect(page.getByText('Select a node to edit')).toBeVisible();
});

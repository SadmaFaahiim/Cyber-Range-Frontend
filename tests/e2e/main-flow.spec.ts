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

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('full user journey', () => {
  test('renders dashboard and navigates to builder', async ({ page }) => {
    await expect(page.getByText('Cyber Range')).toBeVisible();

    await page.getByRole('button', { name: 'Start Building' }).click();
    await page.waitForURL('/build');

    await expect(page.getByText('Components')).toBeVisible();
    await expect(page.getByText('Workstation or end-user device')).toBeVisible();
  });

  test('shows validation warning when canvas is empty', async ({ page }) => {
    await page.goto('/build');

    await expect(page.getByText(/Add at least 2 nodes and connect them/)).toBeVisible();
    await expect(page.getByTestId('continue-button')).toBeDisabled();
  });

  test('completes the full flow', async ({ page }) => {
    await page.getByRole('button', { name: 'Start Building' }).click();
    await page.waitForURL('/build');

    await page.evaluate(() => {
      (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().placeNode({
        id: 'pc-01',
        type: 'pc',
        position: { x: 150, y: 150 },
        data: { label: 'PC', type: 'pc' },
      });
    });
    await expect(page.locator('.react-flow__node')).toHaveCount(1);

    await page.evaluate(() => {
      (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().placeNode({
        id: 'router-01',
        type: 'router',
        position: { x: 500, y: 250 },
        data: { label: 'Router', type: 'router' },
      });
    });
    await expect(page.locator('.react-flow__node')).toHaveCount(2);

    await page.evaluate(() => {
      (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().connectNodes({
        id: 'edge-01',
        source: 'pc-01',
        target: 'router-01',
        type: 'cable',
      });
    });
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().canvasEdges
              .length,
        ),
      )
      .toBe(1);

    await expect(page.getByTestId('continue-button')).toBeEnabled();
    await page.getByTestId('continue-button').click();
    await page.waitForURL('/review');

    await expect(page.getByText('Review Infrastructure')).toBeVisible();
    await expect(page.getByTestId('node-count')).toHaveText('2');

    await expect(page.getByTestId('review-continue')).toBeEnabled();
    await page.getByTestId('review-continue').click();
    await page.waitForURL('/ready');

    await expect(page.getByText('Exercise Readiness')).toBeVisible();
    await expect(page.getByTestId('readiness-checklist').locator('li[data-state="pass"]')).toHaveCount(3);

    await expect(page.getByTestId('launch-button')).toBeEnabled();
    await page.getByTestId('launch-button').click();

    await expect(page.getByText('Exercise Launched')).toBeVisible();
  });

  test('stepper reflects the current step', async ({ page }) => {
    await expect(page.locator('li[data-state="active"]')).toContainText('Build');

    await page.getByRole('button', { name: 'Start Building' }).click();
    await page.waitForURL('/build');
    await expect(page.locator('li[data-state="active"]')).toContainText('Build');

    await page.evaluate(() => {
      (window as unknown as { __cyberRangeStore?: ExposedStore }).__cyberRangeStore?.getState().setStep(2);
    });
    await expect(page.locator('li[data-state="complete"]')).toContainText('Build');
    await expect(page.locator('li[data-state="active"]')).toContainText('Review');
  });
});

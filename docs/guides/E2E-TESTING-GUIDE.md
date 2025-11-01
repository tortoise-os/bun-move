# E2E Testing Guide for TortoiseOS

**Last Updated**: October 17, 2025
**Status**: Fully Implemented ✅

---

## Overview

TortoiseOS uses **Playwright** for end-to-end testing with custom fixtures for Sui wallet interactions. Unlike Ethereum-based dApps that can use Synpress, Sui requires a custom testing approach using the **@mysten/dapp-kit's unsafe burner wallet**.

### Why Not Synpress?

**Synpress** (`@synthetixio/synpress`) is specifically built for Ethereum/EVM wallets (MetaMask, Coinbase Wallet, etc.) and is **NOT compatible with Sui blockchain**. Sui uses different wallet standards (Sui Wallet, Suiet, Ethos, etc.) and requires a different testing approach.

---

## Testing Stack

| Tool | Purpose |
|------|---------|
| **Playwright** | E2E testing framework |
| **@mysten/dapp-kit** | Sui wallet integration with `enableUnsafeBurner` |
| **Custom Fixtures** | Sui wallet test helpers |
| **Localnet** | Local Sui blockchain for testing |

---

## Setup

### 1. Unsafe Burner Wallet

The unsafe burner wallet is automatically enabled for E2E tests via environment variables:

```typescript
// apps/web/src/app/providers.tsx
const isTestEnvironment =
  process.env.NODE_ENV === "test" ||
  process.env.NEXT_PUBLIC_ENABLE_BURNER_WALLET === "true";

<WalletProvider autoConnect enableUnsafeBurner={isTestEnvironment}>
  {children}
</WalletProvider>
```

### 2. Playwright Configuration

The Playwright config automatically enables the burner wallet:

```typescript
// apps/web/playwright.config.ts
webServer: {
  command: 'bun run dev',
  env: {
    NEXT_PUBLIC_ENABLE_BURNER_WALLET: 'true',
    NEXT_PUBLIC_SUI_NETWORK: 'localnet',
  },
}
```

---

## Writing Tests

### Using the Sui Wallet Fixture

Import the custom test and expect from the fixtures:

```typescript
import { test, expect } from './fixtures/sui-wallet';

test.describe('My Wallet Test', () => {
  test('should connect to wallet', async ({ page, suiWallet }) => {
    await page.goto('/');

    // Connect to burner wallet
    await suiWallet.connect();

    // Verify connection
    const isConnected = await suiWallet.isConnected();
    expect(isConnected).toBe(true);
  });
});
```

### Available Wallet Methods

#### `suiWallet.connect()`
Connects to the unsafe burner wallet.

```typescript
await suiWallet.connect();
```

#### `suiWallet.disconnect()`
Disconnects from the current wallet.

```typescript
await suiWallet.disconnect();
```

#### `suiWallet.isConnected()`
Checks if a wallet is currently connected.

```typescript
const connected = await suiWallet.isConnected();
expect(connected).toBe(true);
```

#### `suiWallet.getAddress()`
Gets the current wallet address (if displayed in UI).

```typescript
const address = await suiWallet.getAddress();
expect(address).toMatch(/^0x[a-fA-F0-9]+/);
```

#### `suiWallet.waitForTransaction(timeout?)`
Waits for a transaction to complete.

```typescript
// Click a button that triggers a transaction
await page.click('[data-testid="transfer-button"]');

// Wait for transaction to complete
await suiWallet.waitForTransaction(10000);
```

---

## Running Tests

### Run All E2E Tests

```bash
cd apps/web
bun run test:e2e
```

### Run in UI Mode (Recommended for Development)

```bash
bun run test:e2e:ui
```

### Run with Browser Visible

```bash
bun run test:e2e:headed
```

### Debug Mode

```bash
bun run test:e2e:debug
```

### Run Specific Test File

```bash
bunx playwright test wallet-connection.spec.ts
```

### Run Specific Test

```bash
bunx playwright test -g "should connect to burner wallet"
```

---

## Example Tests

### Basic Wallet Connection

```typescript
import { test, expect } from './fixtures/sui-wallet';

test('should connect and disconnect wallet', async ({ page, suiWallet }) => {
  await page.goto('/');

  // Connect
  await suiWallet.connect();
  expect(await suiWallet.isConnected()).toBe(true);

  // Disconnect
  await suiWallet.disconnect();
  expect(await suiWallet.isConnected()).toBe(false);
});
```

### Testing Transactions

```typescript
test('should execute a transaction', async ({ page, suiWallet }) => {
  await page.goto('/swap');

  // Connect wallet
  await suiWallet.connect();

  // Fill in swap form
  await page.fill('[data-testid="amount-input"]', '100');
  await page.selectOption('[data-testid="token-select"]', 'SUI');

  // Execute swap
  await page.click('[data-testid="swap-button"]');

  // Wait for transaction
  await suiWallet.waitForTransaction();

  // Verify success message
  await expect(page.getByText(/swap successful/i)).toBeVisible();
});
```

### Testing with Multiple Wallets

```typescript
test('should switch between wallets', async ({ page, suiWallet }) => {
  await page.goto('/');

  // Connect first wallet
  await suiWallet.connect();
  const address1 = await suiWallet.getAddress();

  // Disconnect
  await suiWallet.disconnect();

  // Connect again (gets new burner wallet)
  await suiWallet.connect();
  const address2 = await suiWallet.getAddress();

  // Addresses should be different
  expect(address1).not.toEqual(address2);
});
```

---

## Best Practices

### 1. Always Wait for Page Load

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body', { timeout: 10000 });
});
```

### 2. Use Data Attributes for Selectors

Instead of:
```typescript
await page.click('.btn-primary'); // ❌ Fragile
```

Use:
```typescript
await page.click('[data-testid="connect-button"]'); // ✅ Stable
```

### 3. Handle Async Operations

```typescript
// Wait for wallet connection
await suiWallet.connect();
await page.waitForTimeout(1000); // Give UI time to update

// Or wait for specific element
await page.waitForSelector('[data-testid="wallet-address"]');
```

### 4. Clean State Between Tests

```typescript
test.afterEach(async ({ suiWallet }) => {
  // Disconnect wallet after each test
  await suiWallet.disconnect();
});
```

### 5. Use Screenshots and Videos

Playwright automatically captures screenshots on failure. Videos are recorded when tests fail (configured in `playwright.config.ts`).

```bash
# View test results
bunx playwright show-report
```

---

## Troubleshooting

### Issue: Wallet Not Connecting

**Problem**: `suiWallet.connect()` times out

**Solutions**:
1. Ensure `NEXT_PUBLIC_ENABLE_BURNER_WALLET=true` is set
2. Check that `enableUnsafeBurner` is in WalletProvider
3. Increase timeout: `await page.waitForSelector('button', { timeout: 15000 })`

### Issue: Address Not Found

**Problem**: `suiWallet.getAddress()` returns null

**Solutions**:
1. Add `data-testid="wallet-address"` to your address display component
2. Wait longer after connection: `await page.waitForTimeout(2000)`
3. Check if address is displayed in your UI

### Issue: Transaction Hangs

**Problem**: `waitForTransaction()` times out

**Solutions**:
1. Ensure localnet is running: `sui start`
2. Check network configuration in providers.tsx
3. Increase timeout: `await suiWallet.waitForTransaction(20000)`

### Issue: Tests Fail in CI

**Problem**: Tests pass locally but fail in CI

**Solutions**:
1. Increase retries in CI: `retries: process.env.CI ? 2 : 0`
2. Use single worker in CI: `workers: process.env.CI ? 1 : undefined`
3. Check if localnet is running in CI environment

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Install Playwright
        run: bunx playwright install --with-deps chromium

      - name: Start Sui localnet
        run: |
          sui start &
          sleep 10

      - name: Run E2E tests
        run: cd apps/web && bun run test:e2e
        env:
          NEXT_PUBLIC_ENABLE_BURNER_WALLET: 'true'
          NEXT_PUBLIC_SUI_NETWORK: 'localnet'

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: apps/web/playwright-report/
```

---

## Comparison: Sui vs Ethereum Testing

| Aspect | Ethereum (Synpress) | Sui (This Setup) |
|--------|---------------------|------------------|
| **Testing Framework** | Cypress/Playwright | Playwright |
| **Wallet Tool** | MetaMask extension | Unsafe Burner Wallet |
| **Network** | Hardhat/Anvil | Sui Localnet |
| **Setup Complexity** | High (browser extension) | Low (built-in burner) |
| **Test Speed** | Slower | Faster |
| **CI-Friendly** | Moderate | High |

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [@mysten/dapp-kit Docs](https://sdk.mystenlabs.com/dapp-kit)
- [Sui Documentation](https://docs.sui.io/)
- [Project Testing Guide](./CLI-TESTING-GUIDE.md)

---

## Summary

✅ **What Works**
- Automated wallet connection testing
- Transaction execution testing
- Multi-wallet scenarios
- Fast, reliable tests
- CI/CD friendly

⚠️ **Limitations**
- Only works with burner wallet (not real wallet extensions)
- Cannot test wallet-specific features (e.g., Ledger signing)
- Requires UI updates to use data-testid attributes

🚀 **Next Steps**
- Add more wallet interaction tests
- Test all DeFi products (swap, vault, stablecoin, etc.)
- Add visual regression testing
- Set up continuous testing in CI

---

**Status**: Ready for production use ✅
**Maintainer**: TortoiseOS Team
**Last Updated**: October 17, 2025

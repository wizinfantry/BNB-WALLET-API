-----

# BNB Wallet API

This repository provides a convenient JavaScript utility for interacting with the Binance Smart Chain (BSC) or any EVM-compatible network where BNB is the native token. It simplifies common blockchain operations like wallet management, balance inquiries, and sending both native BNB and ERC20 tokens. The utility is built on top of the robust `ethers.js` library.

-----

### Features

  * **Wallet Creation & Management**:
      * Generate brand new random wallets.
      * Load existing wallets securely using a private key.
      * Display essential wallet details: address, private key, and mnemonic phrase (if available).
  * **Balance Retrieval**:
      * Effortlessly check the native BNB balance of any wallet.
      * Retrieve the balance of any ERC20 token.
  * **Transaction Handling**:
      * Send native BNB to any recipient address.
      * Transfer ERC20 tokens to any address.
      * Fetch transaction receipts using a transaction hash.

-----

### Installation

To get started with this utility, you'll need Node.js and npm (Node Package Manager) installed on your system.

1.  **Clone the repository (or simply copy the code):**

    ```bash
    git clone https://github.com/wizinfantry/bnb-wallet-api.git
    cd bnb-wallet-api
    ```

2.  **Install the necessary dependencies:**

    ```bash
    npm install ethers
    ```

-----

### Usage

The core functionality of this API is encapsulated within the **`BNBWallet`** class.

#### 1\. Setup

First, you'll need your BNB Chain RPC URL. You can either provide an existing private key to load a wallet or let the utility generate a new random one for you.

```javascript
import { BNBWallet } from "./BNBWallet.js"; // Adjust path as needed

// Your BNB Smart Chain RPC URL (e.g., BSC Mainnet, Testnet)
const providerUrl = "https://data-seed-prebsc-1-s1.binance.org:8545"; // Example Testnet RPC

// !!! IMPORTANT: Replace this with your actual private key for an existing wallet.
// For security reasons, never hardcode private keys in production environments.
const privateKey = 'YOUR_PRIVATE_KEY_HERE'; // e.g., '0x123...abc'

// To create a brand new random wallet:
// const wallet = new BNBWallet(null, providerUrl);
// To use an existing wallet:
const wallet = new BNBWallet(privateKey, providerUrl);
```

#### 2\. Examples

Here's how you can use the methods provided by the **`BNBWallet`** class:

```javascript
const main = async () => {
    // Get the wallet's public address
    console.log("Wallet Address:", wallet.getAddress());

    // Get the native BNB balance
    const bnbBalance = await wallet.getBalance();
    console.log("BNB Balance:", bnbBalance, "BNB");

    // --- ERC20 Token Operations ---
    // Make sure to replace this with the actual address of the ERC20 token you wish to interact with
    const tokenAddress = "0xYOUR_ERC20_TOKEN_ADDRESS_HERE"; // e.g., "0xAbc...123"

    // Get ERC20 token balance
    try {
        const tokenBalance = await wallet.getTokenBalance(tokenAddress);
        console.log("Token Balance:", tokenBalance);
    } catch (error) {
        console.error("Error getting token balance. Ensure the token address is correct and the network is accessible:", error.message);
    }

    // Send ERC20 tokens
    // Replace 'RECIPIENT_TOKEN_ADDRESS_HERE' with the intended recipient's address
    // Replace 'AMOUNT_TO_SEND' with the desired token amount (e.g., "5.5" for 5.5 tokens)
    try {
        console.log("\nAttempting to send tokens...");
        const tokenRecipient = 'RECIPIENT_TOKEN_ADDRESS_HERE';
        const tokenAmount = "10";
        const tokenTx = await wallet.sendToken(tokenAddress, tokenRecipient, tokenAmount);
        console.log("Token Transaction Hash:", tokenTx.hash);
        console.log("Waiting for token transaction to be confirmed...");
        await tokenTx.wait(); // It's good practice to wait for the transaction to be mined
        console.log("Token transaction confirmed!");
    } catch (error) {
        console.error("Error sending tokens:", error.message);
    }

    // --- Native BNB Operations ---
    // Send native BNB
    // Replace 'RECIPIENT_BNB_ADDRESS_HERE' with the intended recipient's address
    // Replace 'AMOUNT_TO_SEND_BNB' with the desired BNB amount (e.g., "0.005")
    try {
        console.log("\nAttempting to send native BNB...");
        const bnbRecipient = 'RECIPIENT_BNB_ADDRESS_HERE';
        const bnbAmount = "0.001";
        const bnbTx = await wallet.sendTransaction(bnbRecipient, bnbAmount);
        console.log("BNB Transaction Hash:", bnbTx.hash);
        console.log("Waiting for BNB transaction to be confirmed...");
        await bnbTx.wait(); // Wait for the transaction to be mined
        console.log("BNB transaction confirmed!");
    } catch (error) {
        console.error("Error sending BNB:", error.message);
    }
};

main();
```

-----

### Important Security Notes

  * **Private Keys**: **Never expose your private keys in client-side code or commit them directly to your repository.** For production applications, always use secure methods like environment variables, dedicated key management services, or hardware security modules (HSMs). The example above includes a private key directly for demonstration purposes only.
  * **Network Selection**: The provided `providerUrl` is an example for a BNB Chain testnet. For interactions with the BNB Chain Mainnet, you must update this URL to the appropriate mainnet RPC endpoint.
  * **Error Handling**: The examples include basic `try-catch` blocks for demonstration. In a production environment, comprehensive error handling, logging, and user feedback mechanisms are essential for a robust application.

-----

### Contributing

Contributions are welcome\! Feel free to fork this repository, open issues, or submit pull requests to enhance this utility.

-----

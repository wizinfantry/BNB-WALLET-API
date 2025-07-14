import { ethers } from "ethers";

// ABI for common ERC20 token functions (balanceOf, transfer, decimals)
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)",
    "function decimals() view returns (uint8)",
];

/**
 * @class BNBWallet
 * @description A utility class for interacting with the Binance Smart Chain (BSC)
 * or any EVM-compatible chain where BNB is the native token.
 * It handles wallet creation/loading, balance queries, and token/native transfers.
 */
export class BNBWallet {
    /**
     * @constructor
     * @param {string | null} privateKey - The private key of an existing wallet. If null, a new random wallet will be generated.
     * @param {string} providerUrl - The RPC URL of the BNB Chain network (e.g., BSC Mainnet, Testnet).
     */
    constructor(privateKey, providerUrl) {
        // Initialize the JSON RPC provider for the specified network
        this.provider = new ethers.JsonRpcProvider(providerUrl);

        // Check if a private key was provided to load an existing wallet
        if (privateKey) {
            // Create a wallet instance from the given private key and connect to the provider
            this.wallet = new ethers.Wallet(privateKey, this.provider);
            console.log("Address:", this.wallet.address);
            console.log("Private Key:", this.wallet.privateKey);
            console.log("Mnemonic:", this.wallet.mnemonic?.phrase || "Not available");
        } else {
            // If no private key is provided, create a new random wallet
            this.wallet = ethers.Wallet.createRandom().connect(this.provider);
            console.log("📌 New wallet created:");
            console.log("Address:", this.wallet.address);
            console.log("Private Key:", this.wallet.privateKey);
            console.log("Mnemonic:", this.wallet.mnemonic?.phrase || "Not available");
        }
    }

    /**
     * Retrieves the public address of the wallet.
     * @returns {string} The wallet's public address.
     */
    getAddress() {
        return this.wallet.address;
    }

    /**
     * Retrieves the private key of the wallet.
     * @returns {string} The wallet's private key.
     */
    getPrivateKey() {
        return this.wallet.privateKey;
    }

    /**
     * Asynchronously retrieves the native coin (BNB) balance of the wallet.
     * @returns {Promise<string>} A promise that resolves to the balance in Ether (BNB), formatted as a string.
     */
    async getBalance() {
        const balance = await this.provider.getBalance(this.wallet.address);
        return ethers.formatEther(balance);
    }

    /**
     * Asynchronously sends a native coin (BNB) transaction to a specified address.
     * @param {string} to - The recipient's address.
     * @param {string} amountInEther - The amount of BNB to send, in Ether units (e.g., "0.01").
     * @returns {Promise<ethers.TransactionResponse>} A promise that resolves to the transaction response.
     */
    async sendTransaction(to, amountInEther) {
        const tx = {
            to,
            value: ethers.parseEther(amountInEther), // Convert amount from Ether string to Wei BigInt
        };
        const transaction = await this.wallet.sendTransaction(tx);
        return transaction;
    }

    /**
     * Asynchronously retrieves the transaction receipt for a given transaction hash.
     * @param {string} txHash - The hash of the transaction.
     * @returns {Promise<ethers.TransactionReceipt | null>} A promise that resolves to the transaction receipt, or null if not found.
     */
    async getTransactionReceipt(txHash) {
        return await this.provider.getTransactionReceipt(txHash);
    }

    /**
     * Asynchronously retrieves the balance of a specific ERC20 token for the wallet.
     * @param {string} tokenAddress - The contract address of the ERC20 token.
     * @returns {Promise<string>} A promise that resolves to the token balance, formatted as a string.
     */
    async getTokenBalance(tokenAddress) {
        // Create a contract instance with the ERC20 ABI, connected to the provider (read-only)
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
        const balance = await contract.balanceOf(this.wallet.address);
        const decimals = await contract.decimals(); // Get the number of decimal places for the token
        return ethers.formatUnits(balance, decimals); // Format the balance using the token's decimals
    }

    /**
     * Asynchronously sends ERC20 tokens to a specified address.
     * @param {string} tokenAddress - The contract address of the ERC20 token.
     * @param {string} to - The recipient's address.
     * @param {string} amount - The amount of tokens to send (e.g., "10.5"). This amount is in the token's standard units.
     * @returns {Promise<ethers.TransactionResponse>} A promise that resolves to the transaction response.
     */
    async sendToken(tokenAddress, to, amount) {
        // Create a contract instance connected to the wallet for signing transactions
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.wallet);
        const decimals = await contract.decimals(); // Get the number of decimal places for the token
        // Parse the human-readable amount into the token's smallest unit based on its decimals
        const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
        return tx;
    }
}

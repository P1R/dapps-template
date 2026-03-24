<script>
    import { getEthersState, connectWallet, disconnectWallet } from '../lib/ethers.svelte.js';

    const ethersState = getEthersState();
</script>

<div class="wallet-connector">
    {#if ethersState.signerAddress}
        <div class="connected">
            <p>Connected: {ethersState.signerAddress}</p>
            <button onclick={disconnectWallet}>
                Disconnect Wallet
            </button>
        </div>
    {:else}
        <button onclick={connectWallet}>
            Connect Wallet
        </button>
    {/if}
</div>

<script>
  import WalletConnector from './components/WalletConnector.svelte'
  import IPFSConnector from './components/IPFSConnector.svelte'
  import IPFSTextHandler from './components/IPFSTextHandler.svelte'
  import IPFSFileHandler from './components/IPFSFileHandler.svelte'
  import { heliaState } from './lib/helia.svelte.js';
  let transferFile = $state(false);
  let transferMessage = $state(false);
  let heliaOption = $state(false);
  async function transferFileOption() {
	  transferFile = !transferFile;
	  transferMessage = false;
  }
  async function transferMessageOption() {
	  transferMessage = !transferMessage;
	  transferFile = false;
  }
</script>

<main>
  <h2> A full web3 template with Vite + Svelte </h2>
  <div class="blockchain">
    <WalletConnector />
  </div>
  <br>
  <div class="ipfs">
    <IPFSConnector />
  </div>
  <br>
  {#if heliaState.helia} 
    <button
        onclick={transferFileOption}
        disabled={ transferMessage }
    >
        {transferFile ? 'Stop transfering a file' : 'Transfer a file'}
    </button>
    <button
        onclick={transferMessageOption}
        disabled={ transferFile }
    >
        {transferMessage ? 'Stop transfering a message' : 'Transfer a message'}
    </button>
    {#if transferFile}
        <br>
	<div class="helia file">
		<IPFSFileHandler />
	</div>
    {/if}
    {#if transferMessage}
        <br>
	<div class="helia text">
		<IPFSTextHandler />
	</div>
    {/if}
  {/if}
  <br>
</main>

<style>
</style>

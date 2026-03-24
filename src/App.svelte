<script>
  import WalletConnector from './components/WalletConnector.svelte'
  import IPFSConnector from './components/IPFSConnector.svelte'
  import IPFSTextHandler from './components/IPFSTextHandler.svelte'
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
  <div class="ipfs">
    <IPFSTextHandler />
  </div>
</main>

<style>
</style>

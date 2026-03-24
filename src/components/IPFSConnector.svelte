<script>
  import { heliaState, initHelia, stopHelia } from '../lib/helia.svelte.js';
  import { multiaddr } from '@multiformats/multiaddr'

  let peerId = $state('');
  let dialedPeers = $state('');
  let isLoading = $state(false);
  let error = $state('');

    async function initNode() {
        try {
            isLoading = true;
            error = '';
            await initHelia();
        } catch (err) {
            error = `Failed to start node: ${err.message}`;
            console.error(error);
        } finally {
            peerId = heliaState.helia.node.libp2p.peerId.toString();
	    console.log('peerID:', peerId);
	    dialPeers();
            isLoading = false;
        }
    }
    async function dialPeers(){
        try {
            const seed = "/dns4/node-mx.decentralizedscience.org/tcp/443/wss/p2p/12D3KooWFKzSGcTj9WE9wAbcLxUbGzLHTLysNmhzcwG7DBYaWBsJ"
            let ma = multiaddr(seed);
            let conn = await heliaState.helia.node.libp2p.dial(ma, {signal: AbortSignal.timeout(10_000)});
            console.log(`Connected to the listening node via ${conn.remoteAddr.toString()}`)
	    //try {
	    //  await heliaState.helia.node.libp2p.peerStore.addressBook.add(ma)
	    //} catch (error) {
            //  console.error('Error adding dialed peers to addressBook:', error);
	    //}
        } catch (error) {
            console.error('Error dialing desci peers:', error);
        } finally {
	    getDialedPeers();
	}
    }

    function getDialedPeers() {
        try {
            dialedPeers = heliaState.helia.node.libp2p.getPeers();
            console.log(`There are ${dialedPeers.length} peers dialing`);
            console.log("with the following peerIds:");
            console.log(dialedPeers.toString());
        } catch (error) {
            console.error('Error getting dialed peers:', error);
        }
    }
</script>

<div>
    <!-- Node Controls -->
    {#if !heliaState.helia}
        <button onclick={initNode} disabled={isLoading}>
            {isLoading ? 'Starting...' : 'Start IPFS Node'}
        </button>
    {:else}
        <div class="node-status">
            <p>✅ IPFS Node is running</p>
	    <p>PeerID: {peerId}</p>
	    <p>dialed peers: {dialedPeers}</p>
            <button onclick={stopHelia} disabled={isLoading}>
                Stop IPFS Node
            </button>
        </div>
   {/if}
</div>

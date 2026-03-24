<script>
    import { heliaState, initHelia, stopHelia } from '../lib/helia.svelte.js';
    import { CID } from 'multiformats/cid';

    let uploadContent = $state('');
    let fetchCID = $state('');
    let resultCID = $state('');
    let fetchedContent = $state('');
    let fetchIsLoading = $state(false);
    let uploadIsLoading = $state(false);
    let error = $state('');

    async function uploadToIPFS() {
        if (!uploadContent && !heliaState.helia) return;

        try {
            uploadIsLoading = true;
            error = '';
            const encoder = new TextEncoder();
            const cid = await heliaState.helia.fs.addBytes(encoder.encode(uploadContent));
            resultCID = cid.toString();
        } catch (err) {
            error = `Upload failed: ${err.message}`;
            console.error(error);
        } finally {
            uploadIsLoading = false;
        }
    }

    async function fetchFromIPFS() {
        if (!fetchCID && !heliaState.helia) return;

        try {
            fetchIsLoading = true;
            error = '';
            fetchedContent = '';
            const decoder = new TextDecoder();
            const cid = CID.parse(fetchCID);

            for await (const chunk of heliaState.helia.fs.cat(cid,
                { signal: AbortSignal.timeout(10_000)})
	    ) {
                fetchedContent += decoder.decode(chunk, { stream: true });
            }
        } catch (err) {
            error = `Fetch failed: ${err.message}`;
            console.error(error);
        } finally {
            fetchIsLoading = false;
        }
    }
</script>

<div class="ipfs-uploader">
    <!-- Node Controls -->
    {#if heliaState.helia}
        <!-- Upload Section -->
        <div class="upload-section">
            <h3>Upload to IPFS</h3>
            <textarea
                bind:value={uploadContent}
                placeholder="Enter content to upload"
            ></textarea>
            <button onclick={uploadToIPFS} disabled={uploadIsLoading || !uploadContent}>
                {uploadIsLoading ? 'Uploading...' : 'Upload'}
            </button>
            {#if resultCID}
                <p>CID: <code>{resultCID}</code></p>
            {/if}
        </div>

        <!-- Fetch Section -->
        <div class="fetch-section">
            <h3>Fetch from IPFS</h3>
            <input
                type="text"
                bind:value={fetchCID}
                placeholder="Enter CID to fetch"
            />
            <button onclick={fetchFromIPFS} disabled={fetchIsLoading || !fetchCID}>
                {fetchIsLoading ? 'Fetching...' : 'Fetch'}
            </button>
            {#if fetchedContent}
                <pre>{fetchedContent}</pre>
            {/if}
        </div>
    {/if}

    {#if error}
        <p class="error">{error}</p>
    {/if}
</div>

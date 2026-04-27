<script>
    import { heliaState, initHelia, stopHelia } from '../lib/helia.svelte.js';
    import { copyToClipboard } from '../lib/clipboard.js';
    import { CID } from 'multiformats/cid';

    // File input state
    let file = $state(null);
    let resultCID = $state('');
    let fileIsLoading = $state(false);
    let error = $state('');

    // Fetch state
    let fetchCID = $state('');
    let fetchedContent = $state(null); // Blob for files
    let fetchedFileName = $state('');

    async function uploadToIPFS() {
        if (!file || !heliaState.helia) return;
        try {
            fileIsLoading = true;
            error = '';
            const fileBytes = new Uint8Array(await file.arrayBuffer());
            const cid = await heliaState.helia.fs.addBytes(fileBytes);
            resultCID = cid.toString();
            console.log('Uploaded to IPFS with CID:', resultCID.toString());
        } catch (err) {
            error = `Upload failed: ${err.message}`;
            console.error(error);
        } finally {
            fileIsLoading = false;
        }
    }

    async function fetchFromIPFS() {
        if (!fetchCID || !heliaState.helia) return;
        try {
            fileIsLoading = true;
            error = '';
            fetchedContent = null;
            const { fs } = heliaState.helia;
            const cidObj = CID.parse(fetchCID);

            // Collect all chunks into a Uint8Array
            const chunks = [];
            for await (const chunk of fs.cat(cidObj)) {
                chunks.push(chunk);
            }

            // Combine chunks
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const result = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }

            // Try to detect filename from metadata (optional)
            fetchedFileName = `file-${fetchCID.slice(0, 8)}`;
            fetchedContent = new Blob([result]);

        } catch (err) {
            error = `Fetch failed: ${err.message}`;
            console.error(error);
        } finally {
            fileIsLoading = false;
        }
    }

    function downloadFetchedFile() {
        if (!fetchedContent) return;
        const url = URL.createObjectURL(fetchedContent);
        const a = document.createElement('a');
        a.href = url;
        a.download = fetchedFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
</script>

<div>
    <!-- Node Controls -->
    {#if heliaState.helia}

        <!-- Upload Section -->
        <section>
            <h3>Upload to IPFS</h3>
            <input
                type="file"
                onchange={(e) => (file = e.target.files[0])}
                disabled={fileIsLoading}
            />
            <button
                onclick={uploadToIPFS}
                disabled={!file || fileIsLoading}
            >
                {fileIsLoading ? 'Uploading...' : 'Upload to IPFS'}
            </button>
            {#if resultCID}
                <div class="result-row">
                    <code>File CID: { resultCID }</code>
                    <button onclick={() => copyToClipboard(resultCID)}>&#xf0ea;</button>
                </div>
            {/if}
        </section>

        <hr />

        <!-- Fetch Section -->
        <section>
            <h3>Fetch from IPFS</h3>
            <input
                type="text"
                bind:value={fetchCID}
                placeholder="Enter CID to fetch"
                disabled={fileIsLoading}
            />
            <button
                onclick={fetchFromIPFS}
                disabled={!fetchCID || fileIsLoading}
            >
                {fileIsLoading ? 'Fetching...' : 'Fetch from IPFS'}
            </button>

            {#if fetchedContent}
                <p>File fetched successfully!</p>
                <p>Size: {(new Blob([downloadFetchedFile]).size / 1024)} KB</p>
                <button onclick={downloadFetchedFile}>
                    Download File
                </button>
            {/if}
        </section>
    {/if}

    {#if error}
        <p style="color: red">⚠️ {error}</p>
    {/if}
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    code {
        word-break: break-all;
    }

    hr {
        width: 100%;
        border: none;
        border-top: 1px solid #ccc;
    }
</style>


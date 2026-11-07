# Svelte + Vite

## Requirements

* [bun](https://bun.com)
* curl
* git
* Linux

## Instalation

First install bun: 

```sh
curl -fsSL https://bun.sh/install | bash
```

Clone the Repository and switch to it: 

```sh
git clone https://github.com/p1r/dapps-template.git && cd dapps-template
```

Then install the bun requirements:

```sh
bun install
```

## Build and Develop

Run the dapp in develop mode and verify it works:

```sh
bun --bun run dev --open
```
> Notice: this opens the project in your default web browser by using --open directive.

Once you are ready to deploy the changes you made, you can build with:
```sh
bun --bun run build
```

## Add and Pin the dapp into IPFS 

> First ensure you have a working version of kubo and a proper setup of the gateway 
> [more info...](https://decentralizedscience.org/Workshops/web3/)

After building the project with the previous command and ensuring the ipfs daemon is running.
Execute the following script:

```sh
./publishSite.sh
```

You will find in the output something as the following:

```sh
p1r0@somehost:~/dapps-template$ cat dist_dapps-template_CIDs.txt
added bafybeifoguewrudazdvdjeeu6mubmsqe4pxo5yxukdukegcveihhel27rm dist/assets/index-C3peGlvu.js
added bafkreieoq26q6nj37oxddht43s7bcormjctwgacdxuamyhzh5t5joofj3a dist/assets/index-DkyFjioG.css
added bafkreiguqzplhgimurkhp3ja5fdyanhihafysbxsvqiowo7jhn7fazmbla dist/index.html
added bafybeigb7iczeshfyw465bb5s7alnreqiadw6c6osxrgiuakufc6v3ahcq dist/assets
added bafybeif4cziqxii46gfi6cuggds2wak7c4hwry3say34qfnpsocdvmnpza dist
added bafybeiadp2pqcg7t5ehq6j4auwx5hxxkx5kfbuflu36e3d6hilmvylbige
```
in which is important to notice that we will use the dist CID for our DNSLink setup.

> Notice that if you want to unpin the previous version for a new one you should
> `ipfs pin rm bafybeiadp2pqcg7t5ehq6j4auwx5hxxkx5kfbuflu36e3d6hilmvylbige` which is the main CID 
which links all the static website assets.

## dnslink dapp with your dns provider

Add a txt cid registry at your dns and in which you set the host to _dnslink and value as follows:

```txt
dnslink=/ipfs/bafybeif4cziqxii46gfi6cuggds2wak7c4hwry3say34qfnpsocdvmnpza
```

> Notice remember to have a alias to a gateway address with the same domain name so that it 
resolves it

Setup the following in your nginx config at the gateway alias server you are pointing:

```sh
server {
        listen 80;
        server_name demo.decentralizedscience.org;
        large_client_header_buffers 16 5120k;

        location / {
                proxy_pass http://127.0.0.1:8080;
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
```
> you should enable the site after and then get a TLS certificate with something like certbot.


## License

GNU AFFERO GENERAL PUBLIC LICENSE
Version 3

## Acknowledgments

* p1r0

##  Support

For questions or issues, open an issue or email p1r0 at nethunters dot xyz.

Open an issue (or add a comment to an existing one) before you start to ensure the feature or fix is on track.


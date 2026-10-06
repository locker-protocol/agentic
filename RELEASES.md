# Releases

One version per release, the same for the four packages. Each release lists the tarball published on npm and its SHA-256, so that what you install can be checked against what was published.

What each version added is in [`CHANGELOG.md`](CHANGELOG.md).

## 2.0.2, 2026-10-06

| Package | Tarball | Size | SHA-256 |
|---|---|---|---|
| `@locker-protocol/agent-wallet-hyperliquid-trader` | `locker-protocol-agent-wallet-hyperliquid-trader-2.0.2.tgz` | 1 790 239 bytes | `cbd8ee51f233900c13e3b022cd6bcdb8b6cd167a390f0e2584a478ee4bdfce54` |
| `@locker-protocol/agent-wallet-hyperliquid-trader-mcp` | `locker-protocol-agent-wallet-hyperliquid-trader-mcp-2.0.2.tgz` | 69 812 bytes | `ca7b5b1ab485ac7533166ccb23a82529c5f5e24f4cdec62eef5f540ed597aecb` |
| `@locker-protocol/agent-wallet-hyperliquid-signer` | `locker-protocol-agent-wallet-hyperliquid-signer-2.0.2.tgz` | 155 178 bytes | `f1074d78488fd1c1c72f0b45287c0c63064d6b81488cd2d64365ad0c92eb5603` |
| `@locker-protocol/agent-wallet-vault` | `locker-protocol-agent-wallet-vault-2.0.2.tgz` | 41 588 bytes | `8b0f6de860046984c975fab3f78324461eecd930f0a5d96e9863723c214d39f9` |

## 2.0.1, 2026-10-06

Of this version only the signer reached the registry (the registry's own review held it for twenty-five minutes, and the publication of the three others was stopped so that the findings of the fourth pass could ship in one version, 2.0.2). The lines below are what was built and rehearsed; the signer at 2.0.1 on the registry holds these bytes, the three other tarballs were never sent.


| Package | Tarball | Size | SHA-256 |
|---|---|---|---|
| `@locker-protocol/agent-wallet-hyperliquid-trader` | `locker-protocol-agent-wallet-hyperliquid-trader-2.0.1.tgz` | 1 784 562 bytes | `a4d77ff51da030de7773e7dccbf95069f1eff448edfcc3bc88da924738d31b47` |
| `@locker-protocol/agent-wallet-hyperliquid-trader-mcp` | `locker-protocol-agent-wallet-hyperliquid-trader-mcp-2.0.1.tgz` | 69 225 bytes | `1d86b7136330995baaf4e1ab1be954b69bd392bc99cf7312e16659f8eb13bb9b` |
| `@locker-protocol/agent-wallet-hyperliquid-signer` | `locker-protocol-agent-wallet-hyperliquid-signer-2.0.1.tgz` | 153 982 bytes | `5a0be60b3af575b09b097effa077dfe1cf1741a30e8c233a51f01a366703c5db` |
| `@locker-protocol/agent-wallet-vault` | `locker-protocol-agent-wallet-vault-2.0.1.tgz` | 41 087 bytes | `1e093826cdfdf9e6ef1db408da7c117a80ce2c7900bf4b47cba787ea79ba0aae` |

## 2.0.0, 2026-10-05

| Package | Tarball | Size | SHA-256 |
|---|---|---|---|
| `@locker-protocol/agent-wallet-hyperliquid-trader` | `locker-protocol-agent-wallet-hyperliquid-trader-2.0.0.tgz` | 1 750 378 bytes | `dfdb4d6b4c9581dec7b6b8c6b717bcfacb5ea2e107f4096f70780ef39b4a9b67` |
| `@locker-protocol/agent-wallet-hyperliquid-trader-mcp` | `locker-protocol-agent-wallet-hyperliquid-trader-mcp-2.0.0.tgz` | 69 110 bytes | `1eb6fbffadd992dcaac3d7e79184c84398c868d5a713fc1a7c7821245b00779f` |
| `@locker-protocol/agent-wallet-hyperliquid-signer` | `locker-protocol-agent-wallet-hyperliquid-signer-2.0.0.tgz` | 154 822 bytes | `365b47e475304caac6c986c3dafe077caac836f6aed2a572f1d36cc1b15cb99d` |
| `@locker-protocol/agent-wallet-vault` | `locker-protocol-agent-wallet-vault-2.0.0.tgz` | 41 885 bytes | `5b852b3f40cdef5999cad37320cd1859f248d024944ec741d0090388fd22fb78` |

## Checking a release yourself

`npm pack <package>@<version>` downloads the tarball the registry holds and writes it as it is, without unpacking or rebuilding it. Hash that file and compare it with the line above:

```sh
npm pack @locker-protocol/agent-wallet-hyperliquid-trader@2.0.2
shasum -a 256 locker-protocol-agent-wallet-hyperliquid-trader-2.0.2.tgz
```

On Windows (PowerShell), `Get-FileHash -Algorithm SHA256 .\locker-protocol-agent-wallet-hyperliquid-trader-2.0.2.tgz`.

The registry publishes its own checksum of the same file, which is a second, independent reading:

```sh
npm view @locker-protocol/agent-wallet-hyperliquid-trader@2.0.2 dist.integrity dist.shasum
```

If your hash and the line above disagree, do not install the package, and write to the address in [`SECURITY.md`](SECURITY.md).

## How the hash gets here

The source of the four packages is not published, so the tarball cannot be rebuilt from this repository. What is done instead, before every release, is this:

- each package is built and packed, then built again from a clean build and packed again, and the two tarballs must be identical byte for byte. A package whose two builds differ does not ship;
- the same run checks that the tarball holds the code of each entry point, one declaration file for each format, the launcher, the licence and the README, and nothing else: no source, no source map and no test;
- `@arethetypeswrong/cli` and `publint` must find nothing, a consumer project outside the tree must install the tarball and compile against it in strict mode, in ESM and in CommonJS, and the four tarballs installed in an empty folder must answer: the command, the MCP server and the libraries;
- the SHA-256 printed by that run is the one written above, and it is the hash of the file that is then published.

The lines of the table are produced from the packed tarballs by `scripts/release-hashes.mjs` in the build tree, which reads the four `package.json` files, finds each tarball by the name `npm pack` gives it, and prints the row and, with `--sums`, a `sha256sum` block.

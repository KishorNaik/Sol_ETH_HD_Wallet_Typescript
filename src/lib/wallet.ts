import Wallet, { hdkey } from "ethereumjs-wallet";

export interface GenerateWalletOptions {
  seed: Buffer;
  path: number;
}

export interface GenerateWalletResult {
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface IEthereumWallet {
  generateWalletAsync(
    params: GenerateWalletOptions
  ): Promise<GenerateWalletResult>;
}

export class EthereumWallet implements IEthereumWallet {
  public generateWalletAsync(
    params: GenerateWalletOptions
  ): Promise<GenerateWalletResult> {
    return new Promise((resolve, reject) => {
      try {
        // Get Seed and Path
        const { seed, path } = params;

        const hdWallet = hdkey.fromMasterSeed(seed);

        const wallet_hdpath = "m/44'/60'/0'/0/";
        const wallet_hdpath_extended = wallet_hdpath + path;
        const wallet = hdWallet.derivePath(wallet_hdpath_extended);

        // Get Wallet Object
        const getWallet: Wallet = wallet.getWallet();

        // Get Private Keys
        const privateKey: string = getWallet.getPrivateKeyString();

        // Get Public Keys
        const publicKey: string = getWallet.getPublicKeyString();

        // Get ETh Address
        const address: string = getWallet.getAddressString();

        const result: GenerateWalletResult = {
          address,
          privateKey,
          publicKey,
        };
        resolve(result);
      } catch (ex) {
        reject(ex);
      }
    });
  }
}

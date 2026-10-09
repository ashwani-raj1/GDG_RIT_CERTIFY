let pinata;

async function getPinata() {
  if (!pinata) {
    const { PinataSDK } = await import("pinata");

    pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT,
      pinataGateway: process.env.PINATA_GATEWAY,
    });
  }

  return pinata;
}

module.exports = { getPinata };
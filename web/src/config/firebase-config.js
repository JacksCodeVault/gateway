const admin = require('firebase-admin');

const serviceAccount = {
  type: "service_account",
  project_id: "sms-sync-bridge",
  private_key_id: "8079360618ea7a89d3a937b456a132d64b39abd1",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCax9L1I3lnwdfn\nqSchc/k/V72DXJiHrz78C5dRLnlnLDc2xa/1TBYCxU52uRUgUiLAoThBeMq88uu3\nGHkplucGJlXAJd+y9pKKXpnfgVQp60Hv3QNX7P/79rGH8X1rNDVUQAcuLJGLju/X\n5KetkRjuf9s1gumZYLHioq2Zwo2r/nOdHlvgt6FINNKHhIC5fZRyW4J6ZPRHPguB\nhriPccrcguJ9LzuwQ18iRieZjxKIRSCxww/a8hxfg1PIZ4IWva9T5vB4Mzi0VxB8\nm2yUHA0cgt4VJL9L/JozFL/RKKxYrKXyyMR3U8zt/5iN5LEP+gLbtofShfFXYGRl\ng/uzWZqPAgMBAAECgf9irYWsHrA/eOytKHz0vVlPlE4fDgM2RSBGNUsYrK1p/+t3\n4K1WMDRsHgN5NfgXZ0vAsROKWowlI04kCYov1LKigC7m/0nPPeb2P2rDnyTkViw5\nKWHTVHYMhWVDPaoQP+CM0yjR0q8DR52bytMQtayHn85uV8DrjbdHOsT7UJOm0UEp\n00mlGZzqjbq9/4GID/VDlPRTb+GtuPVCdEesqu1HTJnMHGhlAvkIAQbXYI4U4fy5\n+ZCD52xw9kcIh1glGA7806NUvWDVHu3lG+ZSVAzqUwyr47ODcX84oyBG56UjWYyt\nkIP9pHssOmLczM+k4HolzNR1P0Apr+mM3pJ0I9kCgYEA2fevm31hVZBePx4i1J5W\nydPvlMeztM82B+qpNaHTzMIYm1Lu+n9u+z542AkRsuq+tTiaBPlcf5Xw6I1PWW7Y\nt0XCsB+ZaFVMsyz1LhbtbbdeGomH/vAgu8Vl9nRNXXqwDAWEbd6LGyz/hHuKpJY7\n6NR9nZPZMmvLdtAiSeTHM2kCgYEAtcmpgiWgV/8r0HN7QDKf3OB/jvbvu6dcAwZe\nLDI+XO0dGrqkG/A6e31lhfA7rPknksJLokJKH4N7TCEQj3hgvL3kLkCesln4a9sw\nDkUf4zVuJ/Rhc7A+vTJN4eENRkKSYSwo+AzeMTdAl3D9cV3pV5kGnjy91EEGNtgt\nTkYyNzcCgYBQvtbJDTt/jQm87BcPGNEh12dLgGdsNc7YQ/AHNDnYApdHAwQQvCCK\n5mux7DooQ5n+XEeCTDYd9ZfXLnIUuWGDE066HBqicecGAUOanVe7a1BrGEPPB3m4\n1bmeARuf45FQAsM6SFTT7mmB1JpZumXbLMyUEW9GpHQtQZFSOnQo8QKBgQCnIMvy\nl10fCb3iWwlJMEHA87TSXzxwLaFuNoCF6XtkO6qyVD1kYiuiNNsNlJuIn1g+mNqo\nRoGXD25fw1ZSUL2/SGVsEITWO9kkb9NyiyKR5SFtIkQl9Db6AjGQJTPrEHE7XTod\nMtdkMAP2Ny8K9uf8XPe0qutrJIzuBzk/6VFpaQKBgACdZe9xTrReQXgJctkNxEQa\nXV97fZmE8skBWRxt+kGsKFGPA9+iQO8HzFqPUeyLZYxzjXicOS7XyTdoo5gwYUpG\nWORiXB/bxhX1GFWMBjX8AI7gUKvfDlW2KMQlllE/ENbW2iASJXpXVDztl11zNiYs\nkfwgz2ak3UNXsSE/8V8f\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-sxzkp@sms-sync-bridge.iam.gserviceaccount.com",
  client_id: "103211901258721144003",
  auth_uri: "https://accounts.google.com/o/oauth2/auth", 
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-sxzkp%40sms-sync-bridge.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

function initializeFirebase() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sms-sync-bridge-default-rtdb.firebaseio.com"
  });
}

module.exports = { initializeFirebase };

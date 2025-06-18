import { createClient } from '@privy-io/react-auth';

export const privy = createClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  config: {
    embeddedWallets: true,
    loginMethods: ['wallet', 'twitter'],
  },
});

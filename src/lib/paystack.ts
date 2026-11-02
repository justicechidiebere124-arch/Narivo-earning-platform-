/**
 * NARIVO Paystack Integration Architecture Guide & Helper
 * 
 * Paystack in Nigeria handles:
 * 1. Bank Account Name Resolution (NIP Account lookup before withdrawal)
 * 2. Transfer Recipient Creation
 * 3. Transfer Finalization (Direct disbursement to Nigerian commercial banks & MFBs)
 * 4. Webhook Event Handling (charge.success, transfer.success, transfer.failed, transfer.reversed)
 * 
 * IMPORTANT SECURITY RULE:
 * Paystack Secret Key (PAYSTACK_SECRET_KEY) must NEVER be exposed in client code.
 * All transfer requests and resolution requests must route through an authenticated backend route (/api/withdrawals/resolve or /api/withdrawals/payout).
 */

export interface PaystackAccountResolveResult {
  account_number: string;
  account_name: string;
  bank_id?: number;
}

export interface PaystackTransferPayload {
  source: 'balance';
  amount: number; // in kobo (100 kobo = 1 Naira)
  recipient: string; // Transfer recipient code from Paystack
  reason: string;
  reference: string;
}

/**
 * Client-safe simulator for account resolution during interactive prototyping.
 * In production, the client calls `POST /api/bank/resolve` which queries `https://api.paystack.co/bank/resolve`.
 */
export const simulateAccountResolution = async (
  accountNumber: string,
  bankName: string
): Promise<{ success: boolean; accountName?: string; error?: string }> => {
  // Simulate network latency (200-500ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!accountNumber || accountNumber.length !== 10) {
    return {
      success: false,
      error: 'Nigerian NUBAN account number must be exactly 10 digits.',
    };
  }

  // Realistic mock resolver for demo evaluation
  const mockNames = [
    'JUSTICE CHIDIEBERE OKOYE',
    'CHUKWUDI E. NWANERI',
    'FATIMA BELLO SULEIMAN',
    'OLUMIDE K. ADEBAYO',
    'NGOZI ADAEZE OKONKWO',
  ];

  // Deterministic mock name based on last digit
  const lastDigit = parseInt(accountNumber.slice(-1), 10) || 0;
  const resolvedName = mockNames[lastDigit % mockNames.length];

  return {
    success: true,
    accountName: resolvedName,
  };
};

export const PAYSTACK_INTEGRATION_CHECKLIST = [
  {
    step: '1. Paystack Business Registration',
    desc: 'Register a verified business account at paystack.com to access Transfers and NIP payouts.',
  },
  {
    step: '2. Enable Transfers & Top Up Balance',
    desc: 'Enable the Transfers feature on Paystack Dashboard and fund the business balance via NIP transfer.',
  },
  {
    step: '3. Store Secret Keys on Server Only',
    desc: 'Set PAYSTACK_SECRET_KEY in server environment variables or Supabase Edge Functions secret vault.',
  },
  {
    step: '4. Setup NUBAN Resolution Route',
    desc: 'Proxy `GET https://api.paystack.co/bank/resolve?account_number=...&bank_code=...` with Bearer auth.',
  },
  {
    step: '5. Setup Webhook Endpoint',
    desc: 'Handle `transfer.success` and `transfer.failed` with Paystack HMAC SHA512 signature validation.',
  },
];

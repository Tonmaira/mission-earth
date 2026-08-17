import CredentialDeck from "@/components/credential/CredentialDeck";

/*
 * The generic deck: no client on it. A pitch gets its own link instead —
 * /credential/<slug>, listed in components/credential/clients.js.
 */
export default function CredentialPage() {
  return <CredentialDeck />;
}

import { notFound } from "next/navigation";
import CredentialDeck from "@/components/credential/CredentialDeck";
import { clientName, clientSlugs } from "@/components/credential/clients";

/*
 * A client's own link to the deck: /credential/<slug>.
 *
 * The name shown on every slide comes from the slug, resolved against the list
 * in clients.js — so it can only ever be a name we issued a link for. A slug
 * that isn't on the list is a 404, not a deck with an invented client on it.
 */

export function generateStaticParams() {
  return clientSlugs().map((client) => ({ client }));
}

// `params` is a promise in this Next version — awaited, not read directly
export async function generateMetadata({ params }) {
  const { client } = await params;
  const name = clientName(client);
  return {
    title: name ? `Credentials for ${name} | Mission Earth` : "Credentials | Mission Earth",
  };
}

export default async function CredentialForClientPage({ params }) {
  const { client } = await params;
  const name = clientName(client);
  if (!name) notFound();

  return <CredentialDeck preparedFor={name} />;
}

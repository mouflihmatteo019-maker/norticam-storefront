import { useState, type FormEvent } from "react";
import StorefrontLayout from "@/components/StorefrontLayout";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "@/components/Navigation";
import { trackEvent } from "@/lib/analytics";
import { themeRuntime } from '@/lib/theme-runtime';

const supportEmail = "contact@norticam.com";
type State = "idle" | "sending" | "sent" | "error" | "mailto";

export default function Contact() {
  const [state, setState] = useState<State>("idle");
  const configuredEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT as
    | string
    | undefined;
  const endpoint = configuredEndpoint?.startsWith("https://")
    ? configuredEndpoint
    : undefined;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = Object.fromEntries(values.entries());
    if (!endpoint) {
      const body = `Nom : ${payload.name}\nE-mail : ${payload.email}\nCommande : ${payload.order || "Non renseignée"}\n\n${payload.message}`;
      trackEvent("contact_email_opened");
      setState("mailto");
      window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(`NORTICAM — ${payload.subject}`)}&body=${encodeURIComponent(body)}`;
      return;
    }
    setState("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("send_failed");
      trackEvent("contact_form_submit");
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }
  if (themeRuntime()?.contactForm) return <StorefrontLayout><div dangerouslySetInnerHTML={{__html:themeRuntime()!.contactForm}} /></StorefrontLayout>;
  return (
    <StorefrontLayout>
      <SEOHead
        title="Contact NORTICAM : conseil dashcam et aide commande"
        description="Une question sur une dashcam ou votre commande ? Contactez NORTICAM à contact@norticam.com et retrouvez le suivi de colis."
      />
      <section className="container max-w-5xl py-14 sm:py-20">
        <p className="eyebrow">NORTICAM · À votre écoute</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="mt-6 max-w-2xl leading-8 text-slate-600">
          Un conseil avant achat, une question d’installation ou une commande à
          retrouver ? Précisez votre modèle et votre véhicule pour nous aider à
          vous répondre.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-6">
            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <h2 className="text-xl font-bold">Écrivez à NORTICAM</h2>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-4 inline-block break-all font-bold text-[#75b8ff]"
              >
                {supportEmail}
              </a>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                N’envoyez jamais de mot de passe ni de coordonnées bancaires.
                Pour une commande, son numéro et l’adresse email utilisée
                suffisent.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <h2 className="text-xl font-bold">Vous attendez un colis ?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Retrouvez les informations de suivi et les étapes à vérifier
                après votre achat.
              </p>
              <Link href="/suivi-colis/" className="btn-secondary mt-5">
                Suivre ma commande
              </Link>
            </div>
          </aside>
          <form
            onSubmit={submit}
            className="space-y-5 rounded-2xl bg-white p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold">Envoyer un message</h2>
            <p className="text-sm leading-6 text-slate-600">
              {endpoint
                ? "Votre message est transmis à notre support."
                : "Votre message s’ouvrira dans votre application email pour que vous puissiez l’envoyer."}
            </p>
            <label className="block text-sm font-semibold">
              Votre nom
              <input
                name="name"
                required
                autoComplete="name"
                maxLength={100}
                className="mt-2 w-full rounded-xl border border-slate-300 p-3"
              />
            </label>
            <label className="block text-sm font-semibold">
              Votre email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={254}
                className="mt-2 w-full rounded-xl border border-slate-300 p-3"
              />
            </label>
            <label className="block text-sm font-semibold">
              Objet
              <select
                name="subject"
                className="mt-2 w-full rounded-xl border border-slate-300 p-3"
              >
                <option>Conseil avant achat</option>
                <option>Installation et compatibilité</option>
                <option>Question sur ma commande</option>
                <option>Retour ou assistance</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Numéro de commande{" "}
              <span className="font-normal">(facultatif)</span>
              <input
                name="order"
                maxLength={50}
                className="mt-2 w-full rounded-xl border border-slate-300 p-3"
              />
            </label>
            <label className="block text-sm font-semibold">
              Votre message
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={2500}
                rows={6}
                className="mt-2 w-full rounded-xl border border-slate-300 p-3"
              />
            </label>
            <button
              disabled={state === "sending"}
              className="btn-primary disabled:opacity-60"
              type="submit"
            >
              {state === "sending"
                ? "Envoi en cours…"
                : endpoint
                  ? "Envoyer mon message"
                  : "Ouvrir mon email pour envoyer"}
            </button>
            {state === "sent" && (
              <p
                role="status"
                className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"
              >
                Votre message a bien été transmis à NORTICAM.
              </p>
            )}
            {state === "error" && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-900"
              >
                L’envoi n’a pas abouti. Écrivez-nous directement à{" "}
                {supportEmail}.
              </p>
            )}
            {state === "mailto" && (
              <p
                role="status"
                className="rounded-xl bg-blue-50 p-4 text-sm leading-6"
              >
                Votre message est prêt dans votre messagerie. S’il ne s’ouvre
                pas, écrivez directement à {supportEmail}.
              </p>
            )}
            <p className="text-xs leading-6 text-slate-500">
              Les données ne sont transmises à NORTICAM qu’au moment où vous
              envoyez votre message.{" "}
              <Link href="/informations/confidentialite/" className="underline">
                Confidentialité
              </Link>
            </p>
          </form>
        </div>
      </section>
    </StorefrontLayout>
  );
}

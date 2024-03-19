import turnstilePlugin from "@cloudflare/pages-plugin-turnstile";

/**
 * POST /api/submit-with-plugin
 */

export const onRequestPost = [
        turnstilePlugin({
        // This is the demo secret key. In prod, we recommend you store
        // your secret key(s) safely.
        secret: "0x4AAAAAAAVKDcNri64lv50_A4eF-Z6WFKY",
        }),
        (async (context) => {
          // Request has been validated as coming from a human
          const formData = await context.request.formData()
          // Additional solve metadata data is available at context.data.turnstile
          return new Response(`Successfully verified! ${JSON.stringify(context.data.turnstile)}`)
        })
];

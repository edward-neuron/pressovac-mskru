import { supabase } from '@/integrations/supabase/client';

/**
 * Wraps supabase.functions.invoke with a hard timeout so the UI never hangs
 * forever when an Edge Function fails to respond (network drop, proxy, RKN/VPN
 * interference, etc.). On timeout the returned `error` field is populated and
 * callers can show the standard tech-works alert.
 */
export async function invokeWithTimeout<TBody = unknown, TResp = unknown>(
  functionName: string,
  options: { body?: TBody } = {},
  timeoutMs = 30_000,
): Promise<{ data: TResp | null; error: Error | null }> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) => {
    timer = setTimeout(() => {
      resolve({
        data: null,
        error: new Error(
          'Превышено время ожидания ответа сервера. Попробуйте позже или свяжитесь с нами по email.',
        ),
      });
    }, timeoutMs);
  });

  try {
    const result = (await Promise.race([
      supabase.functions.invoke(functionName, options as any),
      timeoutPromise,
    ])) as { data: TResp | null; error: Error | null };
    return result;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY");

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (input: string) =>
  input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

interface InquiryRequest {
  company?: string;
  contactPerson?: string;
  name?: string;
  phone: string;
  email: string;
  businessType?: string;
  experience?: string;
  ventilationTypes?: string[];
  equipmentTypes?: string[];
  budget?: string;
  comments?: string;
  message?: string;
  needsTraining?: boolean;
  attachmentUrl?: string;
  attachmentPath?: string;
  attachmentFileName?: string;
  subject?: string;
  turnstileToken?: string; // Cloudflare Turnstile token
}

// Verify Turnstile token with Cloudflare
async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.warn("TURNSTILE_SECRET_KEY not configured, skipping verification");
    return true; // Allow if not configured (for development)
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    const result = await response.json();
    console.log("Turnstile verification result:", { success: result.success, errorCodes: result["error-codes"] });
    
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InquiryRequest = await req.json();

    // Verify Turnstile token first
    const turnstileToken = (data.turnstileToken || "").trim();
    if (!turnstileToken) {
      console.error("Turnstile token missing");
      return new Response(
        JSON.stringify({ error: "Пожалуйста, подтвердите, что вы не робот" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      console.error("Turnstile verification failed");
      return new Response(
        JSON.stringify({ error: "Проверка безопасности не пройдена. Попробуйте обновить страницу." }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Turnstile verification passed");

    // Support both contactPerson and name fields
    const contactNameRaw = (data.contactPerson || data.name || "").trim();
    const messageContentRaw = (data.comments || data.message || "").trim();
    const emailRaw = (data.email || "").trim();
    const phoneRaw = (data.phone || "").trim();

    const emailSubjectRaw = (data.subject || `Заявка на подбор оборудования от ${contactNameRaw || "клиента"}`)
      .replace(/[\r\n]+/g, " ")
      .trim()
      .slice(0, 200);

    // Validate required fields
    if (!contactNameRaw || !phoneRaw || !emailRaw) {
      console.error("Validation failed: missing required fields");
      return new Response(
        JSON.stringify({ error: "Заполните обязательные поля" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize user-provided fields (for safe HTML email rendering)
    const contactName = escapeHtml(contactNameRaw.slice(0, 120));
    const company = escapeHtml((data.company || "").trim().slice(0, 160)) || "Не указано";
    const phone = escapeHtml(phoneRaw.slice(0, 60));
    const email = escapeHtml(emailRaw.slice(0, 255));
    const messageContent = escapeHtml(messageContentRaw.slice(0, 5000));
    const businessType = escapeHtml((data.businessType || "").trim().slice(0, 120));
    const experience = escapeHtml((data.experience || "").trim().slice(0, 120));
    const budget = escapeHtml((data.budget || "").trim().slice(0, 120));
    const emailSubject = escapeHtml(emailSubjectRaw.slice(0, 200));

    console.log("Received inquiry:", {
      hasAttachment: Boolean(data.attachmentUrl),
      hasVentilation: Boolean(data.ventilationTypes?.length),
      hasEquipment: Boolean(data.equipmentTypes?.length),
      needsTraining: data.needsTraining,
    });

    const ventilationList = data.ventilationTypes?.length 
      ? data.ventilationTypes.join(", ") 
      : "Не указано";
    
    const equipmentList = data.equipmentTypes?.length 
      ? data.equipmentTypes.join(", ") 
      : "Не указано";

    const attachmentPath = (data.attachmentPath || "").trim();
    const attachmentFileName = escapeHtml((data.attachmentFileName || "").trim().slice(0, 255));
    let attachmentUrlResolved = (data.attachmentUrl || "").trim();

    if (!attachmentUrlResolved && attachmentPath) {
      const { data: signed, error: signedError } = await supabaseAdmin.storage
        .from("inquiry-attachments")
        .createSignedUrl(attachmentPath, 60 * 60 * 24 * 7); // 7 days

      if (signedError) {
        console.error("Signed URL error:", signedError);
      } else {
        attachmentUrlResolved = signed?.signedUrl ?? "";
      }
    }

    const attachmentUrlSafe = escapeHtml(attachmentUrlResolved);
    
    // Show friendly file name with a download button instead of raw URL
    const displayFileName = attachmentFileName || attachmentPath.split('/').pop() || "Файл";
    const fileExtension = displayFileName.split('.').pop()?.toLowerCase() || "";
    
    const attachmentSection = attachmentUrlResolved
      ? `<p><strong>Прикреплённый файл:</strong></p>
         <table cellpadding="0" cellspacing="0" border="0" style="margin: 10px 0;">
           <tr>
             <td style="background-color: #0066cc; border-radius: 6px;">
               <a href="${attachmentUrlSafe}" 
                  style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px;"
                  target="_blank">
                 📎 Скачать: ${displayFileName}
               </a>
             </td>
           </tr>
         </table>
         <p style="color: #666; font-size: 12px; margin-top: 4px;">Тип файла: .${fileExtension} | Ссылка действительна 7 дней</p>`
      : "";

    const emailHtml = `
      <h1>${emailSubject}</h1>
      
      <h2>Контактная информация</h2>
      <ul>
        <li><strong>Компания:</strong> ${company}</li>
        <li><strong>Контактное лицо:</strong> ${contactName}</li>
        <li><strong>Телефон:</strong> ${phone}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      
      ${businessType || experience ? `
      <h2>Информация о деятельности</h2>
      <ul>
        <li><strong>Сфера деятельности:</strong> ${businessType || "Не указано"}</li>
        <li><strong>Опыт работы:</strong> ${experience || "Не указано"}</li>
      </ul>
      ` : ""}
      
      ${(data.ventilationTypes?.length || data.equipmentTypes?.length || budget) ? `
      <h2>Потребности в оборудовании</h2>
      <ul>
        <li><strong>Типы вентиляционных систем:</strong> ${ventilationList}</li>
        <li><strong>Интересующее оборудование:</strong> ${equipmentList}</li>
        <li><strong>Планируемый бюджет:</strong> ${budget || "Не указано"}</li>
      </ul>
      ` : ""}
      
      <h2>Дополнительная информация</h2>
      <p><strong>Сообщение:</strong> ${messageContent || "Нет комментариев"}</p>
      ${data.needsTraining !== undefined ? `<p><strong>Интересует обучение:</strong> ${data.needsTraining ? "Да" : "Нет"}</p>` : ""}
      ${attachmentSection}
      
      <hr>
      <p style="color: #666; font-size: 12px;">
        Заявка отправлена с сайта pressovac-moscow.ru (проверка Turnstile пройдена ✓)
      </p>
    `;

    console.log("Sending email to sales@pressovac-moscow.ru");

    // Send email to sales team
    const { data: salesData, error: salesError } = await resend.emails.send({
      from: "Pressovac Moscow <info@pressovac-moscow.ru>",
      to: ["sales@pressovac-moscow.ru"],
      subject: emailSubjectRaw, // use raw subject for email headers
      html: emailHtml,
    });

    if (salesError) {
      console.error("Resend sales email error:", salesError);
      throw salesError;
    }

    console.log("Sales email sent successfully:", salesData);

    // Send confirmation email to client
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">
          Ваше сообщение отправлено компании ООО "ВЕКОНТ-М"
        </h1>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Представитель компании свяжется с вами в ближайшее время.
        </p>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Спасибо за ваш интерес к продукции Pressovac!
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        
        <p style="color: #999; font-size: 12px;">
          Это автоматическое сообщение. Пожалуйста, не отвечайте на него.
        </p>
        
        <p style="color: #999; font-size: 12px;">
          С уважением,<br>
          Команда Pressovac Moscow<br>
          <a href="https://pressovac-moscow.ru" style="color: #0066cc;">pressovac-moscow.ru</a>
        </p>
      </div>
    `;

    const { data: clientData, error: clientError } = await resend.emails.send({
      from: "Pressovac Moscow <info@pressovac-moscow.ru>",
      to: [emailRaw],
      subject: "Ваша заявка получена — Pressovac Moscow",
      html: clientEmailHtml,
    });

    if (clientError) {
      console.error("Resend client email error:", clientError);
      throw clientError;
    }

    console.log("Client confirmation email sent successfully:", clientData);

    return new Response(JSON.stringify({ success: true, salesId: salesData?.id, clientId: clientData?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-inquiry function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

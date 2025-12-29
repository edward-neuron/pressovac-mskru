import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryRequest {
  company?: string;
  contactPerson?: string;
  name?: string; // Alternative to contactPerson (from callback form)
  phone: string;
  email: string;
  businessType?: string;
  experience?: string;
  ventilationTypes?: string[];
  equipmentTypes?: string[];
  budget?: string;
  comments?: string;
  message?: string; // Alternative to comments (from callback form)
  needsTraining?: boolean;
  attachmentUrl?: string;
  subject?: string; // Custom subject from callback form
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InquiryRequest = await req.json();
    console.log("Received inquiry:", JSON.stringify(data));

    // Support both contactPerson and name fields
    const contactName = data.contactPerson || data.name || "Не указано";
    const messageContent = data.comments || data.message || "";
    const emailSubject = data.subject || `Заявка на подбор оборудования от ${contactName}`;

    // Validate required fields
    if (!contactName || contactName === "Не указано" || !data.phone || !data.email) {
      console.error("Validation failed: missing required fields");
      return new Response(
        JSON.stringify({ error: "Заполните обязательные поля" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const ventilationList = data.ventilationTypes?.length 
      ? data.ventilationTypes.join(", ") 
      : "Не указано";
    
    const equipmentList = data.equipmentTypes?.length 
      ? data.equipmentTypes.join(", ") 
      : "Не указано";

    const attachmentSection = data.attachmentUrl 
      ? `<p><strong>Прикреплённый файл:</strong> <a href="${data.attachmentUrl}">${data.attachmentUrl}</a></p>`
      : "";

    const emailHtml = `
      <h1>${emailSubject}</h1>
      
      <h2>Контактная информация</h2>
      <ul>
        <li><strong>Компания:</strong> ${data.company || "Не указано"}</li>
        <li><strong>Контактное лицо:</strong> ${contactName}</li>
        <li><strong>Телефон:</strong> ${data.phone}</li>
        <li><strong>Email:</strong> ${data.email}</li>
      </ul>
      
      ${data.businessType || data.experience ? `
      <h2>Информация о деятельности</h2>
      <ul>
        <li><strong>Сфера деятельности:</strong> ${data.businessType || "Не указано"}</li>
        <li><strong>Опыт работы:</strong> ${data.experience || "Не указано"}</li>
      </ul>
      ` : ""}
      
      ${data.ventilationTypes?.length || data.equipmentTypes?.length || data.budget ? `
      <h2>Потребности в оборудовании</h2>
      <ul>
        <li><strong>Типы вентиляционных систем:</strong> ${ventilationList}</li>
        <li><strong>Интересующее оборудование:</strong> ${equipmentList}</li>
        <li><strong>Планируемый бюджет:</strong> ${data.budget || "Не указано"}</li>
      </ul>
      ` : ""}
      
      <h2>Дополнительная информация</h2>
      <p><strong>Сообщение:</strong> ${messageContent || "Нет комментариев"}</p>
      ${data.needsTraining !== undefined ? `<p><strong>Интересует обучение:</strong> ${data.needsTraining ? "Да" : "Нет"}</p>` : ""}
      ${attachmentSection}
      
      <hr>
      <p style="color: #666; font-size: 12px;">
        Заявка отправлена с сайта pressovac-moscow.ru
      </p>
    `;

    console.log("Sending email to sales@pressovac-moscow.ru");

    // Send email to sales team
    const salesEmailResponse = await resend.emails.send({
      from: "Pressovac Moscow <info@pressovac-moscow.ru>",
      to: ["sales@pressovac-moscow.ru"],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Sales email sent successfully:", salesEmailResponse);

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

    const clientEmailResponse = await resend.emails.send({
      from: "Pressovac Moscow <info@pressovac-moscow.ru>",
      to: [data.email],
      subject: "Ваша заявка получена — Pressovac Moscow",
      html: clientEmailHtml,
    });

    console.log("Client confirmation email sent successfully:", clientEmailResponse);

    return new Response(JSON.stringify({ success: true }), {
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

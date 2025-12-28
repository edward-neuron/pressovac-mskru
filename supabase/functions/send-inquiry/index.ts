import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryRequest {
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessType: string;
  experience: string;
  ventilationTypes: string[];
  equipmentTypes: string[];
  budget: string;
  comments: string;
  needsTraining: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InquiryRequest = await req.json();
    console.log("Received inquiry:", data);

    // Validate required fields
    if (!data.contactPerson || !data.phone || !data.email) {
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

    const emailHtml = `
      <h1>Новая заявка на подбор оборудования</h1>
      
      <h2>Контактная информация</h2>
      <ul>
        <li><strong>Компания:</strong> ${data.company || "Не указано"}</li>
        <li><strong>Контактное лицо:</strong> ${data.contactPerson}</li>
        <li><strong>Телефон:</strong> ${data.phone}</li>
        <li><strong>Email:</strong> ${data.email}</li>
      </ul>
      
      <h2>Информация о деятельности</h2>
      <ul>
        <li><strong>Сфера деятельности:</strong> ${data.businessType || "Не указано"}</li>
        <li><strong>Опыт работы:</strong> ${data.experience || "Не указано"}</li>
      </ul>
      
      <h2>Потребности в оборудовании</h2>
      <ul>
        <li><strong>Типы вентиляционных систем:</strong> ${ventilationList}</li>
        <li><strong>Интересующее оборудование:</strong> ${equipmentList}</li>
        <li><strong>Планируемый бюджет:</strong> ${data.budget || "Не указано"}</li>
      </ul>
      
      <h2>Дополнительная информация</h2>
      <p><strong>Комментарии:</strong> ${data.comments || "Нет комментариев"}</p>
      <p><strong>Интересует обучение:</strong> ${data.needsTraining ? "Да" : "Нет"}</p>
      
      <hr>
      <p style="color: #666; font-size: 12px;">
        Заявка отправлена с сайта pressovac-moscow.ru
      </p>
    `;

    console.log("Sending email to sales@pressovac-moscow.ru");

    const emailResponse = await resend.emails.send({
      from: "Pressovac Moscow <onboarding@resend.dev>",
      to: ["sales@pressovac-moscow.ru"],
      subject: `Заявка на подбор оборудования от ${data.contactPerson}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

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

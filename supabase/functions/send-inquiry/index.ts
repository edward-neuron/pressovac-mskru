import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

interface OrderItem {
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface InquiryRequest {
  type?: string; // e.g. quick-contact, inquiry, callback, store-order
  orderNumber?: string;
  company?: string;
  contactPerson?: string;
  name?: string;
  phone: string;
  email?: string;
  location?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  businessType?: string;
  experience?: string;
  ventilationTypes?: string[];
  equipmentTypes?: string[];
  budget?: string;
  comments?: string;
  message?: string;
  needsTraining?: boolean;
  callbackRequested?: boolean;
  orderItems?: OrderItem[];
  totalPrice?: number;
  attachmentUrl?: string;
  attachmentPath?: string;
  attachmentFileName?: string;
  subject?: string;
  /** @deprecated kept for backward compatibility — ignored by server */
  turnstileToken?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InquiryRequest = await req.json();

    const typeRaw = (data.type || "").trim();
    const isStoreOrder = typeRaw === "store-order";

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
    const requiresEmail = typeRaw !== "quick-contact";
    if (!contactNameRaw || !phoneRaw || (requiresEmail && !emailRaw)) {
      console.error("Validation failed: missing required fields");
      return new Response(
        JSON.stringify({ error: "Заполните обязательные поля" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize user-provided fields
    const contactName = escapeHtml(contactNameRaw.slice(0, 120));
    const company = escapeHtml((data.company || "").trim().slice(0, 160)) || "Не указано";
    const phone = escapeHtml(phoneRaw.slice(0, 60));
    const email = escapeHtml(emailRaw.slice(0, 255));
    const messageContent = escapeHtml(messageContentRaw.slice(0, 5000));
    const businessType = escapeHtml((data.businessType || "").trim().slice(0, 120));
    const experience = escapeHtml((data.experience || "").trim().slice(0, 120));
    const budget = escapeHtml((data.budget || "").trim().slice(0, 120));
    const location = escapeHtml((data.location || "").trim().slice(0, 200));
    const paymentMethod = escapeHtml((data.paymentMethod || "").trim().slice(0, 100));
    const deliveryMethod = escapeHtml((data.deliveryMethod || "").trim().slice(0, 100));
    const orderNumber = escapeHtml((data.orderNumber || "").trim().slice(0, 50));
    const emailSubject = escapeHtml(emailSubjectRaw.slice(0, 200));

    console.log("Received inquiry:", {
      type: typeRaw,
      hasAttachment: Boolean(data.attachmentPath),
      hasOrderItems: Boolean(data.orderItems?.length),
      orderNumber: orderNumber || undefined,
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
      // Server-side validation of uploaded file (type + size).
      // Cannot trust client checks alone.
      const ALLOWED_MIMETYPES = new Set([
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]);
      const MAX_BYTES = 10 * 1024 * 1024;

      const lastSlash = attachmentPath.lastIndexOf("/");
      const dir = lastSlash >= 0 ? attachmentPath.slice(0, lastSlash) : "";
      const baseName = lastSlash >= 0 ? attachmentPath.slice(lastSlash + 1) : attachmentPath;

      const { data: listed, error: listError } = await supabaseAdmin.storage
        .from("inquiry-attachments")
        .list(dir, { search: baseName, limit: 1 });

      if (listError || !listed || listed.length === 0) {
        console.error("Attachment lookup failed:", listError);
        return new Response(
          JSON.stringify({ error: "Файл не найден" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const meta = listed[0].metadata as { size?: number; mimetype?: string } | null;
      const fileSize = Number(meta?.size ?? 0);
      const fileMime = String(meta?.mimetype ?? "");

      if (fileSize > MAX_BYTES || !ALLOWED_MIMETYPES.has(fileMime)) {
        console.error("Attachment rejected:", { fileSize, fileMime });
        await supabaseAdmin.storage.from("inquiry-attachments").remove([attachmentPath]);
        return new Response(
          JSON.stringify({ error: "Недопустимый тип или размер файла (макс. 10 МБ; PDF, JPG, PNG, DOC, DOCX)" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { data: signed, error: signedError } = await supabaseAdmin.storage
        .from("inquiry-attachments")
        .createSignedUrl(attachmentPath, 60 * 60 * 24 * 7);

      if (signedError) {
        console.error("Signed URL error:", signedError);
      } else {
        attachmentUrlResolved = signed?.signedUrl ?? "";
      }
    }

    const attachmentUrlSafe = escapeHtml(attachmentUrlResolved);
    const displayFileName = attachmentFileName || attachmentPath.split('/').pop() || "Файл";
    const fileExtension = displayFileName.split('.').pop()?.toLowerCase() || "";
    
    const attachmentSection = attachmentUrlResolved
      ? `<p><strong>Прикреплённый файл (реквизиты):</strong></p>
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

    let emailHtml = "";

    if (isStoreOrder) {
      // Build order items table
      const orderItems = data.orderItems || [];
      const orderItemsHtml = orderItems.map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${escapeHtml(item.name)}</strong>
            ${item.sku ? `<br><span style="color: #666; font-size: 12px;">Артикул: ${escapeHtml(item.sku)}</span>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity} шт.
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ${formatPrice(item.price)}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
            ${formatPrice(item.price * item.quantity)}
          </td>
        </tr>
      `).join('');

      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Заказ №${orderNumber} из интернет-магазина
          </h1>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">Контактная информация</h2>
            <table style="width: 100%;">
              <tr><td style="padding: 5px 0;"><strong>Имя:</strong></td><td>${contactName}</td></tr>
              <tr><td style="padding: 5px 0;"><strong>Компания:</strong></td><td>${company}</td></tr>
              <tr><td style="padding: 5px 0;"><strong>Телефон:</strong></td><td>${phone}</td></tr>
              <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td>${email}</td></tr>
              <tr><td style="padding: 5px 0;"><strong>Страна/Город:</strong></td><td>${location || "Не указано"}</td></tr>
            </table>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h2 style="margin-top: 0; color: #333;">Условия заказа</h2>
            <table style="width: 100%;">
              <tr><td style="padding: 5px 0;"><strong>Форма оплаты:</strong></td><td>${paymentMethod || "Не указано"}</td></tr>
              <tr><td style="padding: 5px 0;"><strong>Условия поставки:</strong></td><td>${deliveryMethod || "Не указано"}</td></tr>
              <tr><td style="padding: 5px 0;"><strong>Перезвонить:</strong></td><td>${data.callbackRequested ? "✅ Да, перезвонить для уточнения" : "Нет"}</td></tr>
            </table>
          </div>

          <h2 style="color: #333;">Состав заказа</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left;">Фото</th>
                <th style="padding: 12px; text-align: left;">Товар</th>
                <th style="padding: 12px; text-align: center;">Кол-во</th>
                <th style="padding: 12px; text-align: right;">Цена</th>
                <th style="padding: 12px; text-align: right;">Сумма</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #e8f4fd;">
                <td colspan="4" style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">
                  ИТОГО:
                </td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #0066cc;">
                  ${formatPrice(data.totalPrice || 0)}
                </td>
              </tr>
            </tfoot>
          </table>
          
          <p style="color: #666; font-size: 12px; font-style: italic;">
            * Цены условно актуальные, включают НДС 22%. Требуется уточнение.
          </p>

          ${messageContent ? `
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">Комментарий к заказу</h2>
            <p style="white-space: pre-wrap;">${messageContent}</p>
          </div>
          ` : ''}

          ${attachmentSection}
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Заказ оформлен на сайте pressovac-moscow.ru
          </p>
        </div>
      `;
    } else {
      // Original inquiry email format
      emailHtml = `
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
          Заявка отправлена с сайта pressovac-moscow.ru
        </p>
      `;
    }

    console.log("Sending email to sales@pressovac-moscow.ru");

    // Send email to sales team
    const { data: salesData, error: salesError } = await resend.emails.send({
      from: "Pressovac Moscow <info@pressovac-moscow.ru>",
      to: ["sales@pressovac-moscow.ru"],
      reply_to: emailRaw || undefined,
      subject: emailSubjectRaw,
      html: emailHtml,
    });

    if (salesError) {
      console.error("Resend sales email error:", salesError);
      throw salesError;
    }

    console.log("Sales email sent successfully:", salesData);

    // Send confirmation email to client
    let clientId: string | undefined;

    if (emailRaw) {
      let clientEmailHtml = "";

      if (isStoreOrder) {
        // Order confirmation for store
        const orderItems = data.orderItems || [];
        const orderItemsClientHtml = orderItems.map(item => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              ${escapeHtml(item.name)}
              ${item.sku ? `<br><span style="color: #666; font-size: 12px;">Артикул: ${escapeHtml(item.sku)}</span>` : ''}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
              ${item.quantity} шт.
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
              ${formatPrice(item.price * item.quantity)}
            </td>
          </tr>
        `).join('');

        clientEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">
              Ваш заказ №${orderNumber} принят!
            </h1>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Благодарим вас за заказ! Наш менеджер свяжется с вами в ближайшее время для уточнения деталей.
            </p>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #333; font-size: 18px;">Детали заказа</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #eee;">
                    <th style="padding: 10px; text-align: left;">Товар</th>
                    <th style="padding: 10px; text-align: center;">Кол-во</th>
                    <th style="padding: 10px; text-align: right;">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsClientHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold;">ИТОГО:</td>
                    <td style="padding: 15px; text-align: right; font-weight: bold; color: #0066cc;">
                      ${formatPrice(data.totalPrice || 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
              <p style="color: #666; font-size: 12px; margin-top: 10px;">
                * Цены условно актуальные. Точный расчёт будет предоставлен менеджером.
              </p>
            </div>

            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Условия заказа</h3>
              <p style="margin: 5px 0;"><strong>Форма оплаты:</strong> ${paymentMethod}</p>
              <p style="margin: 5px 0;"><strong>Доставка:</strong> ${deliveryMethod}</p>
              <p style="margin: 5px 0;"><strong>Адрес:</strong> ${location}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #333;">Наши контакты</h3>
              <p style="margin: 5px 0;">📞 +7 (499) 677-20-10 (многоканальный)</p>
              <p style="margin: 5px 0;">📞 +7 (925) 85-349-74 (консультант онлайн)</p>
              <p style="margin: 5px 0;">✉️ sales@pressovac-moscow.ru</p>
            </div>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Это автоматическое сообщение. Если у вас есть вопросы, свяжитесь с нами по указанным контактам.
            </p>
            
            <p style="color: #999; font-size: 12px;">
              С уважением,<br>
              Команда Pressovac Moscow<br>
              <a href="https://pressovac-moscow.ru" style="color: #0066cc;">pressovac-moscow.ru</a>
            </p>
          </div>
        `;
      } else {
        // Standard confirmation
        clientEmailHtml = `
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
      }

      const { data: clientData, error: clientError } = await resend.emails.send({
        from: "Pressovac Moscow <info@pressovac-moscow.ru>",
        to: [emailRaw],
        subject: isStoreOrder ? `Заказ №${orderNumber} принят — Pressovac Moscow` : "Ваша заявка получена — Pressovac Moscow",
        html: clientEmailHtml,
      });

      if (clientError) {
        console.error("Resend client email error:", clientError);
        throw clientError;
      }

      console.log("Client confirmation email sent successfully:", clientData);
      clientId = clientData?.id;
    } else {
      console.log("Client confirmation email skipped (no email provided)");
    }

    return new Response(JSON.stringify({ success: true, salesId: salesData?.id, clientId }), {
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

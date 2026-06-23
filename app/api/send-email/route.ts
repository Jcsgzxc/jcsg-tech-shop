import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// --- Order Interfaces ---
interface OrderItemPayload {
  product: { 
    id: string; 
    name: string; 
    price: number;
    [key: string]: any; // Allow any other fields
  };
  quantity: number;
}

interface EmailPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  instructions: string | null;
  items: OrderItemPayload[];
  total: number;
  orderId: string;
}

// --- Helper Functions ---
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function generateOrderEmail(data: EmailPayload): string {
  const itemsHtml = data.items.map(item => `
    <tr style="border-bottom: 1px solid #2d3748;">
      <td style="padding: 12px 16px; color: #e2e8f0;">${escapeHtml(item.product.name)}</td>
      <td style="padding: 12px 16px; color: #14b8a6; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 16px; color: #e2e8f0; text-align: right;">PHP${(item.product.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const instructionsHtml = data.instructions
    ? `<tr><td style="padding: 8px 0;"><p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Special Instructions</p><p style="margin: 4px 0 0 0; color: #fbbf24; font-size: 14px; line-height: 1.5; font-style: italic;">"${escapeHtml(data.instructions)}"</p></td></tr>`
    : '';

  return `<!DOCTYPE html><html><body style="background-color: #0f172a; font-family: sans-serif; padding: 40px;"><table width="600" style="margin: 0 auto; background-color: #1a202c; border-radius: 16px; padding: 40px; color: white;"><tr><td><h1>NEW ORDER RECEIVED</h1><p>Order ID: ${escapeHtml(data.orderId.toUpperCase())}</p><h2>Customer</h2><p>${escapeHtml(data.customerName)}<br>${escapeHtml(data.customerEmail)}</p><h2>Items</h2><table width="100%">${itemsHtml}</table><p><strong>TOTAL: PHP${data.total.toLocaleString()}</strong></p></td></tr></table></body></html>`;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() { return new Response(null, { status: 200, headers: corsHeaders }); }

// --- Main Handler ---
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: 'API key not configured' }, { status: 500, headers: corsHeaders });

    const body = await request.json();
    const resend = new Resend(apiKey);

    // If type is 'contact', handle contact form, otherwise handle orders
    if (body.type === 'contact') {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'carlogumaod@gmail.com',
        subject: `[CONTACT] New Message from ${body.fullName}`,
        text: `Name: ${body.fullName}\nEmail: ${body.email}\nPhone: ${body.phone}\n\nMessage: ${body.message}`,
      });
    } else {
      const data: EmailPayload = {
        customerName: String(body.customerName || 'Guest'),
        customerEmail: String(body.customerEmail || 'Not provided'),
        customerPhone: String(body.customerPhone || 'Not provided'),
        customerAddress: String(body.customerAddress || 'Not provided'),
        instructions: body.instructions ? String(body.instructions) : null,
        items: Array.isArray(body.items) ? body.items : [],
        total: Number(body.total) || 0,
        orderId: String(body.orderId || 'N/A'),
      };
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'carlogumaod@gmail.com',
        subject: `[NEW ORDER] Jcsg Tech Shop - From ${data.customerName}`,
        html: generateOrderEmail(data),
      });
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Email route error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500, headers: corsHeaders });
  }
}
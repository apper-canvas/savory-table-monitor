import apper from "https://cdn.apper.io/actions/apper-actions.js";
import { Resend } from "npm:resend";

apper.serve(async (req) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed. Use POST."
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ["customerName", "customerEmail", "date", "time", "partySize"];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customerEmail)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid email address format"
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get Resend API key from secrets
    const resendApiKey = await apper.getSecret("RESEND_API_KEY");
    
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service not configured. Please contact support."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Resend client
    const resend = new Resend(resendApiKey);

    // Format date and time for display
    const reservationDate = new Date(body.date);
    const formattedDate = reservationDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Generate iCalendar (.ics) file content
    const icsContent = generateIcsFile({
      startDate: body.date,
      startTime: body.time,
      partySize: body.partySize,
      customerName: body.customerName
    });

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reservation Confirmation</title>
          <style>
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
              line-height: 1.6; 
              color: #374151; 
              margin: 0; 
              padding: 0; 
              background-color: #f9fafb;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 8px; 
              overflow: hidden; 
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); 
              color: white; 
              padding: 40px 20px; 
              text-align: center;
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-family: 'Playfair Display', serif;
            }
            .content { 
              padding: 40px 30px;
            }
            .detail-box { 
              background: #FFFBEB; 
              border-left: 4px solid #D97706; 
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 4px;
            }
            .detail-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
              border-bottom: 1px solid #FDE68A;
            }
            .detail-row:last-child { 
              border-bottom: none;
            }
            .detail-label { 
              font-weight: 600; 
              color: #78350F;
            }
            .detail-value { 
              color: #374151;
            }
            .calendar-btn { 
              display: inline-block; 
              background: #D97706; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0; 
              font-weight: 500;
            }
            .footer { 
              background: #F9FAFB; 
              padding: 30px; 
              text-align: center; 
              color: #6B7280; 
              font-size: 14px;
            }
            .special-requests { 
              background: #FEF3C7; 
              padding: 15px; 
              border-radius: 4px; 
              margin: 15px 0; 
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ Reservation Confirmed!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">The Savory Table</p>
            </div>
            
            <div class="content">
              <p>Dear ${body.customerName},</p>
              
              <p>Thank you for choosing The Savory Table! We're delighted to confirm your reservation.</p>
              
              <div class="detail-box">
                <div class="detail-row">
                  <span class="detail-label">📅 Date:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">🕐 Time:</span>
                  <span class="detail-value">${body.time}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">👥 Party Size:</span>
                  <span class="detail-value">${body.partySize} ${body.partySize === 1 ? 'guest' : 'guests'}</span>
                </div>
                ${body.customerPhone ? `
                <div class="detail-row">
                  <span class="detail-label">📞 Contact:</span>
                  <span class="detail-value">${body.customerPhone}</span>
                </div>
                ` : ''}
              </div>
              
              ${body.specialRequests ? `
              <div class="special-requests">
                <strong>Special Requests:</strong><br>
                ${body.specialRequests}
              </div>
              ` : ''}
              
              <p style="text-align: center;">
                <a href="data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}" 
                   download="reservation.ics" 
                   class="calendar-btn">
                  📅 Add to Calendar
                </a>
              </p>
              
              <p>We look forward to serving you! If you need to make any changes to your reservation, please contact us at least 24 hours in advance.</p>
              
              <p><strong>Contact Information:</strong><br>
              📍 123 Gourmet Street, Culinary District<br>
              📞 (555) 123-4567<br>
              📧 info@savorytable.com</p>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing The Savory Table</p>
              <p>© ${new Date().getFullYear()} The Savory Table. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

// Send email via Resend
    const emailResult = await resend.emails.send({
      from: "The Savory Table <noreply@savorytable.com>",
      to: [body.customerEmail],
      subject: `Reservation Confirmation - ${formattedDate} at ${body.time}`,
      html: htmlContent,
      attachments: [
        {
          filename: "reservation.ics",
          content: btoa(icsContent)
        }
      ]
    });

    if (emailResult.error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send confirmation email. Please contact the restaurant directly."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Confirmation email sent successfully",
        emailId: emailResult.data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred while sending the confirmation email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});

// Helper function to generate iCalendar file content
function generateIcsFile({ startDate, startTime, partySize, customerName }) {
  const [hours, minutes] = startTime.split(":");
  const startDateTime = new Date(startDate);
  startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  // Assume 2-hour reservation duration
  const endDateTime = new Date(startDateTime);
  endDateTime.setHours(endDateTime.getHours() + 2);
  
  // Format dates for iCalendar (YYYYMMDDTHHMMSSZ)
  const formatIcsDate = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hour = String(date.getUTCHours()).padStart(2, "0");
    const min = String(date.getUTCMinutes()).padStart(2, "0");
    const sec = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hour}${min}${sec}Z`;
  };
  
  const now = formatIcsDate(new Date());
  const start = formatIcsDate(startDateTime);
  const end = formatIcsDate(endDateTime);
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Savory Table//Reservation System//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${now}-${Math.random().toString(36).substr(2, 9)}@savorytable.com
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:Dinner at The Savory Table
DESCRIPTION:Reservation for ${partySize} ${partySize === 1 ? 'guest' : 'guests'} at The Savory Table\\n\\nReservation Name: ${customerName}\\n\\nPlease arrive 10 minutes early.
LOCATION:The Savory Table\\, 123 Gourmet Street\\, Culinary District
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Reminder: Dinner reservation at The Savory Table tomorrow
END:VALARM
END:VEVENT
END:VCALENDAR`;
}
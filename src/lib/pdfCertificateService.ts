import { Certificate } from "./certificateService";

/**
 * Compiles a structured HTML print canvas template for certificate data profiles.
 */
export const generateCertificateHtml = (certificate: Certificate): string => {
  // Extract and evaluate runtime firestore timestamp values safely
  const formattedDate = certificate.issuedAt?.toDate
    ? certificate.issuedAt.toDate().toLocaleDateString()
    : "--";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Certificate of Completion</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #0B1220;
            margin: 0;
            padding: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .certificate-container {
            background-color: #FFF8E7;
            border: 8px double #D4AF37;
            border-radius: 12px;
            padding: 60px;
            width: 800px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            box-sizing: border-box;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #B8860B;
            margin-bottom: 25px;
          }
          .heading {
            font-size: 36px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #1E293B;
            margin: 0 0 10px 0;
          }
          .divider {
            height: 2px;
            background-color: #D4AF37;
            width: 200px;
            margin: 20px auto;
          }
          .subheading {
            font-size: 16px;
            color: #475569;
            margin-bottom: 25px;
            font-style: italic;
          }
          .student-name {
            font-size: 34px;
            font-weight: bold;
            color: #0F172A;
            margin: 20px 0;
            text-transform: uppercase;
          }
          .description {
            font-size: 16px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .course-title {
            font-size: 24px;
            font-weight: bold;
            color: #2563EB;
            margin-bottom: 15px;
          }
          .certificate-id {
            font-size: 13px;
            color: #64748B;
            margin-bottom: 40px;
            font-family: monospace;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            border-top: 1px solid #E2E8F0;
            padding-top: 20px;
          }
          .footer-col {
            text-align: left;
          }
          .footer-col.right {
            text-align: right;
          }
          .footer-title {
            font-size: 12px;
            color: #64748B;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .footer-value {
            font-size: 15px;
            font-weight: bold;
            color: #0F172A;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="logo">🏆 KnowledgeVerse</div>
          <div class="heading">CERTIFICATE OF COMPLETION</div>
          <div class="divider"></div>
          <div class="subheading">This document proudly confirms that</div>
          <div class="student-name">${certificate.studentName}</div>
          <div class="description">has successfully fulfilled all qualification criteria and graduation requirements for the track:</div>
          {/* ✅ FIXED: References the synchronized data model schema fields precisely */}
          <div class="course-title">${certificate.courseTitle}</div>
          <div class="certificate-id">Verification Ref ID: ${certificate.certificateId}</div>
          
          <div class="footer">
            <div class="footer-col">
              <div class="footer-title">Issued By</div>
              <div class="footer-value">KnowledgeVerse Academy</div>
            </div>
            <div class="footer-col right">
              <div class="footer-title">Date of Issue</div>
              <div class="footer-value">${formattedDate}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

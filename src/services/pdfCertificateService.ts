import * as Print from "expo-print";

import { Certificate } from "./certificateService";

export const generateCertificatePdf = async (
  certificate: Certificate
) => {
  const html = `
  <html>
    <body
      style="
        font-family: Arial;
        text-align:center;
        padding:40px;
        border:12px solid #1E3A8A;
      "
    >

      <h1 style="color:#1E3A8A">
        KnowledgeVerse
      </h1>

      <h2>
        Certificate of Completion
      </h2>

      <p>
        This certifies that
      </p>

      <h1>
        ${certificate.studentName}
      </h1>

      <p>
        has successfully completed
      </p>

      <h2>
        ${certificate.courseName}
      </h2>

      <p>
        Completion Date
      </p>

      <h3>
        ${
          certificate.completedAt?.toDate
            ? certificate.completedAt
                .toDate()
                .toLocaleDateString()
            : ""
        }
      </h3>

      <br/><br/>

      <hr/>

      <p>
        KnowledgeVerse Learning Platform
      </p>

    </body>
  </html>
  `;

  const result = await Print.printToFileAsync({
    html,
  });

  return result.uri;
};
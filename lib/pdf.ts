import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { LeaseOutput } from './schema';

export interface DocumentOptions {
  includeDisclaimer?: boolean;
  includeSignatures?: boolean;
}

export async function generateLeaseDocx(leaseData: LeaseOutput, options: DocumentOptions = {}): Promise<Buffer> {
  // Build children array dynamically
  const children = [
    // Title
    new Paragraph({
      text: "RESIDENTIAL LEASE AGREEMENT",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
    
    // Spacing
    new Paragraph({ text: "" }),
    
    // Parties section
    new Paragraph({
      text: "PARTIES",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Landlord: ", bold: true }),
        new TextRun({ text: leaseData.parties.landlord.name }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Address: ", bold: true }),
        new TextRun({ text: leaseData.parties.landlord.address }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Tenant: ", bold: true }),
        new TextRun({ text: leaseData.parties.tenant.name }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Property: ", bold: true }),
        new TextRun({ text: leaseData.parties.property.address }),
      ],
    }),
    
    // Spacing
    new Paragraph({ text: "" }),
    
    // Economics section
    new Paragraph({
      text: "FINANCIAL TERMS",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Term: ", bold: true }),
        new TextRun({ text: leaseData.economics.termLabel }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Monthly Rent: ", bold: true }),
        new TextRun({ text: `$${leaseData.economics.rent.monthly}` }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Proration Method: ", bold: true }),
        new TextRun({ text: leaseData.economics.rent.prorationMethod }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Utilities: ", bold: true }),
        new TextRun({ text: leaseData.economics.utilities }),
      ],
    }),
  ];

  // Add deposits if available
  if (leaseData.economics.deposits) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Security Deposit: ", bold: true }),
          new TextRun({ text: `$${leaseData.economics.deposits.security}` }),
        ],
      })
    );
  }
  
  // Add late fees if available
  if (leaseData.economics.lateFees) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Late Fees: ", bold: true }),
          new TextRun({ text: leaseData.economics.lateFees }),
        ],
      })
    );
  }
  
  // Add spacing
  children.push(new Paragraph({ text: "" }));
  
  // Add clauses section
  children.push(
    new Paragraph({
      text: "LEASE TERMS AND CONDITIONS",
      heading: HeadingLevel.HEADING_1,
    })
  );
  
  // Generate numbered clauses
  leaseData.clauses.forEach((clause, index) => {
    children.push(
      new Paragraph({
        text: `${index + 1}. ${clause.title}`,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: clause.body,
      }),
      new Paragraph({ text: "" })
    );
  });
  
  // Add signatures section if enabled
  if (options.includeSignatures !== false) {
    children.push(
      new Paragraph({
        text: "SIGNATURES",
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: "By signing below, both parties agree to the terms and conditions of this lease:",
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({ text: "Landlord: ", bold: true }),
          new TextRun({ text: "_________________________" }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Date: ", bold: true }),
          new TextRun({ text: "_________________________" }),
        ],
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({ text: "Tenant: ", bold: true }),
          new TextRun({ text: "_________________________" }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Date: ", bold: true }),
          new TextRun({ text: "_________________________" }),
        ],
      })
    );
  }
  
  // Add disclaimer if enabled
  if (options.includeDisclaimer !== false) {
    children.push(
      new Paragraph({ text: "" }),
      new Paragraph({
        text: "DISCLAIMER",
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: leaseData.disclaimer,
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  }
  
  // Add metadata
  children.push(
    new Paragraph({ text: "" }),
    new Paragraph({
      text: `Generated on ${leaseData.metadata.generatedAt} for ${leaseData.metadata.jurisdiction}`,
      alignment: AlignmentType.CENTER,
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  return await Packer.toBuffer(doc);
}

export async function convertDocxToPdf(docxBuffer: Buffer): Promise<Buffer> {
  // For serverless environments, we'll return the DOCX and let the client handle PDF conversion
  // In a production environment with server-side PDF conversion, you would use:
  // - docx-pdf package
  // - LibreOffice headless
  // - or a service like CloudConvert
  
  // For now, return the DOCX buffer
  // The client can use browser's "Print to PDF" functionality
  return docxBuffer;
}

export function getDocumentMimeType(format: 'docx' | 'pdf'): string {
  switch (format) {
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

export function getDocumentExtension(format: 'docx' | 'pdf'): string {
  switch (format) {
    case 'docx':
      return '.docx';
    case 'pdf':
      return '.pdf';
    default:
      return '.bin';
  }
}

import { LeaseInput } from './schema';
import { getAllBaseClauses } from './templates/base_clauses';
import { getAllCaliforniaClauses } from './templates/jurisdictions/US-CA';

export function buildSystemPrompt(): string {
  return `You are a paralegal-grade drafting assistant generating plain-language residential leases, not legal advice. 

CRITICAL INSTRUCTIONS:
- Always adapt to jurisdiction; cite no laws verbatim; instead apply known requirements via safe, general wording
- Never invent statute numbers
- Keep it concise, readable at grade 8–10
- Do not include hallucinated requirements
- Use the provided LeaseOutputSchema exactly
- If jurisdiction is unknown, default to a general U.S. template and label it "General (Non-jurisdictional)"
- Merge base clauses with jurisdiction overrides (if present)
- Respect input choices (pets, smoking, etc.)
- Populate clauses[] in logical order with clear titles
- Keep the full output under ~2,500–3,000 words
- If required fields are missing, return a structured error object with missingFields

You must return valid JSON that matches the LeaseOutputSchema exactly.`;
}

export function buildUserPrompt(input: LeaseInput): string {
  const jurisdiction = `${input.jurisdiction.country}${input.jurisdiction.state ? `-${input.jurisdiction.state}` : ''}`;
  
  let prompt = `Generate a residential lease with the following details:

JURISDICTION: ${input.jurisdiction.country}${input.jurisdiction.state ? `, ${input.jurisdiction.state}` : ''}${input.jurisdiction.city ? `, ${input.jurisdiction.city}` : ''}

LANDLORD: ${input.landlord.name} (${input.landlord.address})${input.landlord.email ? ` - ${input.landlord.email}` : ''}
TENANT: ${Array.isArray(input.tenant) ? input.tenant.map(t => t.name).join(', ') : input.tenant.name}${Array.isArray(input.tenant) ? '' : (input.tenant.email ? ` - ${input.tenant.email}` : '')}
PROPERTY: ${input.property.address}${input.property.type ? ` (${input.property.type})` : ''}

TERM: ${input.term.startDate}${input.term.endDate ? ` to ${input.term.endDate}` : ''}${input.term.months ? ` (${input.term.months} months)` : ''}
RENEWAL: ${input.term.renewal}

FINANCIALS:
- Monthly Rent: $${input.financials.monthlyRent}
- Security Deposit: $${input.financials.securityDeposit}
- Late Fee: ${input.financials.lateFee ? `${input.financials.lateFee.type === 'flat' ? '$' : ''}${input.financials.lateFee.value}${input.financials.lateFee.type === 'percent' ? '%' : ''} after ${input.financials.lateFee.graceDays} days` : 'None'}
- Proration: ${input.financials.prorationMethod}
- Utilities Included: ${input.financials.utilitiesIncluded.length > 0 ? input.financials.utilitiesIncluded.join(', ') : 'None'}

PETS: ${input.pets.allowed ? `Allowed${input.pets.fee > 0 ? ` - Fee: $${input.pets.fee}` : ''}${input.pets.deposit > 0 ? `, Deposit: $${input.pets.deposit}` : ''}${input.pets.rent > 0 ? `, Monthly: $${input.pets.rent}` : ''}${input.pets.restrictions ? ` - ${input.pets.restrictions}` : ''}` : 'Not allowed'}

RULES:
- Smoking: ${input.rules.smoking}
- Parking: ${input.rules.parking || 'Not specified'}
- Subletting: ${input.rules.subletting}
- Alterations: ${input.rules.alterations}
- Insurance Required: ${input.rules.insuranceRequired ? 'Yes' : 'No'}

NOTICES: ${input.notices.delivery}
SIGNATURES: ${input.signatures.method}`;

  // Add jurisdiction-specific guidance
  if (jurisdiction === 'US-CA') {
    prompt += `

CALIFORNIA-SPECIFIC REQUIREMENTS:
- Include habitability warranty and remedies
- Security deposit limits (2 months unfurnished, 3 months furnished)
- Just cause eviction protections
- Proper notice periods for rent increases and termination
- Fair housing compliance`;

    // Add CA-specific clauses as reference
    const caClauses = getAllCaliforniaClauses();
    prompt += `\n\nCALIFORNIA CLAUSE REFERENCE:\n${caClauses.map(c => `- ${c.title}: ${c.body}`).join('\n')}`;
  }

  // Add base clauses as reference
  const baseClauses = getAllBaseClauses();
  prompt += `\n\nBASE CLAUSE REFERENCE:\n${baseClauses.map(c => `- ${c.title}: ${c.body}`).join('\n')}`;

  prompt += `\n\nGenerate a complete lease document following the LeaseOutputSchema format.`;

  return prompt;
}

export function getJurisdictionClauses(jurisdiction: string) {
  // This would be expanded to support multiple jurisdictions
  switch (jurisdiction) {
    case 'US-CA':
      return getAllCaliforniaClauses();
    default:
      return [];
  }
}

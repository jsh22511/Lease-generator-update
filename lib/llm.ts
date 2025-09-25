import OpenAI from 'openai';
import { LeaseInput, LeaseOutput } from './schema';

export interface LLMProvider {
  generateLease(input: LeaseInput): Promise<LeaseOutput>;
}

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;
  private maxTokens: number;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.LLM_MODEL || 'gpt-4o-mini';
    this.maxTokens = parseInt(process.env.MAX_OUTPUT_TOKENS || '3000');
  }

  async generateLease(input: LeaseInput): Promise<LeaseOutput> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(input);

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from LLM');
      }

      const parsed = JSON.parse(content);
      
      // Add metadata
      parsed.metadata = {
        jurisdiction: `${input.jurisdiction.country}${input.jurisdiction.state ? `-${input.jurisdiction.state}` : ''}`,
        version: '1.0',
        generatedAt: new Date().toISOString(),
        model: this.model,
        tokenUsage: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0,
        }
      };

      return parsed as LeaseOutput;
    } catch (error) {
      console.error('LLM generation error:', error);
      throw new Error('Failed to generate lease content');
    }
  }

  private buildSystemPrompt(): string {
    return `You are a paralegal-grade drafting assistant generating comprehensive, professional residential leases similar to J&D Management standards, not legal advice. 

CRITICAL INSTRUCTIONS:
- Generate detailed, professional lease agreements with the same high-level structure as J&D Management leases
- Use formal legal language with numbered sections and subsections (e.g., "1. RENTAL UNIT", "1.1 PARTIES AND OCCUPANTS")
- Include comprehensive clauses covering all aspects of residential tenancy
- Structure like: "1. RENTAL UNIT", "2. AB1482 DISCLOSURES", "3. LEASE TERM", "4. RENT CHARGES & PAYMENT METHODS", etc.
- Include detailed subsections with comprehensive legal language
- Use professional formatting with clear section headers and detailed content
- Include all standard residential lease sections with comprehensive legal language
- Make the lease legally sound but accessible to laypersons
- Include proper disclaimers and legal notices
- Use formal, professional tone throughout
- Include detailed clauses for utilities, late fees, occupancy, guests, smoking policies, property care, maintenance, landscaping, parking, etc.
- Always adapt to jurisdiction; cite no laws verbatim; instead apply known requirements via safe, general wording
- Never invent statute numbers
- Keep it professional, readable at grade 8–10
- Do not include hallucinated requirements
- If jurisdiction is unknown, default to a general U.S. template and label it "General (Non-jurisdictional)"
- Merge base clauses with jurisdiction overrides (if present)
- Respect input choices (pets, smoking, etc.)
- Populate clauses[] in logical order with clear titles
- Include comprehensive sections covering: parties, rental unit, lease term, rent charges, security deposit, utilities, late fees, occupancy, management disclosure, renters insurance, keys, parking, landscaping, smoking policy, property care, animals, compliance, liability, and signatures
- Each clause should be detailed and professional, similar to J&D Management lease forms
- Keep the full output under ~4,000–5,000 words

REQUIRED JSON STRUCTURE:
You MUST return a JSON object with exactly these fields:
{
  "parties": {
    "landlord": {"name": "string", "address": "string"},
    "tenant": {"name": "string"},
    "property": {"address": "string", "type": "string"}
  },
  "economics": {
    "termLabel": "string",
    "rent": {"monthly": number, "prorationMethod": "string"},
    "deposits": {"security": number, "pets": number},
    "lateFees": "string",
    "utilities": "string"
  },
  "clauses": [
    {"title": "string", "body": "string"}
  ],
  "signatures": {
    "method": "string",
    "parties": [{"role": "string", "name": "string", "date": "string"}]
  },
  "disclaimer": "string"
}

You must return valid JSON that matches this exact structure.`;
  }

  private buildUserPrompt(input: LeaseInput): string {
    return `Generate a residential lease with the following details:

JURISDICTION: ${input.jurisdiction.country}${input.jurisdiction.state ? `, ${input.jurisdiction.state}` : ''}${input.jurisdiction.city ? `, ${input.jurisdiction.city}` : ''}

LANDLORD: ${input.landlord.name} (${input.landlord.address})${input.landlord.email ? ` - ${input.landlord.email}` : ''}
TENANT: ${Array.isArray(input.tenant) ? input.tenant.map(t => t.name).join(', ') : input.tenant.name}${Array.isArray(input.tenant) ? '' : (input.tenant.email ? ` - ${input.tenant.email}` : '')}
PROPERTY: ${input.property.address}${input.property.type ? ` (${input.property.type})` : ''}${input.property.bedrooms && input.property.bathrooms ? ` - ${input.property.bedrooms} bedroom${input.property.bedrooms !== 1 ? 's' : ''}, ${input.property.bathrooms} bathroom${input.property.bathrooms !== 1 ? 's' : ''}` : ''}

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
SIGNATURES: ${input.signatures.method}

Generate a comprehensive, professional lease document similar to J&D Management standards with high-level structure and detailed legal language. Return ONLY valid JSON matching the required structure. 

Include detailed lease clauses covering:
1. RENTAL UNIT - Parties, occupants, and property description with detailed subsections
2. AB1482 DISCLOSURES - California rent control and just cause disclosures
3. LEASE TERM - Duration, start/end dates, renewal options, holdover provisions
4. RENT CHARGES & PAYMENT METHODS - Due dates, proration, payment methods, change procedures
5. SECURITY DEPOSIT - Amount, refund terms, deductions, joint liability
6. UTILITIES - Tenant responsibilities, included utilities, processing fees
7. LATE FEES & INSUFFICIENT FUNDS - Late payment charges, NSF fees, grace periods
8. GUARANTEE OF LEASE AGREEMENT - Guarantor requirements
9. AVAILABILITY - Unit availability and damages
10. OCCUPANCY AND GUESTS - Occupant restrictions, guest policies, subletting, assignment
11. MANAGEMENT DISCLOSURE NOTICE - Property management information, service of process
12. RENTERS INSURANCE - Coverage requirements, proof requirements, cancellation notices
13. KEYS - Key assignment, lockouts, replacement costs, security
14. PARKING AND STORAGE - Parking assignments, storage policies, vehicle restrictions
15. LANDSCAPING - Yard maintenance responsibilities, water conservation
16. SMOKING POLICY AND PROHIBITIONS - Smoking restrictions, e-cigarettes, marijuana
17. CONSERVATION - Water conservation, Spare the Air alerts
18. LANDLORD COOPERATION - Entry rights, repair cooperation
19. BED BUGS - Information, reporting, prevention, cooperation
20. PROPERTY CARE, USE AND MAINTENANCE - Care requirements, cleaning, repairs, mold prevention
21. ANIMALS - Pet policies, deposits, restrictions, assistance animals
22. COMPLIANCE - Smoke detectors, carbon monoxide detectors, testing requirements
23. LIABILITY - Package delivery, damages, joint liability, property sale, destruction
24. ADDENDA - Additional terms, exemptions, smoking policy addendum
25. SIGNATURES - Execution requirements and methods

Each clause should be comprehensive and professional, similar to standard apartment association lease forms.`;
  }
}

// Factory function to create LLM provider
export function createLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || 'openai';
  
  switch (provider) {
    case 'openai':
      return new OpenAIProvider();
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

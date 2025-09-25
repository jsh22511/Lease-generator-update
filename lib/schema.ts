import { z } from 'zod';

// Input schema for the lease generation form
export const LeaseInputSchema = z.object({
  jurisdiction: z.object({
    country: z.string().min(2),
    state: z.string().optional(),
    city: z.string().optional(),
  }),
  landlord: z.object({
    name: z.string().min(2),
    email: z.string().email().optional(),
    address: z.string().min(5),
  }),
  tenant: z.object({
    name: z.string().min(2),
    email: z.string().optional().or(z.literal('')),
  }).or(z.array(z.object({
    name: z.string().min(2),
    email: z.string().optional().or(z.literal('')),
  }))),
  property: z.object({
    address: z.string().min(5),
    type: z.enum(['apartment','house','condo','duplex','townhouse']).optional(),
    includeBedBath: z.boolean().optional(),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().min(0).optional(),
    zipCode: z.string().optional(),
  }),
  term: z.object({
    startDate: z.string(), // ISO
    endDate: z.string().optional(),
    months: z.number().int().positive().optional(),
    renewal: z.enum(['none','auto','mutual']).default('none'),
  }),
  financials: z.object({
    monthlyRent: z.number().positive(),
    securityDeposit: z.number().min(0).default(0),
    lateFee: z.object({
      type: z.enum(['flat','percent']).default('flat'),
      value: z.number().min(0).default(0),
      graceDays: z.number().int().min(0).default(0),
    }).optional(),
    prorationMethod: z.enum(['actual_days','30_day_month']).default('actual_days'),
    utilitiesIncluded: z.array(z.enum(['water','sewer','trash','gas','electric','internet'])).default([]),
  }),
  pets: z.object({
    allowed: z.boolean().default(false),
    fee: z.number().min(0).default(0),
    deposit: z.number().min(0).default(0),
    rent: z.number().min(0).default(0),
    restrictions: z.string().optional(),
  }),
  rules: z.object({
    smoking: z.enum(['prohibited','designated','allowed']).default('prohibited'),
    parking: z.string().optional(),
    subletting: z.enum(['prohibited','with_consent']).default('with_consent'),
    alterations: z.enum(['prohibited','with_consent']).default('with_consent'),
    insuranceRequired: z.boolean().default(false),
  }),
  notices: z.object({
    delivery: z.enum(['email','mail','both']).default('both'),
  }),
  signatures: z.object({
    method: z.enum(['wet','e-sign']).default('e-sign'),
  }),
  emailCapture: z.object({
    email: z.string().email().optional(),
    consent: z.boolean().optional(),
  }).optional(),
  captchaToken: z.string().optional(),
});

// Output schema for LLM-generated lease content
export const LeaseOutputSchema = z.object({
  metadata: z.object({
    jurisdiction: z.string(),
    version: z.string(),
    generatedAt: z.string(), // ISO
    model: z.string(),
    tokenUsage: z.object({ 
      prompt: z.number(), 
      completion: z.number(), 
      total: z.number() 
    }).optional(),
  }),
  parties: z.object({
    landlord: z.object({ name: z.string(), address: z.string() }),
    tenant: z.object({ name: z.string() }),
    property: z.object({ address: z.string(), type: z.string().optional() }),
  }),
  economics: z.object({
    termLabel: z.string(),
    rent: z.object({ monthly: z.number(), prorationMethod: z.string() }),
    deposits: z.object({ security: z.number(), pets: z.number().optional() }).optional(),
    lateFees: z.string().optional(),
    utilities: z.string(),
  }),
  clauses: z.array(z.object({ title: z.string(), body: z.string() })), // ordered
  signatures: z.object({
    method: z.string(),
    parties: z.array(z.object({ 
      role: z.string(), 
      name: z.string(), 
      date: z.string().optional() 
    })),
  }),
  disclaimer: z.string(), // NOT legal advice
});

// Lead capture schema
export const LeadCaptureSchema = z.object({
  email: z.string().email(),
  consent: z.boolean(),
  context: z.string().optional(),
});

// API response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Type exports
export type LeaseInput = z.infer<typeof LeaseInputSchema>;
export type LeaseOutput = z.infer<typeof LeaseOutputSchema>;
export type LeadCapture = z.infer<typeof LeadCaptureSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

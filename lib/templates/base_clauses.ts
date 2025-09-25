// Base lease clauses that apply universally
export const baseClauses = {
  parties: {
    title: "Parties to Agreement",
    body: "This lease agreement is between the Landlord and Tenant as identified above."
  },
  
  property: {
    title: "Property Description",
    body: "The Landlord agrees to rent to the Tenant the property located at the address specified above."
  },
  
  term: {
    title: "Lease Term",
    body: "The lease term shall begin on the start date and continue until the end date, unless terminated earlier in accordance with this agreement."
  },
  
  rent: {
    title: "Rent Payment",
    body: "Tenant agrees to pay rent in the amount specified, due on the first day of each month. Rent is payable at the address specified by Landlord or by other means agreed upon in writing."
  },
  
  deposits: {
    title: "Security Deposit",
    body: "Tenant has deposited with Landlord the sum specified as security for the faithful performance of this lease. This deposit may be applied to damages, unpaid rent, or other charges due under this lease."
  },
  
  lateFees: {
    title: "Late Fees",
    body: "If rent is not received by the due date, Tenant may be subject to late fees as specified in this agreement."
  },
  
  utilities: {
    title: "Utilities",
    body: "Tenant is responsible for all utilities unless otherwise specified in this agreement."
  },
  
  maintenance: {
    title: "Maintenance and Repairs",
    body: "Tenant shall maintain the premises in good condition and promptly report any needed repairs to Landlord. Landlord is responsible for structural repairs and major systems."
  },
  
  entry: {
    title: "Landlord's Right of Entry",
    body: "Landlord may enter the premises with reasonable notice for inspection, repairs, or showing to prospective tenants or buyers."
  },
  
  habitability: {
    title: "Warranty of Habitability",
    body: "Landlord warrants that the premises are habitable and fit for residential use at the commencement of the lease term."
  },
  
  notices: {
    title: "Notices",
    body: "All notices required under this lease shall be in writing and delivered as specified in this agreement."
  },
  
  default: {
    title: "Default and Termination",
    body: "Either party may terminate this lease in accordance with applicable law for material breach of the terms contained herein."
  },
  
  dispute: {
    title: "Dispute Resolution",
    body: "Any disputes arising under this lease shall be resolved through mediation or arbitration as required by applicable law."
  },
  
  governing: {
    title: "Governing Law",
    body: "This lease shall be governed by the laws of the jurisdiction where the property is located."
  },
  
  signatures: {
    title: "Signatures",
    body: "This lease shall be binding upon execution by both parties."
  }
};

// Utility function to get clause by key
export function getBaseClause(key: keyof typeof baseClauses) {
  return baseClauses[key];
}

// Function to get all base clauses in order
export function getAllBaseClauses() {
  return Object.values(baseClauses);
}

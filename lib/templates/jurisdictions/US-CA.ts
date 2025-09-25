// California-specific lease clauses and overrides
export const californiaClauses = {
  // Override base clauses with CA-specific requirements
  habitability: {
    title: "Warranty of Habitability (California)",
    body: "Landlord warrants that the premises comply with all applicable housing codes and are fit for human habitation. Tenant may withhold rent for habitability violations after proper notice."
  },
  
  securityDeposit: {
    title: "Security Deposit (California)",
    body: "Security deposit shall not exceed two months' rent for unfurnished units or three months' rent for furnished units. Landlord must provide itemized deductions within 21 days of lease termination."
  },
  
  ab1482Disclosure: {
    title: "AB 1482 Disclosures",
    body: "California law limits the amount your rent can be increased. See Section 1947.12 of the Civil Code for more information. California law also provides that after all the tenants have continuously and lawfully occupied the property for 12 months or more, or at least one of the tenants has continuously and lawfully occupied the property for 24 months or more; a landlord must provide a statement of cause in any notice to terminate a tenancy. See Section 1946.2 of the Civil Code for more information."
  },
  
  rentControl: {
    title: "Rent Control Notice",
    body: "This property may be subject to local rent control ordinances. Tenant should consult local regulations for applicable protections."
  },
  
  justCause: {
    title: "Just Cause Eviction",
    body: "Landlord may only terminate tenancy for just cause as defined by California law, including non-payment of rent, breach of lease terms, or owner move-in."
  },
  
  noticePeriods: {
    title: "Notice Periods (California)",
    body: "Landlord must provide 30 days' notice for rent increases under 10%, 60 days for increases over 10%, and 60 days for lease termination without cause."
  },
  
  habitabilityRemedies: {
    title: "Habitability Remedies",
    body: "Tenant may repair and deduct for habitability violations after proper notice, or withhold rent in accordance with California Civil Code Section 1942."
  },
  
  discrimination: {
    title: "Fair Housing",
    body: "This lease complies with California Fair Employment and Housing Act and federal fair housing laws prohibiting discrimination based on protected characteristics."
  },
  
  bedBugs: {
    title: "Bed Bug Information and Prevention",
    body: "Landlord has inspected the rental unit prior to renting and knows of no bed bug infestation. Resident agrees not to bring onto the premises personal furnishings or belongings that the Resident knows or should reasonably know are infested with bed bugs. Residents have an important role in preventing and controlling bed bugs."
  },
  
  leadPaint: {
    title: "Lead-Based Paint Disclosure",
    body: "Housing built before 1978 may contain lead-based paint. Lead from paint, chips, and dust can pose serious health hazards. Before renting or buying a pre-1978 home or apartment, federal law requires disclosure of known information on lead-based paint and lead-based paint hazards."
  },
  
  waterConservation: {
    title: "Water Conservation",
    body: "The State Water Resources Control Board prohibits all Californians from washing down driveways and sidewalks, watering of outdoor landscapes that cause excess runoff, using a hose to wash a motor vehicle unless the hose is fitted with a shut-off nozzle, and using potable water in a fountain or decorative water feature unless the water is recirculated."
  },
  
  spareTheAir: {
    title: "Spare the Air Alerts",
    body: "Many Air Districts have enacted 'Spare the Air' programs, which prohibit certain activities, which may include burning wood, pellets, or manufactured fire logs when a 'Spare the Air' Alert is issued. Resident agrees to comply with all 'Spare the Air' restrictions."
  }
};

// Function to get CA-specific clause by key
export function getCaliforniaClause(key: keyof typeof californiaClauses) {
  return californiaClauses[key];
}

// Function to get all CA clauses
export function getAllCaliforniaClauses() {
  return Object.values(californiaClauses);
}

// Example of how to add more jurisdictions:
// Create US-TX.ts, US-NY.ts, etc. with similar structure
// Each jurisdiction file should export:
// 1. jurisdictionClauses object with overrides
// 2. getJurisdictionClause function
// 3. getAllJurisdictionClauses function

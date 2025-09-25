'use client';

import React, { useState } from 'react';
import Field from './Field';

interface LeaseFormData {
  jurisdiction: {
    country: string;
    state?: string;
    city?: string;
  };
  term: {
    startDate: string;
    endDate?: string;
    months?: number;
    renewal: 'none' | 'auto' | 'mutual';
  };
  financials: {
    monthlyRent: number;
    securityDeposit: number;
    prorationMethod: 'actual_days' | '30_day_month';
    utilitiesIncluded: ('water' | 'sewer' | 'trash' | 'gas' | 'electric' | 'internet')[];
    lateFee?: {
      type: 'flat' | 'percent';
      value: number;
      graceDays: number;
    };
  };
  pets: {
    allowed: boolean;
    fee: number;
    deposit: number;
    rent: number;
  };
  rules: {
    smoking: 'allowed' | 'prohibited' | 'designated';
    subletting: 'prohibited' | 'with_consent';
    alterations: 'prohibited' | 'with_consent';
    insuranceRequired: boolean;
    parking?: string;
  };
  notices: {
    delivery: 'email' | 'mail' | 'both';
  };
  signatures: {
    method: 'e-sign' | 'wet';
  };
  property: {
    address: string;
    type?: 'apartment' | 'house' | 'condo' | 'duplex' | 'townhouse';
    includeBedBath?: boolean;
    bedrooms?: number;
    bathrooms?: number;
    zipCode?: string;
  };
  landlord: {
    name: string;
    address: string;
    email?: string;
  };
  tenant: {
    name: string;
    email?: string;
  } | {
    name: string;
    email?: string;
  }[];
  captchaToken?: string;
}

interface SimpleLeaseFormProps {
  onGenerate: (data: LeaseFormData) => void;
  isGenerating: boolean;
  result?: any;
}

function SimpleLeaseForm({ onGenerate, isGenerating, result }: SimpleLeaseFormProps) {
  const [formData, setFormData] = useState<LeaseFormData>({
    jurisdiction: {
      country: 'US',
      state: 'CA',
      city: 'San Francisco'
    },
    term: {
      startDate: new Date().toISOString().split('T')[0],
      months: 12,
      renewal: 'none'
    },
    financials: {
      monthlyRent: 0,
      securityDeposit: 0,
      prorationMethod: 'actual_days',
      utilitiesIncluded: []
    },
    pets: {
      allowed: false,
      fee: 0,
      deposit: 0,
      rent: 0
    },
    rules: {
      smoking: 'prohibited',
      subletting: 'prohibited',
      alterations: 'with_consent',
      insuranceRequired: false
    },
    notices: {
      delivery: 'both'
    },
    signatures: {
      method: 'e-sign' as const
    },
    property: {
      address: '',
      type: 'apartment'
    },
    landlord: {
      name: '',
      address: ''
    },
    tenant: {
      name: '',
      email: ''
    }
  });

  const updateFormData = (updates: Partial<LeaseFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Your Lease Agreement</h2>
        
        {/* Property Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Property Information</h3>
          
          <Field
            label="Property Address"
            name="propertyAddress"
            type="text"
            value={formData.property.address}
            onChange={(value) => updateFormData({ 
              property: { ...formData.property, address: value } 
            })}
            placeholder="e.g., 123 Main St, San Francisco, CA 94102"
            required
          />
          
          <Field
            label="Property Type"
            name="propertyType"
            type="select"
            value={formData.property.type || 'apartment'}
            onChange={(value) => updateFormData({ 
              property: { ...formData.property, type: value as any } 
            })}
            options={[
              { value: 'apartment', label: 'Apartment' },
              { value: 'house', label: 'House' },
              { value: 'condo', label: 'Condominium' },
              { value: 'duplex', label: 'Duplex' },
              { value: 'townhouse', label: 'Townhouse' }
            ]}
          />
        </div>

        {/* Landlord Information */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold text-gray-900">Landlord Information</h3>
          
          <Field
            label="Landlord Name"
            name="landlordName"
            type="text"
            value={formData.landlord.name}
            onChange={(value) => updateFormData({ 
              landlord: { ...formData.landlord, name: value } 
            })}
            placeholder="e.g., Joshua Kain"
            required
          />
          
          <Field
            label="Landlord Address"
            name="landlordAddress"
            type="text"
            value={formData.landlord.address}
            onChange={(value) => updateFormData({ 
              landlord: { ...formData.landlord, address: value } 
            })}
            placeholder="e.g., 123 Main St, San Francisco, CA 94102"
            required
          />
        </div>

        {/* Tenant Information */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold text-gray-900">Tenant Information</h3>
          
          <Field
            label="Tenant Name"
            name="tenantName"
            type="text"
            value={Array.isArray(formData.tenant) ? formData.tenant[0]?.name || '' : formData.tenant.name}
            onChange={(value) => updateFormData({ 
              tenant: Array.isArray(formData.tenant) 
                ? [{ name: value, email: '' }]
                : { name: value, email: formData.tenant.email || '' }
            })}
            placeholder="e.g., John Doe"
            required
          />
        </div>

        {/* Financial Information */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
          
          <Field
            label="Monthly Rent"
            name="monthlyRent"
            type="number"
            value={formData.financials.monthlyRent}
            onChange={(value) => updateFormData({ 
              financials: { ...formData.financials, monthlyRent: parseFloat(value) || 0 } 
            })}
            placeholder="e.g., 2500"
            required
          />
          
          <Field
            label="Security Deposit"
            name="securityDeposit"
            type="number"
            value={formData.financials.securityDeposit}
            onChange={(value) => updateFormData({ 
              financials: { ...formData.financials, securityDeposit: parseFloat(value) || 0 } 
            })}
            placeholder="e.g., 2500"
          />
        </div>

        {/* Lease Terms */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold text-gray-900">Lease Terms</h3>
          
          <Field
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.term.startDate}
            onChange={(value) => updateFormData({ 
              term: { ...formData.term, startDate: value } 
            })}
            required
          />
          
          <Field
            label="Lease Duration (months)"
            name="months"
            type="number"
            value={formData.term.months || 12}
            onChange={(value) => updateFormData({ 
              term: { ...formData.term, months: parseInt(value) || 12 } 
            })}
            placeholder="e.g., 12"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating Lease...' : 'Generate Lease Agreement'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SimpleLeaseForm;

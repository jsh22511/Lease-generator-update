interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
}

interface CostData {
  tokens: TokenUsage;
  estimatedCost: number;
  model: string;
  timestamp: string;
}

// Model pricing (per 1K tokens) - update as needed
const MODEL_PRICING = {
  'gpt-4o-mini': {
    input: 0.00015,
    output: 0.0006,
  },
  'gpt-4o': {
    input: 0.005,
    output: 0.015,
  },
  'gpt-3.5-turbo': {
    input: 0.0015,
    output: 0.002,
  },
  'gpt-4': {
    input: 0.03,
    output: 0.06,
  },
};

export function calculateCost(tokens: TokenUsage, model: string): number {
  const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING];
  if (!pricing) {
    console.warn(`Unknown model pricing for ${model}, using default`);
    return 0;
  }

  const inputCost = (tokens.prompt / 1000) * pricing.input;
  const outputCost = (tokens.completion / 1000) * pricing.output;
  
  return inputCost + outputCost;
}

export function logTokenUsage(tokens: TokenUsage, model: string, context: string = ''): void {
  const cost = calculateCost(tokens, model);
  const costData: CostData = {
    tokens,
    estimatedCost: cost,
    model,
    timestamp: new Date().toISOString(),
  };

  // Console logging
  console.log(`[TELEMETRY] ${context}`, {
    model,
    tokens: tokens.total,
    cost: `$${cost.toFixed(6)}`,
    breakdown: {
      prompt: tokens.prompt,
      completion: tokens.completion,
    },
  });

  // Webhook logging (if configured)
  if (process.env.COST_WEBHOOK_URL) {
    sendCostWebhook(costData).catch(error => {
      console.error('Failed to send cost webhook:', error);
    });
  }
}

async function sendCostWebhook(costData: CostData): Promise<void> {
  try {
    const response = await fetch(process.env.COST_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'cost_tracking',
        data: costData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Cost webhook error:', error);
  }
}

// Daily cost tracking
class DailyCostTracker {
  private dailyTotal: number = 0;
  private lastReset: string = new Date().toDateString();
  private maxDailyCost: number = 10; // $10 default limit

  addCost(cost: number): boolean {
    const today = new Date().toDateString();
    
    // Reset if new day
    if (today !== this.lastReset) {
      this.dailyTotal = 0;
      this.lastReset = today;
    }

    this.dailyTotal += cost;
    
    // Check if over limit
    if (this.dailyTotal > this.maxDailyCost) {
      console.error(`Daily cost limit exceeded: $${this.dailyTotal.toFixed(2)} > $${this.maxDailyCost}`);
      return false;
    }

    console.log(`Daily cost: $${this.dailyTotal.toFixed(6)} / $${this.maxDailyCost}`);
    return true;
  }

  getDailyTotal(): number {
    return this.dailyTotal;
  }

  setMaxDailyCost(max: number): void {
    this.maxDailyCost = max;
  }
}

// Global daily cost tracker
const dailyTracker = new DailyCostTracker();

export function trackDailyCost(cost: number): boolean {
  return dailyTracker.addCost(cost);
}

export function getDailyCostTotal(): number {
  return dailyTracker.getDailyTotal();
}

export function setMaxDailyCost(max: number): void {
  dailyTracker.setMaxDailyCost(max);
}

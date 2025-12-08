export interface StepRole {
  id: string
  name: string
}

export interface Step {
  id: string
  stepOrder: number
  stepType: 'CREATE' | 'REVIEW' | 'APPROVE'
  role: StepRole
}

export interface Rule {
  id: string
  name: string
  minAmount: string
  maxAmount: string | null
  steps: Step[]
}

export interface RulesParams {
  page?: number
  limit?: number
  search?: string
}

export interface CreateRuleRequest {
  name: string
  minAmount: number
  maxAmount?: number | null
  steps: {
    stepOrder: number
    stepType: 'CREATE' | 'REVIEW' | 'APPROVE'
    roleId: string
  }[]
}

export interface UpdateRuleRequest {
  name?: string
  minAmount?: number
  maxAmount?: number | null
}

export interface UpdateRuleStepsRequest {
  steps: {
    stepOrder: number
    roleId: string
  }[]
}

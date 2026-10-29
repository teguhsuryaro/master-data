'use server';

import {
  getNextProductCode,
  getNextSupplierCode,
  getNextCustomerCode,
  getNextAccountCodeSuggestion,
} from '@/lib/code-generator';

export async function getNextProductCodeAction(): Promise<string> {
  return await getNextProductCode();
}

export async function getNextSupplierCodeAction(): Promise<string> {
  return await getNextSupplierCode();
}

export async function getNextCustomerCodeAction(): Promise<string> {
  return await getNextCustomerCode();
}

export async function getNextAccountCodeSuggestionAction(type: string): Promise<string> {
  return await getNextAccountCodeSuggestion(type);
}

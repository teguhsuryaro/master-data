import 'dotenv/config';
import { getSuppliersWithStatsAction } from '../src/actions/supplier-actions';
import { getCustomersAction } from '../src/actions/customer-actions';
import { getNextSupplierCode, getNextCustomerCode } from '../src/lib/code-generator';

async function testFase5() {
  console.log('--- Testing Fase 5 Backend & Data ---');

  const nextSup = await getNextSupplierCode();
  const nextCus = await getNextCustomerCode();
  console.log('Next Supplier Code:', nextSup);
  console.log('Next Customer Code:', nextCus);

  const suppliers = await getSuppliersWithStatsAction();
  console.log('Fetched Suppliers count:', suppliers.length);
  if (suppliers.length > 0) {
    console.log('Sample Supplier:', {
      code: suppliers[0].supplierCode,
      name: suppliers[0].supplierName,
      category: suppliers[0].categorySupplied,
      phone: suppliers[0].phone,
    });
  }

  const customers = await getCustomersAction();
  console.log('Fetched Customers count:', customers.length);
  if (customers.length > 0) {
    console.log('Sample Customer:', {
      code: customers[0].customerCode,
      name: customers[0].customerName,
      type: customers[0].customerType,
      phone: customers[0].phone,
    });
  }

  console.log('--- Fase 5 Test Completed Successfully ---');
}

testFase5().catch(console.error);

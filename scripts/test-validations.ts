import {
  accountSchema,
  unitSchema,
  productSchema,
  supplierSchema,
  customerSchema,
} from '../src/lib/validations';

function testValidations() {
  console.log('Testing Zod validations...');

  // 1. Account Schema test
  const validAcc = accountSchema.safeParse({
    accountCode: '1-01-01',
    accountName: 'Kas Operasional',
    accountType: 'Aset Lancar',
    normalBalance: 'Debit',
    initialBalance: 5000000,
  });
  console.log('Valid Account parse:', validAcc.success);

  const invalidAccCode = accountSchema.safeParse({
    accountCode: '10101', // wrong pattern
    accountName: 'Kas',
    accountType: 'Aset Lancar',
    normalBalance: 'Debit',
    initialBalance: 5000000,
  });
  console.log('Invalid Account code rejected:', !invalidAccCode.success);

  // 2. Unit Schema test
  const validUnit = unitSchema.safeParse({
    unitCode: 'UNIT',
    unitName: 'Unit',
  });
  console.log('Valid Unit parse:', validUnit.success);

  // 3. Product Schema test
  const validProd = productSchema.safeParse({
    productCode: 'BRG001',
    productName: 'HT Single Band UHF',
    category: 'Komunikasi',
    unitCode: 'UNIT',
    purchasePrice: 185000,
    rentalPrice: 10000,
    stockQty: 25,
  });
  console.log('Valid Product parse:', validProd.success);

  const negPriceProd = productSchema.safeParse({
    productCode: 'BRG001',
    productName: 'HT Single Band UHF',
    category: 'Komunikasi',
    unitCode: 'UNIT',
    purchasePrice: -100, // negative not allowed
    rentalPrice: 10000,
    stockQty: 25,
  });
  console.log('Negative price rejected:', !negPriceProd.success);

  // 4. Supplier Schema test
  const validSup = supplierSchema.safeParse({
    supplierCode: 'SUP001',
    supplierName: 'PT Sumber Frekuensi Indonesia',
    phone: '0811-2600-001',
  });
  console.log('Valid Supplier parse:', validSup.success);

  // 5. Customer Schema test
  const validCus = customerSchema.safeParse({
    customerCode: 'CUS001',
    customerName: 'BEM Universitas Jenderal Soedirman',
    customerType: 'Organisasi Kampus',
    phone: '0812-2700-1001',
  });
  console.log('Valid Customer parse:', validCus.success);
}

testValidations();

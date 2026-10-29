import 'dotenv/config';
import {
  getNextProductCode,
  getNextSupplierCode,
  getNextCustomerCode,
  getNextAccountCodeSuggestion,
  getAutoNormalBalance,
} from '../src/lib/code-generator';

async function main() {
  console.log('Testing code generators...');
  const nextProd = await getNextProductCode();
  const nextSup = await getNextSupplierCode();
  const nextCus = await getNextCustomerCode();
  const nextAset = await getNextAccountCodeSuggestion('Aset Lancar');
  const nextBeban = await getNextAccountCodeSuggestion('Beban');

  console.log('Next Product Code (should be BRG015):', nextProd);
  console.log('Next Supplier Code (should be SUP007):', nextSup);
  console.log('Next Customer Code (should be CUS011):', nextCus);
  console.log('Next Aset Lancar Code:', nextAset);
  console.log('Next Beban Code:', nextBeban);
  console.log('Auto Balance Aset Tetap:', getAutoNormalBalance('Aset Tetap'));
  console.log('Auto Balance Akumulasi Penyusutan:', getAutoNormalBalance('Aset Tetap', 'Akumulasi Penyusutan Peralatan'));
  console.log('Auto Balance Liabilitas:', getAutoNormalBalance('Liabilitas'));
}

main().catch(console.error);
